"""Scipy notes."""

import os
import json
from typing import Any, Dict, Optional, cast
from sklearn.utils import resample
from sklearn.neighbors import LocalOutlierFactor
from statsmodels.stats.weightstats import ztest
import scipy.stats as st
from scipy.stats._stats_py import (
    ModeResult,
    PearsonRResult,
    TtestResult,
    NormaltestResult,
    SkewtestResult,
    KurtosistestResult,
)
from scipy.stats._fit import GoodnessOfFitResult
from scipy.stats._binomtest import BinomTestResult
from scipy.stats._morestats import AndersonResult
import seaborn as sns
from seaborn._core.typing import DataSource
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.axes import Axes
from numpy.typing import ArrayLike
# import statsmodels.formula.api as smf

# ---
# Constants
# ---

DATA_DIR = os.path.join(".", "data")
INPUT_DATA_DIR = os.path.join(DATA_DIR, "input")
OUTPUT_DATA_DIR = os.path.join(DATA_DIR, "output")


# ---
# Main
# ---


def main():
    """Run a bunch of example code snippets."""
    setup()

    # Pandas
    print_section_title("basic pandas info")
    basic_pandas_info()
    print_section_title("basic pandas groupby")
    basic_pandas_groupby()

    # Continuous
    print_section_title("continuous uniform distribution")
    basic_continuous_uniform_distribution()
    print_section_title("continuous normal distribution")
    basic_continuous_normal_distribution()
    print_section_title("continuous exponential distribution")
    basic_continuous_exponential_distribution()
    print_section_title("continuous t distribution")
    basic_continous_t_distribution()
    print_section_title("continuous f distribution")
    basic_continous_f_distribution()

    # Discrete
    print_section_title("basic discrete binomial distribution")
    basic_discrete_binomial_distribution()
    print_section_title("basic discrete negative binomial distribution")
    basic_discrete_negative_binomial_distribution()
    print_section_title("basic discrete geometric distribution")
    basic_discrete_geometric_distribution()
    print_section_title("basic discrete poisson distribution")
    basic_discrete_poisson_distribution()

    # Discrete frequency metrics
    print_section_title("basic binomial distribution metrics")
    basic_binomial_distribution_metrics()
    print_section_title("basic bernoulli distribution metrics")
    basic_bernoulli_distribution_metrics()

    # Multivariate metrics
    print_section_title("basic multivariate metrics")
    basic_multivariate_metrics()

    # Hypothesis testing
    print_section_title("basic shapiro-wilk test")
    basic_shapiro_wilk_test()
    print_section_title("basic anderson-darling test")
    basic_anderson_darling_test()
    print_section_title("basic normal test")
    basic_normal_test()
    print_section_title("basic skew test")
    basic_skew_test()
    print_section_title("basic kurtosis test")
    basic_kurtosis_test()
    print_section_title("basic chi-square test")
    basic_chi_square_test()
    print_section_title("basic goodness-of-fit test")
    basic_goodness_of_fit_test()
    print_section_title("basic t test")
    basic_t_test()
    print_section_title("basic z test")
    basic_z_test()
    print_section_title("basic f test")
    basic_f_test()
    print_section_title("basic wilcoxon ranksum test")
    basic_wilcoxon_ranksum_test()
    print_section_title("basic mann whitney u test")
    basic_mann_whitney_u_test()
    print_section_title("basic anova test")
    basic_anova_test()
    print_section_title("basic binomial test")
    basic_binomial_test()

    # Misc
    print_section_title("basic resampling")
    basic_resampling()

    # Outliers
    print_section_title("basic outliers iqr")
    basic_outliers_iqr()
    print_section_title("basic outliers zscore")
    basic_outliers_zscore()
    print_section_title("basic outliers sklearn")
    basic_outliers_sklearn()


# ---
# Setup
# ---


