import os
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.figure_factory as ff
import plotly.graph_objects as go

# Docs:
# https://plotly.github.io/plotly.py-docs/generated/plotly.express.histogram.html

# Implicit dependencies
# distplot: scipy
# save image: kaleido
# ols (regression): statsmodels

# TODO:
# part-of-whole: pie, sunburst, treemap, icicle
# polar


# ---
# Constants
# ---

DATA_DIR = os.path.join('.', 'data')
INPUT_DIR = os.path.join(DATA_DIR, 'input')
OUTPUT_DIR = os.path.join(DATA_DIR, 'output')


# ---
# Main
# ---

def main():
    print_section_title('setup')
    setup()

    print_section_title('basic histogram')
    basic_histogram()

    print_section_title('basic histogram (with marginal)')
    basic_histogram_with_marginal()

    print_section_title('basic line')
    basic_line()

    print_section_title('basic bar')
    basic_bar()

    print_section_title('basic distplot')
    basic_distplot()

    print_section_title('basic hist (heatmap)')
    basic_hist_heatmap()

    print_section_title('basic hist (contour)')
    basic_hist_contour()

    print_section_title('basic box plot')
    basic_box_plot()

    print_section_title('basic violin plot')
    basic_violin_plot()

    print_section_title('basic regression plots')
    basic_regression_plots()

    print_section_title('basic scatter matrix')
    basic_scatter_matrix()

# ---
# Examples
# ---


def setup():
    for d in [DATA_DIR, INPUT_DIR, OUTPUT_DIR]:
        os.makedirs(d, exist_ok=True)

    print('...')


def basic_histogram():
    """Histogram example"""
    arr1 = np.random.randn(100)
    fig = px.histogram(arr1, nbins=10)
    fig.write_image(get_output_path('basic-histogram-1.png'))


def basic_histogram_with_marginal():
    """Histogram example (with marginal param)"""
    arr1 = np.random.randn(100)
    fig = px.histogram(arr1, nbins=10, marginal='box')  # box, violin, rug
    fig.write_image(get_output_path('basic-histogram-marginal-1.png'))


def basic_line():
    df = px.data.gapminder().query("country=='Canada'")
    fig = px.line(df, x='year', y='lifeExp', title='Life expectancy in Canada')
    fig.write_image(get_output_path('basic-line-1.png'))


def basic_bar():
    data_canada = px.data.gapminder().query("country == 'Canada'")
    fig = px.bar(data_canada, x='year', y='pop')
    fig.write_image(get_output_path('basic-bar-1.png'))


def basic_distplot():
    """distplot example"""
    arr1 = np.random.randn(100)
    arr2 = np.random.randn(100)

    fig = ff.create_distplot([arr1, arr2], ['a', 'b'],)
    fig.write_image(get_output_path('basic-distplot-1.png'))

    arr3 = np.random.normal(loc=2.5, scale=0.85, size=300)

    fig = ff.create_distplot([arr3], ['a'], bin_size=.2, show_rug=False)
    fig.write_image(get_output_path('basic-distplot-2.png'))


def basic_hist_heatmap():
    """Jointplot example"""
    df = pd.DataFrame({
        'x': np.random.normal(loc=2.5, scale=0.85, size=300),
        'y': np.random.normal(loc=2.5, scale=0.85, size=300)
    })

    fig = go.Figure()

    fig.add_trace(go.Histogram2d(
        x=df['x'], y=df['y'],
        nbinsx=20, nbinsy=20,
        colorscale='Blues'
    ))

    fig.write_image(get_output_path('basic-hist-heat-1.png'))


def basic_hist_contour():
    """Jointplot example"""
    df = pd.DataFrame({
        'x': np.random.normal(loc=2.5, scale=0.85, size=300),
        'y': np.random.normal(loc=2.5, scale=0.85, size=300)
    })

    fig = go.Figure()

    fig.add_trace(go.Histogram2dContour(
        x=df['x'], y=df['y'],
        nbinsx=20, nbinsy=20,
        colorscale='Blues'
    ))

    fig.write_image(get_output_path('basic-hist-contour-1.png'))


def basic_box_plot():
    """Boxplot example"""
    # 5 key components
    # first quartile, median, third quartile
    # min (Q1 - 1.5 * IQR, not lowest value), max (Q3 + 1.5 * IQR, not highest value)
    # IQR -- interquartile range (distance between Q1 & Q3)
    # outliers lie beyond min/max
    # ends cover min/max, box covers first-third quartile, line over median

    df = pd.DataFrame([
        {'x': x, 'y': y, 'z': z}
        for x in ['a', 'b', 'c']
        for y in np.random.randn(100)
        for z in ['yes', 'no']
    ])
    fig = px.box(df, x='x', y='y', color='z')
    fig.write_image(get_output_path('basic-box-plot-1.png'))


def basic_violin_plot():
    '''Violin plot example'''
    df = pd.DataFrame([
        {'x': x, 'y': y, 'z': z}
        for x in ['a', 'b', 'c']
        for y in np.random.randn(100)
        for z in ['yes', 'no']
    ])
    fig = px.violin(df, x='x', y='y', color='z')
    fig.write_image(get_output_path('basic-violin-plot-1.png'))


def basic_regression_plots():
    """Regression plot example"""
    tips_df = px.data.tips()
    fig = px.scatter(tips_df, x='total_bill', y='tip', opacity=0.65, trendline='ols')
    fig.write_image(get_output_path('basic-regression-plot-1.png'))


def basic_scatter_matrix():
    """Scatter matrix example"""
    df = px.data.iris()
    fig = px.scatter_matrix(
        df,
        dimensions=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
        color='species',
    )
    fig.write_image(get_output_path('basic-scatter-matrix-1.png'))

# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def get_output_path(filename: str) -> str:
    """Get path to input file"""
    return os.path.join(OUTPUT_DIR, filename)


# ---
# Run
# ---


if __name__ == '__main__':
    main()
