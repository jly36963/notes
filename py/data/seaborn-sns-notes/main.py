import json
import os
from sklearn.datasets import load_iris
import numpy as np
import pandas as pd
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm


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

    print_section_title('basic matplotlib histogram')
    basic_matplotlib_histogram()

    print_section_title('basic displot')
    basic_displot()

    print_section_title('basic jointplot')
    basic_jointplot()

    print_section_title('basic rugplot')
    basic_rugplot()

    print_section_title('basic kde')
    basic_kde()

    print_section_title('basic box plot')
    basic_box_plot()

    print_section_title('basic violin plot')
    basic_violin_plot()

    print_section_title('basic box/violin comparison')
    basic_box_and_violin_comparison()

    print_section_title('basic regression plot')
    basic_regression_plots()

    print_section_title('basic heatmap')
    basic_heatmap()

    print_section_title('basic cluster map')
    basic_cluster_map()

    print_section_title('basic categorical plot')
    basic_categorical_plot()

    print_section_title('basic pair plot')
    basic_pairplot()


# ---
# Examples
# ---


def setup():
    """Set defaults for seaborn"""
    sns.set(style='white', color_codes=True)

    for d in [DATA_DIR, INPUT_DIR, OUTPUT_DIR]:
        os.makedirs(d, exist_ok=True)

    print('...')


def basic_matplotlib_histogram():
    """Histogram examples (matplotlib)"""

    # Histograms 1 and 2
    bins = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    arr1 = np.random.randn(100)
    plt.hist(arr1, density=True, color='red', alpha=.5, bins=bins)
    save_output_image('basic-matplotlib-histogram-1.png')
    plt.clf()

    arr2 = np.random.randn(80)
    plt.hist(arr2, density=True, color='blue', alpha=.5, bins=bins)
    save_output_image('basic-matplotlib-histogram-2.png')
    plt.clf()

    # Histogram 3
    arr3 = np.random.randn(100)
    plt.hist(
        arr3,
        alpha=.8,  # 0-1 transparency
        bins=10,  # int -- number of equal bins (default 10), list -- edges of bins ([1,2,3,4])
        histtype='bar',  # bar (traditional), barstacked, step (generates lineplot), stepfilled
        align='mid',  # left (centered on left bin edge), mid, right
        orientation='vertical',  # vertical, horizontal
        color='#aaaaff',  # str -- color, list -- colors (1:1 color:ds ratio)
        label='label1',  # str -- label, list -- labels for multiple datasets
        density=True  # idk lol
    )
    save_output_image('basic-matplotlib-histogram-3.png')
    plt.clf()


def basic_displot():
    """Displot examples"""
    # NOTE: distplot is now DEPRECATED, use displot instead
    # sns.distplot(x=arr1, bins=25) # DEPRECATED (distplot -> displot)

    # distplot (histogram + kde)
    arr1 = np.random.randn(100)

    sns.displot(
        x=arr1,
        kde=True,
        stat='density',  # default 'count'
        bins=25,  # default 10
        kde_kws={'cut': 3},
    )
    save_output_image('basic-displot-1.png')
    plt.clf()

    # distplot (with series)
    srs1 = pd.Series(np.random.randn(100), name='ds1')
    sns.displot(x=srs1, bins=25, kde=True)
    save_output_image('basic-displot-2.png')
    plt.clf()


def basic_jointplot():
    """Jointplot examples"""
    # Kinds: scatter, reg, resid, kde (density), hex

    # Scatter (default)
    df = pd.DataFrame({
        'x': np.random.randn(250),
        'y': np.random.randn(250)
    })
    sns.jointplot(df, x='x', y='y')
    save_output_image('basic-jointplot-scatter.png')
    plt.clf()

    # Hex
    sns.jointplot(
        kind='hex',
        color='lavender',
        x=df['x'],
        y=df['y'],
    )
    save_output_image('basic-jointplot-hex.png')
    plt.clf()

    # KDE (kernel density estimation)
    sns.jointplot(
        kind='kde',  # scatter, reg, resid, kde (density), hex
        color='indigo',  # color to use (matplotlib colors)
        x=df['x'],
        y=df['y'],
    )
    save_output_image('basic-jointplot-kde.png')
    plt.clf()


def basic_rugplot():
    """Rugplot examples"""
    # rugplot (plot an array of datapoints as sticks on an axis)
    arr1 = np.random.randn(100)
    sns.rugplot(x=arr1, height=1, color='fuchsia')
    save_output_image('basic-rugplot-1.png')
    plt.clf()

    # rugplot with histogram
    arr2 = np.random.randn(100)
    plt.hist(arr2, density=True, color='lightblue', alpha=.5, bins=[-3, -2, -1, 0, 1, 2, 3])
    sns.rugplot(x=arr2, height=.05, color='black')
    save_output_image('basic-rugplot-2.png')
    plt.clf()


