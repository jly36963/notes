"""OpenCV examples."""

# ruff: noqa: E1101,E0401
# pylint: disable=E1101,E0401,E0611

from pathlib import Path
from typing import cast

import cv2
import cv2.flann  # type: ignore [reportMissingImports]
import matplotlib.pyplot as plt
import numpy as np
from cv2.dnn_superres import DnnSuperResImpl  # type: ignore [reportMissingImports]
from scipy import ndimage

# OpenCV (Open Source Computer Vision) is written in C++ (has Python bindings)
# Docs: https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html

# ---
# Constants
# ---

DATA_DIR = Path("data")
INPUT_DIR = DATA_DIR / "input"
OUTPUT_DIR = DATA_DIR / "output"


# ---
# Main
# ---


def main():
    """Opencv examples."""
    print_section_title("basic_import_export")
    _basic_import_export()

    print_section_title("basic_bands")
    _basic_bands()

    print_section_title("basic_reverse_bands")
    _basic_reverse_bands()

    print_section_title("basic_grayscale")
    _basic_grayscale()

    print_section_title("basic_resize")
    _basic_resize()

    print_section_title("basic_rotate")
    _basic_rotate()

    print_section_title("basic_flip")
    _basic_flip()

    print_section_title("basic_brighten")
    _basic_brighten()

    print_section_title("basic_contrast")
    _basic_contrast()

    print_section_title("basic_thresholding")
    _basic_thresholding()

    print_section_title("basic_gamma_correction")
    _basic_gamma_correction()

    print_section_title("basic_blurring")
    _basic_blurring()

    print_section_title("basic_morphological_operators")
    _basic_morphological_operators()

    print_section_title("basic_gradients")
    _basic_gradients()

    print_section_title("basic_histograms")
    _basic_histograms()

    print_section_title("basic_corner_detection")
    _basic_corner_detection()

    print_section_title("basic_canny_edge_detector")
    _basic_canny_edge_detector()

    print_section_title("basic_feature_detection")
    _basic_feature_detection()

    print_section_title("basic_feature_matching")
    _basic_feature_matching()

    print_section_title("basic_contour")
    _basic_contour()

    print_section_title("basic_upscaling")
    _basic_upscaling()

    print_section_title("basic_denoise")
    _basic_denoise()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert string to uppercase and wrap in new lines."""
    print(f"\n{string.upper()}\n")


def _get_input_fp(filename: str) -> Path:
    return INPUT_DIR / filename


def _get_output_fp(filename: str) -> Path:
    return OUTPUT_DIR / filename


def read_image(fp: Path, *args, **kwargs) -> np.ndarray:
    """Read a filepath as an image."""
    return cast(
        np.ndarray,
        cv2.imread(str(fp), *args, **kwargs),  # type: ignore [reportAttributeAccessIssue]
    )


def write_image(fp: Path, img: np.ndarray) -> None:
    """Write an image to file."""
    cv2.imwrite(str(fp), img)  # type: ignore [reportAttributeAccessIssue]


# ---
# Examples
# ---


def _basic_import_export():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)
    write_image(_get_output_fp("polaris.jpg"), img)


def _basic_bands():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)

    # matplotlib expects RGB, opencv uses BGR. this function makes the image RGB

    img1 = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    write_image(_get_output_fp("polaris-bands-rgb.jpg"), img1)

    img2 = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    write_image(_get_output_fp("polaris-bands-hsl.jpg"), img2)


def _basic_reverse_bands():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)
    # Reverse the z axis (args -- image, axis))
    img = np.flip(img, 2)
    write_image(_get_output_fp("polaris-reverse-bands.jpg"), img)


def _basic_grayscale():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp, cv2.IMREAD_GRAYSCALE)
    write_image(_get_output_fp("polaris-gray.jpg"), img)


def _basic_resize():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)

    img1 = cv2.resize(img, (500, 500))  # source, dimensions (x & y)
    write_image(_get_output_fp("polaris-resize.jpg"), img1)

    x = 0.5  # width multiplier
    y = 0.5  # height multiplier
    img2 = cv2.resize(img, (0, 0), img, x, y)  # source, zeros tuple, source, x, y
    write_image(_get_output_fp("polaris-resize-2.jpg"), img2)


def _basic_rotate():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)

    # Rotate (simple)
    img1 = cv2.rotate(img, cv2.ROTATE_180)
    write_image(_get_output_fp("polaris-rotate.jpg"), img1)

    # Pad and scale
    # TODO: cv2.getRotationMatrix2D

    # Pad and rotate 45 degrees
    h, w, _ = img.shape
    pad_x = h // 2
    pad_y = w // 2
    img2 = cv2.copyMakeBorder(
        img,
        top=pad_y,
        bottom=pad_y,
        left=pad_x,
        right=pad_x,
        borderType=cv2.BORDER_CONSTANT,
        value=[0, 0, 0],
    )
    img2 = ndimage.rotate(img, 45)
    write_image(_get_output_fp("polaris-rotate-2.jpg"), img2)


def _basic_flip():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)
    # flipCode: 0 -- flip rows (y), 1 -- flip columns (x), 2 flip bands (z)
    img = cv2.flip(img, 0)
    write_image(_get_output_fp("polaris-flip.jpg"), img)


def _basic_brighten():
    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)
    img = cv2.convertScaleAbs(img, alpha=1.05, beta=10)
    write_image(_get_output_fp("polaris-brighten.jpg"), img)


def _basic_contrast():
    def _adjust_contrast_brightness(
        img: np.ndarray,
        contrast=1.0,  # 0.0 to inf
        brightness: int = 0,  # -255 to 255
    ) -> np.ndarray:
        brightness += int(round(255 * (1 - contrast) / 2))
        return cv2.addWeighted(img, contrast, img, 0, brightness)

    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)
    img = _adjust_contrast_brightness(img, contrast=1.3, brightness=0)
    write_image(_get_output_fp("polaris-contrast.jpg"), img)


def _basic_thresholding():
    fp = _get_input_fp("orchid.jpg")
    img = read_image(fp, cv2.IMREAD_GRAYSCALE)

    _, img1 = cv2.threshold(img, thresh=100, maxval=255, type=cv2.THRESH_BINARY)
    write_image(_get_output_fp("orchid-threshold.jpg"), img1)

    img2 = cv2.adaptiveThreshold(
        img,
        maxValue=255,
        adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        thresholdType=cv2.THRESH_BINARY,
        blockSize=11,
        C=2,
    )
    write_image(_get_output_fp("orchid-threshold-adaptive.jpg"), img2)


def _basic_gamma_correction():
    fp = _get_input_fp("orchid.jpg")
    img: np.ndarray = read_image(fp)
    # 0 < γ < 1 (brighter), γ > 1 (darker)
    gamma = 3 / 4
    img = ((img / 255) ** gamma) * 255
    write_image(_get_output_fp("orchid-gamma.jpg"), img)


def _basic_blurring():
    # BLUR (concept)
    # basically takes a weighted average of a pixel with its surrounding pixels.
    # kernel example
    # 3 x 3 matrix, mutliply by values below, the sum becomes the new pixel value
    # (.0625) (.125) (.0625)
    # (.125) (.25) (.125)
    # (.0625) (.125) (.0625)

    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp)

    # Manual kernel
    manual_kernel = np.ones((3, 3), dtype=np.float32) / 9
    img1 = cv2.filter2D(img, ddepth=-1, kernel=manual_kernel, anchor=(-1, -1))
    write_image(_get_output_fp("polaris-blur-manual.jpg"), img1)

    # Built-in kernel
    img2 = cv2.blur(src=img, ksize=(3, 3))
    write_image(_get_output_fp("polaris-blur-builtin.jpg"), img2)

    # Gaussian
    img3 = cv2.GaussianBlur(img, ksize=(3, 3), sigmaX=10)  # sigmaY (std) is assumed
    write_image(_get_output_fp("polaris-blur-gaussian.jpg"), img3)

    # Median
    img4 = cv2.medianBlur(src=img, ksize=3)
    write_image(_get_output_fp("polaris-blur-median.jpg"), img4)

    # Bilateral
    img5 = cv2.bilateralFilter(src=img, d=9, sigmaColor=75, sigmaSpace=75)
    write_image(_get_output_fp("polaris-blur-bilateral.jpg"), img5)


def _basic_morphological_operators():
    fp = _get_input_fp("beach.jpg")
    img = read_image(fp)

    # Erode (decrease white area)
    erode_kernel = np.ones((5, 5), dtype=np.uint8)
    img1 = cv2.erode(img, erode_kernel, iterations=1)
    write_image(_get_output_fp("beach-erode.jpg"), img1)

    # Dilate (increase white area)
    dilate_kernel = np.ones((5, 5), dtype=np.uint8)
    img2 = cv2.dilate(img, dilate_kernel, iterations=1)
    write_image(_get_output_fp("beach-dilate.jpg"), img2)

    # Opening (erode, then dilate) (remove white noise)
    opening_kernel = np.ones((5, 5), dtype=np.uint8)
    img3 = cv2.morphologyEx(img, op=cv2.MORPH_OPEN, kernel=opening_kernel, iterations=1)
    write_image(_get_output_fp("beach-opening.jpg"), img3)

    # Closing (dilate, then erode) (remove black noise)
    closing_kernel = np.ones((5, 5), dtype=np.uint8)
    img4 = cv2.morphologyEx(
        img, op=cv2.MORPH_CLOSE, kernel=closing_kernel, iterations=1
    )
    write_image(_get_output_fp("beach-closing.jpg"), img4)

    # Morphological Gradient (dilation - erosion)
    morph_gradient_kernel = np.ones((5, 5), dtype=np.uint8)
    img5 = cv2.morphologyEx(
        img, op=cv2.MORPH_GRADIENT, kernel=morph_gradient_kernel, iterations=1
    )
    write_image(_get_output_fp("beach-morph-gradient.jpg"), img5)


def _basic_gradients():
    # image gradient is a directional change in the intensity/color of an image
    # sobel feldman operator is used to try and approximate the derivative
    # normalized x-gradient -- shows vertical edges
    # normalized y-gradient -- shows horizontal edges
    # normalized gradient magnitude -- shows edges from both directions
    # blending the results of sobel gradients (x and y) together can be helpful.

    # Gx
    # +1 0 -1
    # +2 0 -2
    # +1 0 -1

    # Gy
    # +1 +2 +1
    # 0 0 0
    # -1 -2 -1

    fp = _get_input_fp("polaris.jpg")
    img: np.ndarray = read_image(fp, 0)

    # Sobel x
    img1 = cv2.Sobel(src=img, ddepth=cv2.CV_64F, dx=1, dy=0, ksize=5)
    write_image(_get_output_fp("polaris-gradients-sobel-x.jpg"), img1)

    # Sobel y
    img2 = cv2.Sobel(src=img, ddepth=cv2.CV_64F, dx=0, dy=1, ksize=5)
    write_image(_get_output_fp("polaris-gradients-sobel-y.jpg"), img2)

    # Laplacian
    img3 = cv2.Laplacian(src=img, ddepth=cv2.CV_64F, ksize=5)
    write_image(_get_output_fp("polaris-gradients-laplacian.jpg"), img3)


# ---
# OpenCV (histograms)
# ---


def _basic_histograms():
    fp = _get_input_fp("beach.jpg")
    img = read_image(fp)

    # Histogram (one band)
    # TODO: fix
    hist1 = cv2.calcHist(
        images=[img], channels=[0], mask=None, histSize=[256], ranges=[0, 256]
    )
    write_image(_get_output_fp("beach-histogram-one-band.jpg"), hist1)

    # Histogram (three bands)
    color = ("b", "g", "r")
    for i, c in enumerate(color):
        hist = cv2.calcHist(
            images=[img], channels=[i], mask=None, histSize=[256], ranges=[0, 256]
        )
        plt.plot(hist, color=c)
    plt.savefig(_get_output_fp("beach-histogram-three-bands.png"))
    plt.clf()

    # Histogram equalization (grayscale)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img_eq = cv2.equalizeHist(img_gray)
    write_image(_get_output_fp("beach-histogram-equalization-gray.jpg"), img_eq)

    # Histogram equalization (color)
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    img_hsv[:, :, 2] = cv2.equalizeHist(img_hsv[:, :, 2])
    img_eq_color = cv2.cvtColor(img_hsv, cv2.COLOR_HSV2BGR)
    write_image(_get_output_fp("beach-histogram-equalization-color.jpg"), img_eq_color)


def _basic_corner_detection():
    # edges -- sudden change in image brightness
    # corner -- junction of two edges

    fp = _get_input_fp("tree.jpg")
    img: np.ndarray = read_image(fp)
    img_gray: np.ndarray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img_gray = np.float32(img_gray)  # type: ignore

    # Harris
    img_corners = cv2.cornerHarris(img_gray, blockSize=2, ksize=3, k=0.04)
    img_corners = cv2.dilate(img_corners, None)  # type: ignore
    write_image(_get_output_fp("tree-corners-harris.jpg"), img_corners)
    img_highlighted = img.copy()
    img_highlighted[img_corners > 0.01 * img_corners.max()] = [0, 255, 0]
    write_image(_get_output_fp("tree-corners-harris-highlighted.jpg"), img_highlighted)

    # Shi-Tomasi
    img_corners_st: np.ndarray = cv2.goodFeaturesToTrack(
        img_gray, maxCorners=50, qualityLevel=0.01, minDistance=10
    )
    img_corners_st = np.intp(img_corners_st)  # type:ignore
    img_highlighted_st = img.copy()
    for c in img_corners_st:
        x, y = c.ravel()
        cv2.circle(
            img_highlighted_st, (x, y), radius=10, color=(0, 255, 0), thickness=-1
        )
    write_image(
        _get_output_fp("tree-corners-shi-tomasi-highlighted.jpg"), img_highlighted_st
    )


def _basic_canny_edge_detector():
    # intensity gradient < threshold1 -- not an edge
    # intensity gradient > threshold2 -- edge
    # intensity gradient between thresholds -- possibly (if connected to an edge pixel)
    fp = _get_input_fp("tree.jpg")
    img = read_image(fp)

    # thresholds (used later)
    median = np.median(img)  # median pixel value # type: ignore
    thresh1 = int(max(0, median * 0.8))  # between median and 0
    thresh2 = int(min(255, median * 1.2))  # between median and 255

    img_blurred = cv2.blur(src=img, ksize=(5, 5))

    # Canny edge detector (regular)
    img_edges = cv2.Canny(image=img_blurred, threshold1=100, threshold2=150)
    write_image(_get_output_fp("tree-canny-edge-detector.jpg"), img_edges)

    # Canny edge detector (thresholds based on median)
    img_edges_manual = cv2.Canny(
        image=img_blurred, threshold1=thresh1, threshold2=thresh2
    )
    write_image(_get_output_fp("tree-canny-edge-detector-manual.jpg"), img_edges_manual)


def _basic_feature_detection():
    fp = _get_input_fp("tree.jpg")
    img = read_image(fp, 0)

    def _fd_orb_harris_corner():
        orb_config = {
            "edgeThreshold": 15,
            "patchSize": 31,
            "nlevels": 8,
            "fastThreshold": 20,
            "scaleFactor": 1.2,
            "scoreType": cv2.ORB_HARRIS_SCORE,
            "nfeatures": 5000,
            "firstLevel": 0,
        }
        orb = cv2.ORB_create(**orb_config)
        key_points, descriptors = orb.detectAndCompute(img, None)
        img_kp = cv2.drawKeypoints(img, key_points, None, color=(0, 255, 0), flags=0)
        write_image(
            _get_output_fp("tree-feature-detection-orb-harris-corner.jpg"), img_kp
        )

    _fd_orb_harris_corner()

    def _fd_kaze_blob():
        kaze = cv2.KAZE_create()
        key_points, descriptors = kaze.detectAndCompute(img, None)
        img_kp = cv2.drawKeypoints(img, key_points, None, color=(0, 255, 0), flags=0)
        write_image(_get_output_fp("tree-feature-detection-kaze-blob.jpg"), img_kp)

    _fd_kaze_blob()

    def _fd_akaze_blob():
        akaze = cv2.AKAZE_create()
        key_points, descriptors = akaze.detectAndCompute(img, None)
        img_kp = cv2.drawKeypoints(img, key_points, None, color=(0, 255, 0), flags=0)
        write_image(_get_output_fp("tree-feature-detection-akaze-blob.jpg"), img_kp)

    _fd_akaze_blob()


def _basic_feature_matching():
    fp = _get_input_fp("tree.jpg")
    img = read_image(fp, 0)

    fp_cropped = _get_input_fp("tree2.jpg")
    img_cropped = read_image(fp_cropped, 0)

    def _fm_orb_brute_force():
        orb_config = {
            "edgeThreshold": 15,
            "patchSize": 31,
            "nlevels": 8,
            "fastThreshold": 20,
            "scaleFactor": 1.2,
            "scoreType": cv2.ORB_HARRIS_SCORE,
            "nfeatures": 5000,
            "firstLevel": 0,
        }
        orb = cv2.ORB_create(**orb_config)  # type: ignore
        key_points, descriptors = orb.detectAndCompute(img, None)
        key_points_cropped, descriptors_cropped = orb.detectAndCompute(
            img_cropped, None
        )
        bf_matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf_matcher.match(descriptors, descriptors_cropped)
        matches = sorted(matches, key=lambda x: x.distance)
        # Draw first 10 matches
        img_matches = cv2.drawMatches(
            img,
            key_points,
            img_cropped,
            key_points_cropped,
            matches[:10],
            outImg=None,  # type: ignore
            flags=2,
        )
        write_image(
            _get_output_fp("tree-feature-matching-orb-brute-force.jpg"), img_matches
        )

    _fm_orb_brute_force()

    def _fm_sift_and_knn():
        # BRUTE FORCE (with SIFT and bf.knnMatch) (SIFT -- scale invariant feature transform)
        sift = cv2.SIFT_create()  # cv2.xFeatures2d.SIFT_create()
        key_points, descriptors = sift.detectAndCompute(img, None)
        key_points_cropped, descriptors_cropped = sift.detectAndCompute(
            img_cropped, None
        )
        bf = cv2.BFMatcher()

        # knnMatch -- finds the k best matches for each descriptor
        matches = bf.knnMatch(descriptors, descriptors_cropped, k=2)
        good: list[list[cv2.DMatch]] = []
        for m, n in matches:
            if m.distance < (n.distance * 0.7):
                good.append([m])
        good = sorted(good, key=lambda x: x[0].distance)[:20]

        img_matches = cv2.drawMatchesKnn(
            img,
            key_points,
            img_cropped,
            key_points_cropped,
            good,
            outImg=None,  # type: ignore
            flags=2,
        )
        write_image(
            _get_output_fp("tree-feature-matching-sift-and-knn.jpg"), img_matches
        )

    _fm_sift_and_knn()

    def _fm_orb_brute_force_knn():
        orb_config = {
            "edgeThreshold": 15,
            "patchSize": 31,
            "nlevels": 8,
            "fastThreshold": 20,
            "scaleFactor": 1.2,
            "scoreType": cv2.ORB_HARRIS_SCORE,
            "nfeatures": 5000,
            "firstLevel": 0,
        }
        orb = cv2.ORB_create(**orb_config)
        key_points, descriptors = orb.detectAndCompute(img, None)
        key_points_cropped, descriptors_cropped = orb.detectAndCompute(
            img_cropped, None
        )
        bf = cv2.BFMatcher()
        matches = bf.knnMatch(descriptors, descriptors_cropped, k=2)
        good: list[list[cv2.DMatch]] = []
        for m, n in matches:
            if m.distance < (n.distance * 0.7):
                good.append([m])
        good = sorted(good, key=lambda x: x[0].distance)[:20]
        img_matches = cv2.drawMatchesKnn(
            img,
            key_points,
            img_cropped,
            key_points_cropped,
            good,
            outImg=None,  # type: ignore
            flags=2,
        )
        write_image(
            _get_output_fp("tree-feature-matching-orb-brute-force-knn.jpg"), img_matches
        )

    _fm_orb_brute_force_knn()

    def _fm_orb_flann_knn():
        orb_config = {
            "edgeThreshold": 15,
            "patchSize": 31,
            "nlevels": 8,
            "fastThreshold": 20,
            "scaleFactor": 1.2,
            "scoreType": cv2.ORB_HARRIS_SCORE,
            "nfeatures": 1000,
            "firstLevel": 0,
        }
        orb = cv2.ORB_create(**orb_config)
        key_points, descriptors = orb.detectAndCompute(img, None)
        key_points_cropped, descriptors_cropped = orb.detectAndCompute(
            img_cropped, None
        )
        flann_index_lsh = 6
        index_params: cv2.flann.IndexParams = {
            "algorithm": flann_index_lsh,
            "table_number": 6,
            "key_size": 12,
            "multi_probe_level": 1,
        }
        search_params: cv2.flann.SearchParams = {"checks": 50}
        flann = cv2.FlannBasedMatcher(index_params, search_params)
        matches = flann.knnMatch(descriptors, descriptors_cropped, k=2)
        good: list[list[cv2.DMatch]] = []
        for m, n in matches:
            if m.distance < (n.distance * 0.7):
                good.append([m])
        good = sorted(good, key=lambda x: x[0].distance)[:20]
        img_matches = cv2.drawMatchesKnn(
            img,
            key_points,
            img_cropped,
            key_points_cropped,
            good,
            outImg=None,  # type: ignore
            flags=2,
        )
        write_image(
            _get_output_fp("tree-feature-matching-orb-flann-knn.jpg"), img_matches
        )

    _fm_orb_flann_knn()

    def _fm_akaze_flann_knn():
        akaze = cv2.AKAZE_create()
        key_points, descriptors = akaze.detectAndCompute(img, None)
        key_points_cropped, descriptors_cropped = akaze.detectAndCompute(
            img_cropped, None
        )
        FLANN_INDEX_LSH = 6
        index_params: cv2.flann.IndexParams = {
            "algorithm": FLANN_INDEX_LSH,
            "table_number": 6,
            "key_size": 12,
            "multi_probe_level": 1,
        }
        search_params: cv2.flann.SearchParams = {"checks": 50}
        flann = cv2.FlannBasedMatcher(index_params, search_params)
        matches = flann.knnMatch(descriptors, descriptors_cropped, k=2)
        good: list[list[cv2.DMatch]] = []
        for m_n in matches:
            if len(m_n) != 2:
                continue
            (m, n) = m_n
            if m.distance < (n.distance * 0.4):
                good.append([m])
        good = sorted(good, key=lambda x: x[0].distance)[:20]
        img_matches = cv2.drawMatchesKnn(
            img,
            key_points,
            img_cropped,
            key_points_cropped,
            good,
            outImg=None,  # type: ignore
            flags=2,
        )
        write_image(
            _get_output_fp("tree-feature-matching-akaze-flann-knn.jpg"), img_matches
        )

    _fm_akaze_flann_knn()

    # TODO: fix homography example

    def _fm_akaze_flann_knn_homography():
        img1 = read_image(_get_input_fp("1214a.jpg"), 0)
        img2 = read_image(_get_input_fp("1214b.jpg"), 0)

        akaze = cv2.AKAZE_create()
        kp1, des1 = akaze.detectAndCompute(img1, None)
        kp2, des2 = akaze.detectAndCompute(img2, None)
        flann_index_lsh = 6
        index_params: cv2.flann.IndexParams = {
            "algorithm": flann_index_lsh,
            "table_number": 6,
            "key_size": 12,
            "multi_probe_level": 1,
        }
        search_params: cv2.flann.SearchParams = {"checks": 50}
        flann = cv2.FlannBasedMatcher(index_params, search_params)
        matches = flann.knnMatch(des1, des2, k=2)
        good: list[list[cv2.DMatch]] = []
        for m_n in matches:
            if len(m_n) != 2:
                continue
            (m, n) = m_n
            if m.distance < (n.distance * 0.4):
                good.append([m])
        if len(good) > 4:
            list_kp1 = []
            list_kp2 = []
            for match in good:
                img1_idx = match[0].queryIdx
                img2_idx = match[0].trainIdx
                point1 = kp1[img1_idx].pt
                point2 = kp2[img2_idx].pt
                list_kp1.append(point1)
                list_kp2.append(point2)
            H, _ = cv2.findHomography(
                srcPoints=np.array(list_kp2),
                dstPoints=np.array(list_kp1),
                method=cv2.RANSAC,
                ransacReprojThreshold=4,
            )

            h, w = img.shape
            img_matches = cv2.warpPerspective(img2, H, (w, h))
            write_image(
                _get_output_fp("1214-feature-matching-akaze-flann-knn-homography.jpg"),
                img_matches,
            )

    _fm_akaze_flann_knn_homography()


def _basic_contour():
    # larger kernel size for blurring might help

    fp = _get_input_fp("geometry.jpg")
    img = read_image(fp)
    img = cv2.medianBlur(img, ksize=3)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # External contour
    def _external_contour():
        _, img_thresh = cv2.threshold(
            img_gray, thresh=160, maxval=255, type=cv2.THRESH_BINARY_INV
        )
        contours, hierarchy = cv2.findContours(
            img_thresh.copy(), mode=cv2.RETR_CCOMP, method=cv2.CHAIN_APPROX_SIMPLE
        )

        img_contour = img.copy()
        for i, c in enumerate(contours):
            if hierarchy[0][i][3] == -1:
                # Draw external contour
                img_contour = cv2.drawContours(img, contours, i, (255, 100, 100), 10)
        write_image(_get_output_fp("geometry-contour.jpg"), img_contour)

    _external_contour()

    # Watershed algorithm
    # larger kernel size for blurring might help
    # otsu's method works well with watershed algorithm
    # distance transform:
    # binary image: background (0), foreground (1)
    # foreground value increases as it gets further away from background.

    def _contour_watershed_algorithm():
        _, img_thresh = cv2.threshold(
            img_gray, thresh=160, maxval=255, type=cv2.THRESH_BINARY_INV
        )
        kernel = np.ones((3, 3), np.uint8)
        img_opening = cv2.morphologyEx(img_thresh, cv2.MORPH_OPEN, kernel, iterations=2)
        img_distance = cv2.distanceTransform(
            img_opening, distanceType=cv2.DIST_L2, maskSize=5
        )
        threshold = 0.7 * img_distance.max()
        _, img_threshold = cv2.threshold(
            img_distance, thresh=threshold, maxval=255, type=cv2.THRESH_BINARY
        )
        img_threshold: np.ndarray = np.uint8(img_threshold)  # type: ignore
        img_diff = cv2.subtract(img_opening, img_threshold)
        _, img_connected = cv2.connectedComponents(img_threshold)
        img_connected: np.ndarray = img_connected + 1
        img_connected[img_diff == 255] = 0
        img_connected = cv2.watershed(img, img_connected)
        contours, hierarchy = cv2.findContours(
            img_opening.copy(), mode=cv2.RETR_CCOMP, method=cv2.CHAIN_APPROX_SIMPLE
        )

        img_contour = img.copy()
        for i, c in enumerate(contours):
            if hierarchy[0][i][3] == -1:
                img_contour = cv2.drawContours(
                    img_contour,
                    contours=contours,
                    contourIdx=i,
                    color=(255, 100, 100),
                    thickness=3,
                )

        write_image(_get_output_fp("geometry-contour-watershed.jpg"), img_contour)

    _contour_watershed_algorithm()


def _basic_upscaling():
    def _get_sr() -> DnnSuperResImpl:
        """Get super resolution model (FSRCNN)."""
        # https://learnopencv.com/super-resolution-in-opencv/
        sr: DnnSuperResImpl = cv2.dnn_superres.DnnSuperResImpl_create()  # type: ignore
        path = Path("models") / "FSRCNN_x2.pb"
        sr.readModel(str(path))
        sr.setModel("fsrcnn", 2)
        return sr

    sr = _get_sr()
    fp = _get_input_fp("polaris.jpg")
    img = read_image(fp)
    img = sr.upsample(img)
    write_image(_get_output_fp("polaris-upscaled.jpg"), img)


def _basic_denoise():
    fp = _get_input_fp("polaris.jpg")
    img = read_image(fp)
    img = cv2.fastNlMeansDenoisingColored(
        img,
        None,  # type: ignore
        h=5,
        hColor=5,
        templateWindowSize=5,
        searchWindowSize=5,
    )
    write_image(_get_output_fp("polaris-denoised.jpg"), img)


# ---
# Run
# ---


if __name__ == "__main__":
    main()