def setup():
    """Set defaults for seaborn"""
    sns.set_theme(style="white", color_codes=True)

    for d in [DATA_DIR, INPUT_DATA_DIR, OUTPUT_DATA_DIR]:
        os.makedirs(d, exist_ok=True)

    print("Setup complete")


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Uppercase and newline wrap a string, then print it."""
    print(f"\n{string.upper()}\n")


def pretty_print(value: Any) -> None:
    """Pretty print any value in json format."""
    print(json.dumps(value, indent=2, default=str))


def pretty_print_results(results: Dict[str, Any]) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        print(k)
        if isinstance(v, pd.DataFrame):
            print(v)
        else:
            pretty_print(v)


def get_input_path(filename: str) -> str:
    """Get path to input file."""
    return os.path.join(INPUT_DATA_DIR, filename)


def get_output_path(filename: str) -> str:
    """Get path to output file."""
    return os.path.join(OUTPUT_DATA_DIR, filename)


def save_output_image(filename: str) -> None:
    """Save current plot to file."""
    print(f"Saving image: {filename}")
    plt.savefig(get_output_path(filename))


def flatten_multiple_index(df: pd.DataFrame, sep="_") -> pd.DataFrame:
    """Flatten columns multi-index dataframe."""
    df.columns = [sep.join(col).strip() for col in df.columns.values]
    return df


def distplot(
    data: ArrayLike,
    bins: Optional[ArrayLike] = None,
    **kwargs,
) -> Axes:
    """A histplot-based replacement for deprecated distplot."""
    # Merge defaults with provided
    kwargs = {
        **kwargs,
        "kde": True,
        "stat": "density",
        "kde_kws": {
            **{"cut": 3},
            **kwargs.get("kde_kws", {}),
        },
        "alpha": 0.4,
        "edgecolor": (1, 1, 1, 0.4),
    }
    if bins is not None:
        kwargs["bins"] = bins

    return sns.histplot(cast(DataSource, data), **kwargs)


# ---
# Examples
# ---


def basic_pandas_info():
    """Read a CSV into a dataframe and get info about the data."""
    fp = get_input_path("iris.csv")
    df = pd.read_csv(fp)

    results = {
        "df.info()": df.info(),
        "df.describe()": df.describe(),
        "len(df)": len(df),
        "df.head()": df.head(),
        "df.shape": df.shape,
    }
    pretty_print_results(results)


def basic_pandas_groupby():
    """Do basic groupby/agg operations on a dataframe."""
    fp = get_input_path("iris.csv")
    df = pd.read_csv(fp)

    results = {
        "species mean": df.groupby("species").mean(),
        "sepal length mean": df.groupby("species").agg({"sepal_length": "mean"}),
        "species min/max/median/mean": flatten_multiple_index(
            df.groupby("species").agg(["min", "max", "median", "mean"])
        ),
    }
    pretty_print_results(results)


def basic_continuous_uniform_distribution():
    """Uniform distribution example."""
    samples: np.ndarray = st.uniform.rvs(
        size=1000,  # generate 1000 numbers
        loc=0,  # distribution start
        scale=1,  # distribution end
    )  # type: ignore
    cdf: np.float64 = st.uniform.cdf(
        x=0.95,  # value (cdf returns probability that an observation falls below THIS value)
        loc=0,  # start
        scale=1,  # end
    )  # type: ignore
    ppf: np.float64 = st.uniform.ppf(
        q=0.95,  # value (ppf the point which a certain probability is lte)
        loc=0,  # start
        scale=1,  # end
    )  # type: ignore

    print(
        f"uniform mean: {np.round(samples.mean(), 3)}",
        f"uniform std: {np.round(samples.std(), 3)}",
        f"uniform cdf (value={0.95}) : {np.round(cdf, 3)}",
        f"uniform ppf (percentile={0.95}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(samples, bins=np.arange(-2, 13))
    save_output_image("continuous-uniform-plot.jpg")
    plt.clf()


def basic_continuous_normal_distribution():
    """TODO."""
    samples: np.ndarray = st.norm.rvs(size=1000, loc=0, scale=1)  # type: ignore
    cdf: np.float64 = st.norm.cdf(x=0.95, loc=0, scale=1)  # type: ignore
    ppf: np.float64 = st.norm.ppf(q=0.95, loc=0, scale=1)  # type: ignore

    print(
        f"norm mean: {np.round(samples.mean(), 3)}",
        f"norm std: {np.round(samples.std(), 3)}",
        f"norm cdf (value={0.95}) : {np.round(cdf, 3)}",
        f"norm ppf (percentile={0.95}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(samples, bins=np.arange(-40, 41, 5))
    save_output_image("continuous-normal-plot.jpg")
    plt.clf()


def basic_continuous_exponential_distribution():
    """TODO."""
    samples: np.ndarray = st.expon.rvs(loc=0, scale=1, size=1000)  # type: ignore
    cdf: np.float64 = st.expon.cdf(x=0.95, loc=0, scale=1)  # type: ignore
    ppf: np.float64 = st.expon.ppf(q=0.95, loc=0, scale=1)  # type: ignore

    print(
        f"expon mean: {np.round(samples.mean(), 3)}",
        f"expon std: {np.round(samples.std(), 3)}",
        f"expon cdf (value={0.95}) : {np.round(cdf, 3)}",
        f"expon ppf (percentile={0.95}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(samples, bins=np.arange(-2, 41, 5))
    save_output_image("continuous-exponential-plot.jpg")
    plt.clf()


def basic_continous_t_distribution():
    """TODO."""
    df = 2.74
    samples: np.ndarray = st.t.rvs(df, size=100)  # type: ignore
    cdf: np.float64 = st.t.cdf(x=0.95, df=df, loc=0, scale=1)  # type: ignore
    ppf: np.float64 = st.t.ppf(q=0.95, df=df, loc=0, scale=1)  # type: ignore
    print(
        f"expon mean: {np.round(samples.mean(), 3)}",
        f"expon std: {np.round(samples.std(), 3)}",
        f"expon cdf (value={.95}) : {np.round(cdf, 3)}",
        f"expon ppf (percentile={0.95}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(samples, bins=np.arange(-5, 5, 0.5))
    save_output_image("continuous-t-plot.jpg")
    plt.clf()


def basic_continous_f_distribution():
    """TODO."""
    dfn, dfd = 29, 18
    samples: np.ndarray = st.f.rvs(dfn, dfd, size=100)  # type: ignore

    distplot(samples, bins=np.arange(-2, 5, 0.25))
    save_output_image("continuous-f-plot.jpg")
    plt.clf()


def basic_discrete_binomial_distribution():
    """TODO."""
    n = 10
    p = 0.5
    size = 1000
    k_cdf = 9.5
    k_pmf = 2
    q = 0.95

    arr: np.ndarray = st.binom.rvs(
        n=n,  # runthroughs per trial
        p=p,  # success probability
        size=size,  # number of trials
    )  # type: ignore
    cdf = st.binom.cdf(
        k=k_cdf,
        n=n,  # number of trials
        p=p,  # probability of success
    )
    pmf = st.binom.pmf(
        k=k_pmf,
        n=n,  # number of trials
        p=p,  # probability of success
    )
    ppf = st.binom.ppf(
        q=q,  # specified value (cdf returns probability that an observation falls below THIS value)
        n=n,  # number of trials
        p=p,  # probability of success
    )

    print(
        f"binom mean: {np.round(arr.mean(), 3)}",
        f"binom std: {np.round(arr.std(), 3)}",
        f"binom cdf (value={k_cdf}) : {np.round(cdf, 3)}",
        f"binom pmf (value={k_pmf}) : {np.round(pmf, 3)}",
        f"binom ppf (percentile={q}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(arr, bins=np.arange(-2.5, 13.5, 1), kde_kws={"bw_adjust": 2})
    save_output_image("discrete-binomial-plot.jpg")
    plt.clf()


def basic_discrete_negative_binomial_distribution():
    """TODO."""
    n = 10
    p = 0.5
    size = 1000
    k_cdf = 9.5
    k_pmf = 2
    q = 0.95

    arr: np.ndarray = st.nbinom.rvs(
        n=n,  # number of successes (end condition)
        p=p,  # success probability
        size=size,  # number of trials
    )  # type: ignore
    # arr_count = pd.Series(arr).value_counts()
    cdf = st.nbinom.cdf(
        k=k_cdf,
        n=n,  # number of successes (end condition)
        p=p,  # probability of success
    )
    pmf = st.nbinom.pmf(
        k=k_pmf,
        n=n,  # number of successes (end condition)
        p=p,  # probability of success
    )
    ppf = st.nbinom.ppf(
        q=q,  # specified value (cdf returns probability that an observation falls below THIS value)
        n=n,  # number of successes (end condition)
        p=p,  # probability of success
    )

    print(
        f"binom mean: {np.round(arr.mean(), 3)}",
        f"binom std: {np.round(arr.std(), 3)}",
        f"binom cdf (value={k_cdf}) : {np.round(cdf, 3)}",
        f"binom pmf (value={k_pmf}) : {np.round(pmf, 3)}",
        f"binom ppf (percentile={q}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(arr, bins=np.arange(-2.5, 13.5, 1), kde_kws={"bw_adjust": 2})
    save_output_image("discrete-negative-binomial-plot.jpg")
    plt.clf()


def basic_discrete_geometric_distribution():
    """TODO."""
    size = 1000
    p = 0.5
    k_cdf = 9
    k_pmf = 2
    q = 0.9

    arr: np.ndarray = st.geom.rvs(
        size=size,  # generate values
        p=p,  # probability
    )  # type: ignore
    # arr_count = pd.Series(arr).value_counts()  # counts for each unique value
    cdf = st.geom.cdf(
        k=k_cdf,
        p=p,
    )
    pmf = st.geom.pmf(k=k_pmf, p=p)
    ppf = st.geom.ppf(q=q, p=p)

    print(
        f"geometric mean: {np.round(arr.mean(), 3)}",
        f"geometric std: {np.round(arr.std(), 3)}",
        f"geometric cdf (value={k_cdf}) : {np.round(cdf, 3)}",
        f"geometric pmf (value={k_pmf}) : {np.round(pmf, 3)}",
        f"geometric ppf (percentile={q}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(arr, bins=np.arange(-2.5, 13.5, 1), kde_kws={"bw_adjust": 2})
    save_output_image("discrete-geometric-plot.jpg")
    plt.clf()


def basic_discrete_poisson_distribution():
    """TODO."""
    mu = 1  # average time
    loc = 0
    size = 1000  # generate data
    k_cdf = 9
    k_pmf = 2
    q = 0.9

    arr: np.ndarray = st.poisson.rvs(mu=mu, loc=loc, size=size)  # type: ignore
    cdf = st.poisson.cdf(k=k_cdf, mu=mu)
    pmf = st.poisson.pmf(k=k_pmf, mu=mu)
    ppf = st.poisson.ppf(q=q, mu=mu, loc=loc)

    print(
        f"poisson mean: {np.round(arr.mean(), 3)}",
        f"poisson std: {np.round(arr.std(), 3)}",
        f"poisson cdf (value={k_cdf}) : {np.round(cdf, 3)}",
        f"poisson pmf (value={k_pmf}) : {np.round(pmf, 3)}",
        f"poisson ppf (percentile={q}): {np.round(ppf, 3)}",
        sep="\n",
    )

    distplot(arr, bins=np.arange(-2.5, 9.5, 1), kde_kws={"bw_adjust": 2})
    save_output_image("discrete-poisson-plot.jpg")
    plt.clf()


def coin_toss_experiment(simulations: int, tosses: int) -> pd.Series:
    """
    Do a bunch of coin toss simulations.
    With scipy, just use `st.binom.rvs`.
    Eg: `arr_coin = coin_toss_experiment(simulations=100, tosses=20)`
    """
    arr_coin = []
    for _ in np.arange(simulations):
        result = np.random.randint(0, 2, tosses).sum()
        arr_coin.append(result)
    return pd.Series(arr_coin)


def basic_binomial_distribution_metrics():
    """Basic frequency distribution metrics (on a binomial distribution)."""
    arr: np.ndarray = st.binom.rvs(
        n=20,  # trials
        size=100,  # simulations
        p=0.5,  # probability of success (heads)
    )  # type: ignore
    srs = pd.Series(arr)

    print(
        f"srs.tolist():, {srs.tolist()}",
        f"srs.mean(): {srs.mean()}",  # average value
        f"np.median(srs): {np.median(srs)}",  # middle value
        f"st.mode(srs).mode: {cast(ModeResult, st.mode(srs)).mode}"
        f"srs.var(): {np.round(cast(np.float64, srs.var()), 3)}",
        f"srs.std(): {np.round(srs.std(), 3)}",
        f"srs.skew(): {np.round(cast(np.float64, srs.skew()), 3)}",
        f"srs.kurt(): {np.round(cast(np.float64, srs.kurt()), 3)}",  # kurtosis
        f"st.sem(srs): {np.round(st.sem(srs), 3)}",  # SEM
        sep="\n",
    )

    distplot(arr, bins=np.arange(0, 20, 1))
    save_output_image("discrete-binomial-simulations-plot.jpg")
    plt.clf()


def basic_bernoulli_distribution_metrics():
    """TODO."""
    p = 0.5  # skewed coin
    mean, var, skew, kurt = st.bernoulli.stats(p, moments="mvsk")  # type: ignore
    print(
        f"mean: {mean}",
        f"var: {var}",
        f"skew: {np.round(skew, 3)}",
        f"kurt: {np.round(kurt, 3)}",
        sep="\n",
    )


def basic_multivariate_metrics():
    """Covariance and correlation."""
    fp = get_input_path("iris.csv")
    df = pd.read_csv(fp)
    df = df[["sepal_length", "sepal_width", "petal_length", "petal_width"]]
    srs_sl = df["sepal_length"]
    srs_sw = df["sepal_width"]
    srs_pl = df["petal_length"]
    srs_pw = df["petal_width"]

    print(
        "Sepal length metrics",
        f"srs_sl.mean(): {srs_sl.mean()}",
        f"np.median(srs_sl: {np.median(srs_sl)}",
        f"st.mode(srs_sl).mode: {cast(ModeResult, st.mode(srs_sl)).mode}",
        f"srs_sl.std(): {srs_sl.std()}",
        f"srs_sl.var(): {srs_sl.var()}",
        sep="\n",
    )

    # Example
    _: PearsonRResult = st.pearsonr(srs_sl, srs_sw)

    print(
        "Multivariate metrics",
        f"df.columns: {df.columns}",
        # Covariance
        f"np.cov(df.T): \n{np.cov(df.T)}",
        f"df.cov(): \n{df.cov()}",
        # Correlation
        f"np.corrcoef(df.T): \n{np.corrcoef(df.T)}",
        f"df.corr(): \n{df.corr()}",
        # Pearson correlation coefficients
        "st.pearsonr -> PearsonRResult -> (statistic, pvalue)",
        f"st.pearsonr(srs_sl, srs_sw): {tuple(st.pearsonr(srs_sl, srs_sw))}",
        f"st.pearsonr(srs_sl, srs_pl): {tuple(st.pearsonr(srs_sl, srs_pl))}",
        f"st.pearsonr(srs_sl, srs_pw): {tuple(st.pearsonr(srs_sl, srs_pw))}",
        f"st.pearsonr(srs_sw, srs_pl): {tuple(st.pearsonr(srs_sw, srs_pl))}",
        f"st.pearsonr(srs_sw, srs_pw): {tuple(st.pearsonr(srs_sw, srs_pw))}",
        f"st.pearsonr(srs_pl, srs_pw): {tuple(st.pearsonr(srs_pl, srs_pw))}",
        sep="\n",
    )


def basic_shapiro_wilk_test() -> None:
    """Use shapiro-wilk test to test normality."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    statistic, pvalue = st.shapiro(samples)
    print(
        f"samples.mean(): {np.round(samples.mean(), 3)}",
        f"samples.std(): {np.round(samples.std(), 3)}",
        "st.shapiro(samples)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_anderson_darling_test() -> None:
    """Use anderson-darling test to test normality."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    res: AndersonResult = st.anderson(samples, dist="norm")  # type: ignore
    print(
        f"samples.mean(): {np.round(samples.mean(), 3)}",
        f"samples.std(): {np.round(samples.std(), 3)}",
        'st.anderson(samples, dist="norm")',
        f"statistic: {res.statistic}",
        f"critical_values: {res.critical_values}",
        f"significance_level: {res.significance_level}",
        f"fit_result: {res.fit_result}",
        sep="\n",
    )


def basic_normal_test() -> None:
    """Use d'agostino/pearson tests to test normality."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    res: NormaltestResult = st.normaltest(samples)
    statistic, pvalue = res
    print(
        f"samples.mean(): {np.round(samples.mean(), 3)}",
        f"samples.std(): {np.round(samples.std(), 3)}",
        "st.normaltest(samples)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_skew_test() -> None:
    """TODO."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    res: SkewtestResult = st.skewtest(samples)
    statistic, pvalue = res
    print(
        f"samples.mean(): {np.round(samples.mean(), 3)}",
        f"samples.std(): {np.round(samples.std(), 3)}",
        "st.skewtest(samples)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_kurtosis_test() -> None:
    """TODO."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    res: KurtosistestResult = st.kurtosistest(samples)
    statistic, pvalue = res
    print(
        f"samples.mean(): {np.round(samples.mean(), 3)}",
        f"samples.std(): {np.round(samples.std(), 3)}",
        "st.kurtosistest(samples)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_chi_square_test() -> None:
    """Use one-way chi-square test compare obs/exp."""
    # Pretend:  6-side die, 60 rolls, frequencies of each side
    observed = [8, 11, 10, 12, 9, 10]
    expected = [10, 10, 10, 10, 10, 10]
    statistic, pvalue = st.chisquare(observed, expected)
    print(
        f"observed: {observed}",
        f"expected: {expected}",
        "st.chisquare(observed, expected)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_goodness_of_fit_test():
    """TODO."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    res: GoodnessOfFitResult = st.goodness_of_fit(
        dist=st.norm,
        data=samples,
        # known_params={"loc": 0, "scale": 1},
        statistic="ks",  # 'ad',
    )
    print(
        f"samples.mean(): {np.round(samples.mean(), 3)}",
        f"samples.std(): {np.round(samples.std(), 3)}",
        "st.goodness_of_fit(...)",
        f"statistic: {res.statistic}",
        f"pvalue: {res.pvalue}",
        f"null_distribution: {res.null_distribution}",
        f"fit_result: {res.fit_result}",
        sep="\n",
    )


def basic_t_test():
    """TODO."""
    samples1: np.ndarray = st.norm.rvs(size=25, loc=0, scale=1)  # type: ignore
    samples2: np.ndarray = st.norm.rvs(size=25, loc=0, scale=1)  # type: ignore
    # for one-sample, use 'st.ttest_1samp'
    # for related sample sets, use 'st.ttest_rel'
    # for independent sample sets, use 'st.ttest_ind'
    ttest_result: TtestResult = st.ttest_ind(
        samples1,
        samples2,
        equal_var=True,
    )
    print(
        f"samples1.mean(): {np.round(samples1.mean(), 3)}",
        f"samples1.std(): {np.round(samples1.std(), 3)}",
        f"samples2.mean(): {np.round(samples2.mean(), 3)}",
        f"samples2.std(): {np.round(samples2.std(), 3)}",
        "st.ttest_ind(samples1, samples2, equal_var=True)",
        f"statistic: {np.round(ttest_result.statistic, 3)}",  # type: ignore
        f"pvalue: {np.round(ttest_result.pvalue, 3)}",  # type: ignore
        sep="\n",
    )


def basic_z_test():
    """TODO."""
    samples1: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    samples2: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    tstat, pvalue = ztest(samples1, samples2)
    print(
        f"samples1.mean(): {np.round(samples1.mean(), 3)}",
        f"samples1.std(): {np.round(samples1.std(), 3)}",
        f"samples2.mean(): {np.round(samples2.mean(), 3)}",
        f"samples2.std(): {np.round(samples2.std(), 3)}",
        "ztest(samples1, samples2)",
        f"statistic: {np.round(tstat, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_f_test():
    """TODO."""
    dfn, dfd = 29, 18
    samples1: np.ndarray = st.f.rvs(dfn, dfd, size=100)  # type: ignore
    samples2: np.ndarray = st.f.rvs(dfn, dfd, size=100)  # type: ignore
    statistic, pvalue = st.f_oneway(samples1, samples2)
    print(
        "st.f_oneway(samples1, samples2)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_wilcoxon_ranksum_test():
    """TODO."""
    samples1: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    samples2: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    statistic, pvalue = st.ranksums(samples1, samples2)
    print(
        "st.ranksums(samples1, samples2)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_mann_whitney_u_test():
    """TODO."""
    samples1: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    samples2: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    statistic, pvalue = st.mannwhitneyu(samples1, samples2, method="exact")
    print(
        'st.mannwhitneyu(samples1, samples2, method="exact")',
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_anova_test():
    """TODO."""
    samples1: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    samples2: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    samples3: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore

    statistic, pvalue = st.f_oneway(samples1, samples2, samples3)
    print(
        "st.f_oneway(samples1, samples2, samples3)",
        f"statistic: {np.round(statistic, 3)}",
        f"pvalue: {np.round(pvalue, 3)}",
        sep="\n",
    )


def basic_binomial_test():
    """TODO."""
    scenarios = [("skewed", 0.4), ("fair", 0.5)]
    for label, p in scenarios:
        size = 1000
        samples: np.ndarray = st.bernoulli.rvs(size=size, p=p)  # type: ignore

        heads = sum(samples)
        tails = size - heads
        print(
            f"{label.upper()} COIN RESULTS",
            f"p: {p}",
            f"heads: {heads}",
            f"tails: {tails}",
            f"{label.upper()} COIN STATS",
            f"samples.mean(): {samples.mean()}",
            f"samples.std(): {np.round(samples.std(), 3)}",
            f"samples.var(): {np.round(samples.var(), 3)}",
            sep="\n",
        )

    # args:  outcome, total trials, predicted p-value
    # test null hypothesis -- probablity of success in bernoulli experiment is 'p'
    res: BinomTestResult = st.binomtest(k=50, n=100, p=0.5)
    print(
        "st.binomtest(k=50, n=100, p=0.5)",
        res,
        sep="\n",
    )


def basic_resampling():
    """TODO."""
    samples: np.ndarray = st.norm.rvs(size=10, loc=0, scale=1)  # type: ignore
    resampled: np.ndarray = resample(samples, n_samples=100)  # type: ignore

    print(
        f"len (original): {len(samples)}",
        f"len (resampled): {len(resampled)}",
        f"mean (original): {np.round(samples.mean(), 3)}",
        f"mean (resampled): {np.round(resampled.mean(), 3)}",
        f"std (original): {np.round(samples.std(), 3)}",
        f"std (resampled): {np.round(resampled.std(), 3)}",
        f"var (original): {np.round(samples.var(), 3)}",
        f"var (resampled): {np.round(resampled.var(), 3)}",
        sep="\n",
    )


def basic_outliers_iqr():
    """TODO."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore
    samples = np.append(samples, [-3, 3])  # add outliers

    mean = np.mean(samples)
    std = np.std(samples)
    median = np.median(samples)
    q1 = st.scoreatpercentile(samples, 25)
    q3 = st.scoreatpercentile(samples, 75)
    iqr = st.iqr(samples)

    # Outlier is 1.5 IQR beyond q1 or q3
    left_outlier = samples < q1 - 1.5 * iqr
    right_outlier = samples > q3 + 1.5 * iqr
    outlier_mask = left_outlier | right_outlier
    outliers = samples[outlier_mask]
    not_outliers = samples[~outlier_mask]

    print(
        f"mean: {round(mean, 2)}",
        f"std: {round(std, 2)}",
        f"median: {round(median, 2)}",
        f"iqr: {iqr}",
        f"q1: {q1}",
        f"q3: {q3}",
        f"outliers: {len(outliers)}",
        f"not_outliers: {len(not_outliers)}",
        sep="\n",
    )

    sns.boxplot(samples)
    save_output_image("box-plot.jpg")
    plt.clf()

    sns.violinplot(samples)
    save_output_image("violin-plot.jpg")
    plt.clf()


def basic_outliers_zscore():
    """TODO."""
    samples: np.ndarray = st.norm.rvs(size=100, loc=0, scale=1)  # type: ignore

    mean = np.mean(samples)
    std = np.std(samples)
    z_scores = st.zscore(samples)
    # z_scores = np.abs((samples - mean) / std)

    # High z-score is outlier
    threshold = 2
    outlier_mask = z_scores > threshold
    outliers = samples[outlier_mask]
    not_outliers = samples[~outlier_mask]
    print(
        f"mean: {round(mean, 2)}",
        f"std: {round(std, 2)}",
        f"threshold: {threshold}",
        f"outliers: {len(outliers)}",
        f"not_outliers: {len(not_outliers)}",
        sep="\n",
    )


def basic_outliers_sklearn():
    """TODO."""
    fp = get_input_path("iris.csv")
    df = pd.read_csv(fp)
    df = df[["sepal_length", "sepal_width", "petal_length", "petal_width"]]

    lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
    inlier_mask = lof.fit_predict(df) == 1  # 1 or -1
    inlier = df[inlier_mask]
    outlier = df[~inlier_mask]

    print(
        f"inlier: {len(inlier)}",
        f"outlier: {len(outlier)}",
        sep="\n",
    )


# ---
# Run
# ---


if __name__ == "__main__":
    main()
