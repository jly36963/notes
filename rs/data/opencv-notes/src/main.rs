use num::clamp;
use opencv::core::{
    add_def, add_weighted, convert_scale_abs, copy_make_border_def, flip, max, min, multiply_def,
    no_array, normalize, pow, rotate, split, subtract_def, KeyPoint, Mat, MatExprTraitConst,
    MatTrait, ModifyInplace, Scalar, Size, Vec3b, VecN, Vector, BORDER_CONSTANT, BORDER_DEFAULT,
    CV_32F, CV_64F, CV_8U, NORM_MINMAX, ROTATE_180,
};
use opencv::dnn_superres::DnnSuperResImpl;
use opencv::features2d::{draw_keypoints, DrawMatchesFlags, ORB_ScoreType, AKAZE, KAZE, ORB};
use opencv::imgcodecs::{imread, imread_def, imwrite, imwrite_def, IMREAD_GRAYSCALE};
use opencv::imgproc::{
    adaptive_threshold, canny_def, corner_harris_def, cvt_color_def, dilate_def, equalize_hist,
    erode_def, gaussian_blur_def, get_rotation_matrix_2d, laplacian, morphology_ex_def, resize,
    resize_def, sobel_def, threshold, warp_affine_def, ADAPTIVE_THRESH_GAUSSIAN_C, COLOR_BGR2GRAY,
    COLOR_BGR2HLS, COLOR_BGR2HSV, COLOR_BGR2RGB, COLOR_HSV2BGR, INTER_AREA, MORPH_CLOSE,
    MORPH_GRADIENT, MORPH_OPEN, THRESH_BINARY,
};
use opencv::photo::fast_nl_means_denoising_colored;
use opencv::prelude::{DnnSuperResImplTrait, Feature2DTrait, MatTraitConst, MatTraitConstManual};
use peroxide::statistics::stat::OrderedStat;
use std::fs;
use std::path::{Path, PathBuf};

// ---
// Constants
// ---

const DATA_DIR: &str = "data";
const INPUT_DIR: &str = "input";
const OUTPUT_DIR: &str = "output";

// ---
// Main
// ---

fn main() {
    let examples: Vec<(&str, fn() -> ())> = vec![
        ("setup", setup),
        ("import and export", import_and_export),
        ("mat methods", mat_methods),
        ("bands", bands),
        ("grayscale", grayscale),
        ("resizing", resizing),
        ("rotation", rotation),
        ("flipping", flipping),
        ("brightening", brightening),
        ("adjusting contrast", adjusting_contrast),
        ("thresholding", thresholding),
        ("gamma correction", gamma_correction),
        ("blurring", blurring),
        ("morphological operators", morphological_operators),
        ("gradients", gradients),
        ("histogram_equalization", histogram_equalization),
        ("corner_detection", corner_detection),
        ("canny_edge_detector", canny_edge_detector),
        ("feature_detection", feature_detection),
        ("feature_matching", feature_matching),
        ("upscaling", upscaling),
        ("denoising", denoising),
    ];

    for (title, example_func) in examples {
        print_section_header(title.into());
        example_func();
    }
}

// ---
// Utils
// ---

fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

fn get_input_fp(filename: &str) -> PathBuf {
    Path::new(DATA_DIR).join(INPUT_DIR).join(filename)
}

fn get_output_fp(filename: &str) -> PathBuf {
    Path::new(DATA_DIR).join(OUTPUT_DIR).join(filename)
}

fn read_image(filepath: &str) -> Mat {
    imread_def(filepath).unwrap()
}

fn read_image_with_options(filepath: &str, flags: i32) -> Mat {
    imread(filepath, flags).unwrap()
}

fn write_image(filepath: &str, img: &Mat) {
    imwrite_def(filepath, img).unwrap();
}

fn _write_image_with_options(filepath: &str, img: &Mat, params: &Vector<i32>) {
    imwrite(filepath, img, params).unwrap();
}

// ---
// Utils (arithmetic)
// ---

fn img_pow(img: &mut Mat, value: f64) {
    unsafe {
        img.modify_inplace(|input, output| {
            pow(input, value, output).unwrap();
        })
    }
}

fn _img_max(img: &mut Mat, value: f64) {
    max(&img.clone(), &value, img).unwrap();
}

fn _img_min(img: &mut Mat, value: f64) {
    min(&img.clone(), &value, img).unwrap();
}

fn _img_add(img: &mut Mat, value: f64) {
    add_def(&img.clone(), &value, img).unwrap();
}

