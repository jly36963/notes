use anyhow;
use charming::component::{Axis, Grid, Legend, Title};
use charming::datatype::{Dataset, Transform};
use charming::element::{
    AxisPointer, AxisPointerType, AxisType, Emphasis, EmphasisFocus, ItemStyle, SplitArea,
    SplitLine, Tooltip, Trigger,
};
use charming::series::{Bar, Boxplot, Pie, PieRoseType, Series};
use charming::{Chart, ImageRenderer};
use rand::distributions::Distribution;
use statrs::distribution::Normal;
use std::fs;
use std::path::Path;

// ---
// Notes
// ---

// https://github.com/yuankunzhang/charming
// https://github.com/yuankunzhang/charming/tree/main/gallery
// https://docs.rs/charming/latest/charming/index.html
// https://echarts.apache.org/en/index.html

// ---
// Main
// ---

fn main() {
    // Sync
    let examples: Vec<(&str, fn())> = vec![
        ("setup", setup),
        ("basic_pie", basic_pie),
        ("basic_bar", basic_bar),
        ("basic_bar_stacked", basic_bar_stacked),
        ("basic_boxplot", basic_boxplot),
    ];
    for (title, example_func) in examples {
        print_section_header(title.into());
        example_func();
    }
}

// ---
// Utils
// ---

/// Convert a string to uppercase and print it
fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

fn write_chart_to_file<P>(chart: &Chart, path: P, height: u32, width: u32) -> anyhow::Result<()>
where
    P: AsRef<std::path::Path>,
{
    let mut renderer = ImageRenderer::new(width, height);
    renderer.save(&chart, path)?;
    Ok(())
}

/// Get a normally distributed Vec<f64> with n elements
fn norm_vec(count: usize) -> Vec<f64> {
    let mut rng = rand::thread_rng();
    let dist = Normal::new(0.0, 1.0).unwrap();
    let mut results = Vec::with_capacity(count);
    for _ in 0..count {
        results.push(dist.sample(&mut rng));
    }
    results
}

// ---
// Examples
// ---

fn setup() {
    let data_dir = Path::new(".").join("data");
    let input_dir = data_dir.join("input");
    let output_dir = data_dir.join("output");

    for dir in vec![data_dir, input_dir, output_dir] {
        fs::create_dir_all(dir).unwrap();
    }
}

fn basic_pie() {
    let data = vec![
        (40.0, "rose 1"),
        (38.0, "rose 2"),
        (32.0, "rose 3"),
        (30.0, "rose 4"),
        (28.0, "rose 5"),
        (26.0, "rose 6"),
        (22.0, "rose 7"),
        (18.0, "rose 8"),
    ];

    let chart = Chart::new().legend(Legend::new().top("bottom")).series(
        Pie::new()
            .name("Nightingale Chart")
            .rose_type(PieRoseType::Radius)
            .radius(vec!["50", "250"])
            .center(vec!["50%", "50%"])
            .item_style(ItemStyle::new().border_radius(8))
            .data(data),
    );

    let output_fp = Path::new("./data/output/pie.svg");
    write_chart_to_file(&chart, output_fp, 800, 1000).unwrap();
}

fn basic_bar() {
    let x_data = vec!["M", "T", "W", "Th", "F", "Sa", "Su"];
    let y_data = vec![1.0, 4.0, 9.0, 16.0, 25.0, 36.0, 49.0];

    let chart = Chart::new()
        .legend(Legend::new().top("bottom"))
        .x_axis(Axis::new().type_(AxisType::Category).data(x_data))
        .y_axis(Axis::new().type_(AxisType::Value))
        .series(
            Bar::new()
                .name("Some bar chart")
                .show_background(true)
                .data(y_data),
        );

    let output_fp = Path::new("./data/output/bar.svg");
    write_chart_to_file(&chart, output_fp, 800, 1000).unwrap();
}

fn basic_bar_stacked() {
    let x_data = vec!["M", "T", "W", "Th", "F", "Sa", "Su"];
    let y1_data = vec![1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
    let y2a_data = vec![0.6, 0.4, 0.5, 0.3, 0.4, 0.2, 0.3];
    let y2b_data = vec![0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1];

    let chart = Chart::new()
        .tooltip(
            Tooltip::new()
                .trigger(Trigger::Axis)
                .axis_pointer(AxisPointer::new().type_(AxisPointerType::Shadow)),
        )
        .legend(Legend::new())
        .grid(
            Grid::new()
                .left("3%")
                .right("4%")
                .bottom("3%")
                .contain_label(true),
        )
        .x_axis(Axis::new().type_(AxisType::Category).data(x_data))
        .y_axis(Axis::new().type_(AxisType::Value))
        .series(Series::Bar(
            Bar::new()
                .name("y1")
                .emphasis(Emphasis::new().focus(EmphasisFocus::Series))
                .data(y1_data),
        ))
        .series(Series::Bar(
            Bar::new()
                .name("y2a")
                .stack("y2")
                .emphasis(Emphasis::new().focus(EmphasisFocus::Series))
                .data(y2a_data),
        ))
        .series(Series::Bar(
            Bar::new()
                .name("y2b")
                .stack("y2")
                .emphasis(Emphasis::new().focus(EmphasisFocus::Series))
                .data(y2b_data),
        ));

    let output_fp = Path::new("./data/output/bar-stacked.svg");
    write_chart_to_file(&chart, output_fp, 800, 1000).unwrap();
}

fn basic_boxplot() {
    let count = 10_000;
    let group1 = norm_vec(count);
    let group2 = norm_vec(count).into_iter().map(|n| n * 2.0).collect();
    let group3 = norm_vec(count).into_iter().map(|n| n / 2.0).collect();
    let group4 = norm_vec(count).into_iter().map(|n| n + 1.0).collect();
    let data = vec![group1, group2, group3, group4];

    let chart = Chart::new()
        .title(Title::new().text("Box plot").left("center"))
        .tooltip(
            Tooltip::new()
                .trigger(Trigger::Item)
                .axis_pointer(AxisPointer::new().type_(AxisPointerType::Shadow)),
        )
        .grid(Grid::new().left("10%").right("10%").bottom("15%"))
        .dataset(
            Dataset::new().source(data).transform(
                Transform::new()
                    .from_dataset_index(0)
                    .transform(r#"{"type": "boxplot"}"#),
            ),
        )
        .x_axis(
            Axis::new()
                .type_(AxisType::Category)
                .boundary_gap(true)
                .name_gap(30)
                .split_area(SplitArea::new().show(true))
                .split_line(SplitLine::new().show(false)),
        )
        .y_axis(
            Axis::new()
                .type_(AxisType::Value)
                .name("some metric")
                .split_area(SplitArea::new().show(false)),
        )
        .series(Boxplot::new().name("boxplot"));

    let output_fp = Path::new("./data/output/boxplot.svg");
    write_chart_to_file(&chart, output_fp, 800, 1000).unwrap();
}