def basic_kde():
    """KDE examples"""

    # kde (kernal density estimation plot) (probability density function)
    # gaussian distribution plots on every data point -- sum of gaussian curves.

    # seaborn kde (various bandwidths)
    arr1 = np.random.randn(100)
    sns.kdeplot(arr1, color='black')  # default bw_method
    for bwm in np.arange(.5, 2, .25):
        sns.kdeplot(x=arr1, bw_method=bwm, lw=1.8, label=bwm)
    save_output_image('basic-kde-1.png')
    plt.clf()

    # cdf (cumulative distribution function)
    arr3 = np.random.randn(100)
    sns.kdeplot(arr3, cumulative=True)
    save_output_image('basic-kde-2.png')
    plt.clf()

    # kde (multivariate) (DEPRECATED)
    mean = [0, 0]  # mean
    cov = [[1, 0], [0, 100]]  # covariance
    ds2 = np.random.multivariate_normal(mean=mean, cov=cov, size=1000)  # multivariate normal distribution
    df1 = pd.DataFrame(ds2, columns=['X', 'Y'])  # dataset as dataframe
    sns.kdeplot(x=df1['X'], y=df1['Y'])  # kdeplot of dataframe
    save_output_image('basic-kde-3.png')
    plt.clf()

    # kde (multivariate) (multiple vectors)
    mean = [0, 0]  # mean
    cov = [[1, 0], [0, 100]]  # covariance
    ds2 = np.random.multivariate_normal(mean=mean, cov=cov, size=1000)  # multivariate normal distribution
    df1 = pd.DataFrame(ds2, columns=['X', 'Y'])  # dataset as dataframe
    sns.kdeplot(x=df1['X'], y=df1['Y'], fill=True)
    save_output_image('basic-kde-4.png')
    plt.clf()

    # kde (jointplot)
    mean = [0, 0]  # mean
    cov = [[1, 0], [0, 100]]  # covariance
    ds2 = np.random.multivariate_normal(mean=mean, cov=cov, size=1000)  # multivariate normal distribution
    df1 = pd.DataFrame(ds2, columns=['X', 'Y'])  # dataset as dataframe
    sns.jointplot(x=df1['X'], y=df1['Y'], kind='kde')
    save_output_image('basic-kde-5.png')
    plt.clf()

    # # NOTE: Using alternate kernels is now DEPRECATED
    # # Manual kde (create kernels)
    # arr1 = np.random.randn(100)  # data set
    # sns.rugplot(arr1)
    # x_min = arr1.min() - 2  # left bound
    # x_max = arr1.max() + 2  # right bound
    # x_axis = np.linspace(x_min, x_max, 100)  # 100 equally spaced points between min/max
    # bandwidth = ((4 * (arr1.std() ** 5)) / (3 * len(arr1)))**(1/5)  # bandwidth
    # kernel_list = []
    # for data_point in arr1:
    #     # create kernel for each point, append to kernel_list
    #     kernel = stats.norm(data_point, bandwidth).pdf(x_axis)
    #     kernel_list.append(kernel)
    #     # scale for plotting
    #     kernel = kernel / kernel.max()
    #     kernel = kernel * 0.4
    #     # plot
    #     plt.plot(x_axis, kernel, color='black', alpha=0.5)
    # # limit y axis
    # plt.ylim(0, 1)
    # save_output_image('basic-seaborn-kde-1.png')
    # # manual kde (sum kernels)
    # sum_of_kde = np.sum(kernel_list, axis=0)  # get sum
    # plt.plot(x_axis, sum_of_kde, color='indigo')  # plot sum
    # sns.rugplot(arr1)  # rugplot
    # plt.yticks([])  # clear ticks
    # plt.suptitle('Sum of basis functions')
    # save_output_image('basic-seaborn-kde-2.png')
    # # seaborn kde (different kernels)
    # arr2 = np.random.randn(100)
    # kernel_options = ['biw', 'cos', 'epa', 'gau', 'tri', 'triw']
    # for k in kernel_options:
    #     sns.kdeplot(arr2, kernel=k, label=k)
    # save_output_image('basic-seaborn-kde-2.png')