fn _img_sub(img: &mut Mat, value: f64) {
    subtract_def(&img.clone(), &value, img).unwrap();
}

fn img_mul(img: &mut Mat, value: f64) {
    multiply_def(&img.clone(), &value, img).unwrap();
}

fn img_div(img: &mut Mat, value: f64) {
    multiply_def(&img.clone(), &(1.0 / value), img).unwrap();
}

// ---
// Examples
// ---

fn setup() {
    println!("Creating data directories.");

    let dirs: Vec<PathBuf> = vec![
        Path::new(DATA_DIR).into(),
        Path::new(DATA_DIR).join(INPUT_DIR),
        Path::new(DATA_DIR).join(OUTPUT_DIR),
    ];
    for dir in dirs {
        fs::create_dir_all(dir).unwrap();
    }
}

fn import_and_export() {
    let filenames = vec!["polaris.jpg", "beach.jpg", "orchid.jpg", "tree.jpg"];
    for filename in filenames {
        let input_fp = get_input_fp(filename);
        let img = read_image(input_fp.to_str().unwrap());
        let output_fp = get_output_fp(filename);
        write_image(output_fp.to_str().unwrap(), &img);
    }
}

fn mat_methods() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let img = read_image(input_fp.to_str().unwrap());

    let results = vec![
        format!("img.typ(): {}", img.typ()),
        format!("img.depth(): {}", img.depth()),
        format!("img.channels(): {}", img.channels()),
        format!("img.size(): {:?}", img.size().unwrap()),
        format!("img.dims(): {}", img.dims()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn bands() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);

    let mut img1 = read_image(input_fp.to_str().unwrap());
    // cvt_color_def(&img1.clone(), &mut img1, COLOR_BGR2RGB).unwrap();
    unsafe {
        img1.modify_inplace(|input, output| {
            cvt_color_def(input, output, COLOR_BGR2RGB).unwrap();
        })
    }

    let output_fp1 = get_output_fp("polaris-bands-rgb.jpg");
    write_image(output_fp1.to_str().unwrap(), &img1);

    let mut img2 = read_image(input_fp.to_str().unwrap());
    // cvt_color_def(&img2.clone(), &mut img2, COLOR_BGR2HLS).unwrap();
    unsafe {
        img2.modify_inplace(|input, output| {
            cvt_color_def(input, output, COLOR_BGR2HLS).unwrap();
        })
    }
    let output_fp2 = get_output_fp("polaris-bands-hsl.jpg");
    write_image(output_fp2.to_str().unwrap(), &img2);
}

fn grayscale() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let img = read_image_with_options(input_fp.to_str().unwrap(), IMREAD_GRAYSCALE);
    let output_fp = get_output_fp("polaris-gray.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn resizing() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut i1 = read_image(input_fp.to_str().unwrap());
    let mut i2 = i1.clone();

    // Known size
    resize_def(&i1.clone(), &mut i1, (500, 500).into()).unwrap();
    let output_fp1 = get_output_fp("polaris-resize-1.jpg");
    write_image(output_fp1.to_str().unwrap(), &i1);

    // Computed size
    resize(&i2.clone(), &mut i2, (0, 0).into(), 0.5, 0.5, INTER_AREA).unwrap();
    let output_fp2 = get_output_fp("polaris-resize-2.jpg");
    write_image(output_fp2.to_str().unwrap(), &i2);
}

/// Add padding around an image (in place).
fn add_padding(img: &mut Mat) {
    // Other angles
    let Size { height, width } = img.size().unwrap();
    let (pad_x, pad_y) = (height / 2, width / 2);
    copy_make_border_def(
        &img.clone(),
        img,
        pad_y,
        pad_y,
        pad_x,
        pad_x,
        BORDER_CONSTANT,
    )
    .unwrap();
}

fn rotate_by_angle(img: &mut Mat, angle: f64, scale: f64) {
    let Size { height, width } = img.size().unwrap();
    let center = ((height / 2) as f32, (width / 2) as f32);
    let rm = get_rotation_matrix_2d(center.into(), angle, scale).unwrap();
    warp_affine_def(&img.clone(), img, &rm, (height, width).into()).unwrap();
}

fn rotation() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut img1 = read_image(input_fp.to_str().unwrap());
    let mut img2 = img1.clone();

    // Simple angles (multiples of 90)
    rotate(&img1.clone(), &mut img1, ROTATE_180).unwrap();
    let output_fp1 = get_output_fp("polaris-rotate-1.jpg");
    write_image(output_fp1.to_str().unwrap(), &img1);

    // Other angles
    add_padding(&mut img2);
    rotate_by_angle(&mut img2, 45.0, 1.0);
    let output_fp2 = get_output_fp("polaris-rotate-2.jpg");
    write_image(output_fp2.to_str().unwrap(), &img2);
}