def basic_box_plot():
    """Boxplot examples"""
    # box plot
    # 5 key components
    # first quartile, median, third quartile
    # min (Q1 - 1.5 * IQR, not lowest value), max (Q3 + 1.5 * IQR, not highest value)
    # IQR -- interquartile range (distance between Q1 & Q3)
    # outliers lie beyond min/max
    # ends cover min/max, box covers first-third quartile, line over median

    arr1 = np.random.randn(100)
    arr2 = np.random.randn(100)
    sns.boxplot(data=[arr1, arr2])
    save_output_image('basic-seaborn-box-plot-1.png')
    plt.clf()
    sns.boxplot(data=[arr1, arr2], whis=np.inf)  # use outliers instead of min/max
    save_output_image('basic-seaborn-box-plot-2.png')
    plt.clf()


def basic_violin_plot():
    '''Violin plot examples'''
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.violinplot(x=tips['size'], y=tips['tip_pct'], inner='quartile')
    save_output_image('basic-seaborn-violin-plot-1.png')
    plt.clf()


def basic_box_and_violin_comparison():
    '''Box vs violin comparison'''
    # normal distribution, 100 points
    ds1 = stats.norm(0, 5).rvs(100)
    # gamma distribution, 50 points
    ds2 = np.concatenate([
        stats.gamma(5).rvs(50) - 1,
        stats.gamma(5).rvs(50) * (-1)
    ])

    # Comparing boxplot and violinplot`
    sns.boxplot(data=[ds1, ds2])  # boxplot (why we may need violin plot)
    save_output_image('basic-violin-vs-box-plot-1.png')
    plt.clf()
    sns.violinplot(data=[ds1, ds2], inner='quartile')  # inner -- quartile, point, stick
    save_output_image('basic-violin-vs-box-plot-2.png')
    plt.clf()


def basic_regression_plots():
    """Regression plot examples"""

    # linear regression
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips.head()  # first 5 rows
    sns.lmplot(x='total_bill', y='tip', data=tips)  # col1, col2, df
    save_output_image('basic-regression-linear.png')
    plt.clf()

    # linear regression (custom)
    tips = sns.load_dataset('tips')  # example dataset (df)
    sns.lmplot(
        x='total_bill', y='tip', data=tips,
        scatter_kws={'marker': 'o', 'color': 'indianred'},
        line_kws={'linewidth': 1, 'color': 'blue'}
    )
    save_output_image('basic-regression-linear-2.png')
    plt.clf()

    # polynomial regression (higher order polynomials)
    tips = sns.load_dataset('tips')  # example dataset (df)
    sns.lmplot(x='total_bill', y='tip', data=tips, order=3)  # third order polynomial
    save_output_image('basic-regression-polynomial.png')
    plt.clf()

    # linear regression (no fit)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.lmplot(x='total_bill', y='tip_pct', data=tips, fit_reg=False)
    save_output_image('basic-regression-linear-nofit.png')
    plt.clf()

    # linear regression (discrete)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.lmplot(x='size', y='tip_pct', data=tips)  # size of party, tip percent
    save_output_image('basic-regression-linear-discrete.png')
    plt.clf()

    # linear regression (jitter) (spreads discrete values)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.lmplot(x='size', y='tip_pct', data=tips, x_jitter=.1)
    save_output_image('basic-regression-linear-jitter.png')
    plt.clf()

    # linear regression (estimator)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.lmplot(x='size', y='tip_pct', data=tips, x_estimator=np.mean)
    save_output_image('basic-regression-linear-estimator.png')
    plt.clf()

    # linear regression (estimator) (order)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.lmplot(x='size', y='tip_pct', data=tips, x_estimator=np.mean, order=2)
    save_output_image('basic-regression-linear-estimator-order.png')
    plt.clf()

    # linear regression (hue) (categorize)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.lmplot(x='total_bill', y='tip_pct', data=tips, hue='day')  # categorize by day
    save_output_image('basic-regression-linear-hue-categorize.png')
    plt.clf()

    # local regression (LOESS)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.lmplot(x='total_bill', y='tip_pct', data=tips, lowess=True)
    save_output_image('basic-regression-local-loess.png')
    plt.clf()

    # regplot
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    sns.regplot(x='total_bill', y='tip_pct', data=tips)
    save_output_image('basic-regplot.png')
    plt.clf()

    # regplot + violinplot (subplots)
    tips = sns.load_dataset('tips')  # example dataset (df)
    tips['tip_pct'] = 100*(tips['tip']/tips['total_bill'])
    fig, (axis1, axis2) = plt.subplots(nrows=1, ncols=2, sharey=True)
    sns.regplot(x='total_bill', y='tip_pct', data=tips, ax=axis1)
    sns.violinplot(x='size', y='tip_pct', data=tips, ax=axis2, inner='quartile')
    save_output_image('basic-reg-and-violin-plot.png')
    plt.clf()


def basic_heatmap():
    # heatmap
    df_flight = sns.load_dataset('flights')  # sample dataset (df)
    df_flight = df_flight.pivot(index='month', columns='year', values='passengers')  # pivot table
    sns.heatmap(df_flight)
    save_output_image('basic-heatmap.png')
    plt.clf()

    # heatmap (center) (value at center is neutral, values diverge from there)
    df_flight = sns.load_dataset('flights')  # sample dataset (df)
    df_flight = df_flight.pivot(index='month', columns='year', values='passengers')  # pivot table
    sns.heatmap(df_flight, center=df_flight.loc['Jan', 1955])
    save_output_image('basic-heatmap-centered.png')
    plt.clf()

    # heatmap + barplot (subplots)
    df_flight = sns.load_dataset('flights')  # sample dataset (df)
    df_flight = df_flight.pivot(index='month', columns='year', values='passengers')  # pivot table
    fig, (axis1, axis2, axis3) = plt.subplots(nrows=3, ncols=1)
    srs_fpy = df_flight.sum()  # sum of flights per year
    srs_years = pd.Series(srs_fpy.index.values)
    df_years = pd.DataFrame(srs_years)
    srs_flights = pd.Series(srs_fpy.values)
    df_flights = pd.DataFrame(srs_flights)
    df1 = pd.concat((df_years, df_flights), axis=1)
    df1.columns = ['YEAR', 'FLIGHTS']
    sns.barplot(x='YEAR', y='FLIGHTS', data=df1, ax=axis1)
    sns.heatmap(df_flight, cmap='Blues', ax=axis2, cbar_ax=axis3, cbar_kws={'orientation': 'horizontal'})
    save_output_image('basic-heatmap-and-barplot.png')
    plt.clf()


def basic_cluster_map():
    # Cluster map (matrix cluster grid) (group like cols/rows together)
    df_flight = sns.load_dataset('flights')  # sample dataset (df)
    df_flight = df_flight.pivot(index='month', columns='year', values='passengers')  # pivot table

    sns.clustermap(df_flight)  # args: col_cluster, row_cluster, standard_scale, z_score
    save_output_image('basic-cluster-map.png')
    plt.clf()

    sns.clustermap(df_flight, col_cluster=False)  # only cluster rows
    save_output_image('basic-cluster-map-only-rows.png')
    plt.clf()

    sns.clustermap(df_flight, row_cluster=False)  # only cluster cols
    save_output_image('basic-cluster-map-only-cols.png')
    plt.clf()


def basic_categorical_plot():
    # Dataset as df
    df1: pd.DataFrame = sm.datasets.fair.load_pandas().data  # type: ignore
    print(df1.columns)
    # Create 'Had_Affair' col
    df1['Had_Affair'] = df1['affairs'].apply(lambda x: 0 if x == 0 else 1)
    # Compare
    df2 = df1.groupby('Had_Affair').mean().applymap(lambda x: round(x, 1))

    # Plot (categorical plot)
    sns.catplot(x='age', data=df1, kind='count', palette='coolwarm')
    save_output_image('basic-cat-plot-1.png')
    plt.clf()
    sns.catplot(x='age', data=df2, kind='count', palette='coolwarm')
    save_output_image('basic-cat-plot-2.png')
    plt.clf()


def basic_pairplot():
    # Import dataset
    iris = load_iris()
    # extract dataset
    x: pd.DataFrame = iris.data  # type: ignore
    y: pd.DataFrame = iris.target  # type: ignore
    # get df from dataset
    df_x = pd.DataFrame(x, columns=['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
    df_y = pd.DataFrame(y, columns=['Species'])
    # replace
    df_y = df_y.replace({0: 'Setosa', 1: 'Versicolour', 2: 'Virginica'})
    # combine
    df1 = pd.concat([df_x, df_y], axis=1)
    # visualize
    sns.pairplot(df1, hue='Species')
    save_output_image('basic-pair-plot.png')
    plt.clf()


# ---
# Utils
# ---

def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def map_res(val):
    """Map type to more print-friendly type"""
    if isinstance(val, pd.DataFrame):
        return val.to_dict(orient='records')
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then print"""
    mapped = {k: map_res(v) for k, v in results.items()}
    print(json.dumps(mapped, indent=2, ensure_ascii=False))


def get_output_path(filename: str) -> str:
    """Get path to input file"""
    return os.path.join(OUTPUT_DIR, filename)


def save_output_image(filename: str) -> None:
    """Save current plot to file"""
    print(f'Saving image: {filename}')
    plt.savefig(get_output_path(filename))

# ---
# Run
# ---


if __name__ == '__main__':
    main()