fn flipping() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());
    flip(&img.clone(), &mut img, 0).unwrap();
    let output_fp = get_output_fp("polaris-flip.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn brightening() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());
    convert_scale_abs(&img.clone(), &mut img, 1.05, 10.0).unwrap();
    let output_fp = get_output_fp("polaris-brighten.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn adjust_contrast(
    img: &mut Mat,
    contrast: f64,  // 0.0 to 1.0
    brightness: i8, // -255 to 255
) {
    let gamma = brightness as f64 + (255.0 * (1.0 - contrast) / 2.0);
    add_weighted(
        &img.clone(),
        contrast,
        &img.clone(),
        0.0,
        gamma as f64,
        img,
        -1,
    )
    .unwrap()
}

fn adjusting_contrast() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());
    adjust_contrast(&mut img, 1.3, 0);
    let output_fp = get_output_fp("polaris-contrast.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn thresholding() {
    let filename = "orchid.jpg";
    let input_fp = get_input_fp(filename);
    let mut img1 = read_image_with_options(input_fp.to_str().unwrap(), IMREAD_GRAYSCALE);
    let mut img2 = img1.clone();

    threshold(&img1.clone(), &mut img1, 100.0, 255.0, THRESH_BINARY).unwrap();
    let output_fp1 = get_output_fp("polaris-threshold.jpg");
    write_image(output_fp1.to_str().unwrap(), &img1);

    adaptive_threshold(
        &img2.clone(),
        &mut img2,
        255.0,
        ADAPTIVE_THRESH_GAUSSIAN_C,
        THRESH_BINARY,
        11,
        2.0,
    )
    .unwrap();
    let output_fp2 = get_output_fp("polaris-threshold-adaptive.jpg");
    write_image(output_fp2.to_str().unwrap(), &img2);
}

fn gamma_correct(img: &mut Mat, gamma: f64) {
    // brighter: `0 < γ < 1`; darker: `γ > 1`
    // let img = Mat::ones(img.shape().unwrap()).unwrap();

    img.clone().convert_to_def(img, CV_64F).unwrap();
    img_div(img, 255.0);
    img_pow(img, gamma); // Must be CV_64F (instead of integer-based)
    img_mul(img, 255.0);
    img.clone().convert_to_def(img, CV_8U).unwrap();
}

fn gamma_correction() {
    let filename = "orchid.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());
    let gamma = 3.0 / 4.0;
    gamma_correct(&mut img, gamma);
    let output_fp = get_output_fp("orchid-gamma.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn blurring() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());
    gaussian_blur_def(&img.clone(), &mut img, (3, 3).into(), 10.0).unwrap();
    let output_fp = get_output_fp("polaris-blur-gaussian.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn morphological_operators() {
    let filename = "beach.jpg";
    let input_fp = get_input_fp(filename);
    let beach_img = read_image(input_fp.to_str().unwrap());

    // Erode (decrease white area)
    (|| {
        let mut img = beach_img.clone();
        let erode_kernel = Mat::ones(5, 5, CV_8U).unwrap().to_mat().unwrap();
        erode_def(&img.clone(), &mut img, &erode_kernel).unwrap();
        let output_fp = get_output_fp("beach-erode.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Dilate (increase white area)
    (|| {
        let mut img = beach_img.clone();
        let dilate_kernel = Mat::ones(5, 5, CV_8U).unwrap().to_mat().unwrap();
        dilate_def(&img.clone(), &mut img, &dilate_kernel).unwrap();
        let output_fp = get_output_fp("beach-dilate.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Opening (erode, then dilate) (remove white noise)
    (|| {
        let mut img = beach_img.clone();
        let opening_kernel = Mat::ones(5, 5, CV_8U).unwrap().to_mat().unwrap();
        morphology_ex_def(&img.clone(), &mut img, MORPH_OPEN, &opening_kernel).unwrap();
        let output_fp = get_output_fp("beach-open.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Closing (dilate, then erode) (remove black noise)
    (|| {
        let mut img = beach_img.clone();
        let closing_kernel = Mat::ones(5, 5, CV_8U).unwrap().to_mat().unwrap();
        morphology_ex_def(&img.clone(), &mut img, MORPH_CLOSE, &closing_kernel).unwrap();
        let output_fp = get_output_fp("beach-close.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Morphological Gradient (dilation - erosion)
    (|| {
        let mut img = beach_img.clone();
        let gradient_kernel = Mat::ones(5, 5, CV_8U).unwrap().to_mat().unwrap();
        morphology_ex_def(&img.clone(), &mut img, MORPH_GRADIENT, &gradient_kernel).unwrap();
        let output_fp = get_output_fp("beach-gradient.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();
}

fn gradients() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let src_img = read_image_with_options(input_fp.to_str().unwrap(), IMREAD_GRAYSCALE);

    // Sobel X
    (|| {
        let mut img = src_img.clone();
        sobel_def(&img.clone(), &mut img, CV_64F, 1, 0).unwrap();
        let output_fp = get_output_fp("polaris-gradients-sobel-x.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Sobel Y
    (|| {
        let mut img = src_img.clone();
        sobel_def(&img.clone(), &mut img, CV_64F, 0, 1).unwrap();
        let output_fp = get_output_fp("polaris-gradients-sobel-y.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Laplacian
    (|| {
        let mut img = src_img.clone();
        laplacian(&img.clone(), &mut img, CV_64F, 5, 1.0, 0.0, BORDER_DEFAULT).unwrap();
        let output_fp = get_output_fp("polaris-gradients-laplacian.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();
}

fn equalize_histogram(img: &mut Mat) {
    cvt_color_def(&img.clone(), img, COLOR_BGR2HSV).unwrap();
    let mut channels: Vector<Mat> = Vector::new();
    split(&img.clone(), &mut channels).unwrap();
    let mut channel = channels.get(2).unwrap();
    equalize_hist(&channel.clone(), &mut channel).unwrap();
    channels.set(2, channel).unwrap();
    cvt_color_def(&img.clone(), img, COLOR_HSV2BGR).unwrap();
}

fn histogram_equalization() {
    let filename = "beach.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());
    equalize_histogram(&mut img);
    let output_fp = get_output_fp("beach-histogram-equalization-color.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn corner_detection() {
    let filename = "tree.jpg";
    let input_fp = get_input_fp(filename);
    let src_img = read_image(input_fp.to_str().unwrap());
    let img_gray = (|| {
        let mut img = src_img.clone();
        cvt_color_def(&img.clone(), &mut img, COLOR_BGR2GRAY).unwrap();
        let output_fp = get_output_fp("tree-gray.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
        img
    })();

    let img_corners = (|| {
        let mut img = img_gray.clone();
        img.clone().convert_to_def(&mut img, CV_32F).unwrap();
        corner_harris_def(&img.clone(), &mut img, 2, 3, 0.04).unwrap();
        let dilate_kernel = Mat::ones(5, 5, CV_8U).unwrap().to_mat().unwrap();
        dilate_def(&img.clone(), &mut img, &dilate_kernel).unwrap();
        normalize(
            &img.clone(),
            &mut img,
            0.0,
            255.0,
            NORM_MINMAX,
            -1,
            &no_array(),
        )
        .unwrap();
        // Threshold at 15
        threshold(&img.clone(), &mut img, 15.0, 255.0, THRESH_BINARY).unwrap();
        img.clone().convert_to_def(&mut img, CV_8U).unwrap();
        let output_fp = get_output_fp("tree-corners-harris.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
        img
    })();

    let _img_highlighted = (|| {
        let mut img = src_img.clone();
        let Size { height, width } = img.size().unwrap();
        for y in 0..height {
            for x in 0..width {
                let corners_pixel = img_corners.at_2d::<VecN<u8, 1>>(y, x).unwrap();
                let is_corner = corners_pixel[0] > 100;
                if is_corner {
                    let highlighted_pixel = img.at_2d_mut::<Vec3b>(y, x).unwrap();
                    *highlighted_pixel = Vec3b::from([0, 255, 0]);
                }
            }
        }
        let output_fp = get_output_fp("tree-corners-harris-highlighted.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
        img
    })();
}

fn canny_edge_detector() {
    let filename = "tree.jpg";
    let input_fp = get_input_fp(filename);
    let mut src_img = read_image(input_fp.to_str().unwrap());
    gaussian_blur_def(&src_img.clone(), &mut src_img, (5, 5).into(), 10.0).unwrap();

    // Manual thresholds
    (|| {
        let mut img = src_img.clone();
        canny_def(&img.clone(), &mut img, 100.0, 150.0).unwrap();
        let output_fp = get_output_fp("tree-canny-edge-detector.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Median-based thresholds
    (|| {
        let mut img = src_img.clone();
        let median = (|| {
            let mut img_gray = img.clone();
            cvt_color_def(&img_gray.clone(), &mut img_gray, COLOR_BGR2GRAY).unwrap();
            let vec_2d: Vec<Vec<u8>> = img_gray.to_vec_2d().unwrap();
            let vec_flat: Vec<f64> = vec_2d.into_iter().flatten().map(|v| v as f64).collect();
            let median = vec_flat.median();
            median
        })();
        let thresh1 = clamp(f64::max(0.0, median * 0.8), 0.0, 255.0);
        let thresh2 = clamp(f64::max(0.0, median * 1.2), 0.0, 255.0);

        canny_def(&img.clone(), &mut img, thresh1, thresh2).unwrap();
        let output_fp = get_output_fp("tree-canny-edge-detector-2.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();
}

fn feature_detection() {
    let filename = "tree.jpg";
    let input_fp = get_input_fp(filename);
    let mut src_img = read_image(input_fp.to_str().unwrap());
    gaussian_blur_def(&src_img.clone(), &mut src_img, (5, 5).into(), 10.0).unwrap();

    // Orb Harris Corner
    (|| {
        let mut img = src_img.clone();
        let mut orb =
            ORB::create(5000, 1.2, 8, 15, 0, 2, ORB_ScoreType::HARRIS_SCORE, 31, 20).unwrap();

        let mask = Mat::default();
        let mut keypoints: Vector<KeyPoint> = Vector::default();
        let mut descriptors = Mat::default();
        orb.detect_and_compute_def(&img.clone(), &mask, &mut keypoints, &mut descriptors)
            .unwrap();
        draw_keypoints(
            &img.clone(),
            &keypoints,
            &mut img,
            Scalar::from_array([0.0, 255.0, 0.0, 0.0]),
            DrawMatchesFlags::DEFAULT,
        )
        .unwrap();
        let output_fp = get_output_fp("tree-feature-detection-orb-harris-corner.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Kaze Blob
    (|| {
        let mut img = src_img.clone();
        let mut kaze = KAZE::create_def().unwrap();

        let mask = Mat::default();
        let mut keypoints: Vector<KeyPoint> = Vector::default();
        let mut descriptors = Mat::default();
        kaze.detect_and_compute_def(&img.clone(), &mask, &mut keypoints, &mut descriptors)
            .unwrap();
        draw_keypoints(
            &img.clone(),
            &keypoints,
            &mut img,
            Scalar::from_array([0.0, 255.0, 0.0, 0.0]),
            DrawMatchesFlags::DEFAULT,
        )
        .unwrap();
        let output_fp = get_output_fp("tree-feature-detection-kaze-blob.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();

    // Akaze Blob
    (|| {
        let mut img = src_img.clone();
        let mut akaze = AKAZE::create_def().unwrap();

        let mask = Mat::default();
        let mut keypoints: Vector<KeyPoint> = Vector::default();
        let mut descriptors = Mat::default();
        akaze
            .detect_and_compute_def(&img.clone(), &mask, &mut keypoints, &mut descriptors)
            .unwrap();
        draw_keypoints(
            &img.clone(),
            &keypoints,
            &mut img,
            Scalar::from_array([0.0, 255.0, 0.0, 0.0]),
            DrawMatchesFlags::DEFAULT,
        )
        .unwrap();
        let output_fp = get_output_fp("tree-feature-detection-akaze-blob.jpg");
        write_image(output_fp.to_str().unwrap(), &img);
    })();
}

fn feature_matching() {
    // ...
}

fn get_superres() -> DnnSuperResImpl {
    let mut sr = DnnSuperResImpl::default().unwrap();
    let model_path = Path::new("models").join("FSRCNN_x2.pb");
    sr.read_model(model_path.to_str().unwrap()).unwrap();
    sr.set_model("fsrcnn", 2).unwrap();
    sr
}

fn upscaling() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());

    let mut sr = get_superres();
    sr.upsample(&img.clone(), &mut img).unwrap();

    let output_fp = get_output_fp("polaris-upscaled.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}

fn denoising() {
    let filename = "polaris.jpg";
    let input_fp = get_input_fp(filename);
    let mut img = read_image(input_fp.to_str().unwrap());

    fast_nl_means_denoising_colored(&img.clone(), &mut img, 5.0, 5.0, 5, 5).unwrap();
    let output_fp = get_output_fp("polaris-denoised.jpg");
    write_image(output_fp.to_str().unwrap(), &img);
}
