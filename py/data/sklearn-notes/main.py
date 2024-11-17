"""Scikit-learn (sklearn) examples."""

import math
from typing import Any, cast

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import statsmodels.api as sm
from sklearn.datasets import fetch_california_housing, load_iris, make_blobs
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

# ---
# Main
# ---


def main():
    """Scikit-learn examples."""
    print_section_title("basic_multivariate_linear_regression")
    _basic_multivariate_linear_regression()

    print_section_title("basic_linear_regression train test split")
    _basic_linear_regression_train_test_split()

    print_section_title("basic_logistic_function")
    _basic_logistic_function()

    print_section_title("basic_logistic_regression")
    _basic_logistic_regression()

    print_section_title("basic_logistic_regression_multiclass")
    _basic_logistic_regression_multiclass()

    print_section_title("basic_classification_knn_multiclass")
    _basic_classification_knn_multiclass()

    print_section_title("basic_svm_classification")
    _basic_svm_classification()

    print_section_title("basic_svm_classification_different_models")
    _basic_svm_classification_different_models()

    print_section_title("basic_gaussian_naive_bayes_classification_multiclass")
    _basic_gaussian_naive_bayes_classification_multiclass()

    print_section_title("basic_decision_trees")
    _basic_decision_trees()

    print_section_title("basic_random_forest_regression")
    _basic_random_forest_regression()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to upppercase, wrap in new lines, then print."""
    print(f"\n{string.upper()}\n")


def _get_housing_df() -> pd.DataFrame:
    """Get housing data and return it as a df."""
    housing = cast(dict, fetch_california_housing())
    data: np.ndarray = housing["data"]
    columns: list[str] = housing["feature_names"]
    price = housing["target"]
    df = pd.DataFrame(data, columns=columns)
    df["Price"] = price
    return df


def _get_iris_df() -> pd.DataFrame:
    iris = load_iris()
    data: np.ndarray = iris["data"]  # type: ignore
    columns: list[str] = ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"]
    df = pd.DataFrame(data, columns=columns)
    target: np.ndarray = iris["target"]  # type: ignore
    df["Species"] = target
    return df


def _train_test_split_2d(
    x: pd.DataFrame,
    y: pd.Series,
    **kwargs,
) -> tuple[Any, Any, Any, Any]:
    x_train, x_test, y_train, y_test = train_test_split(x, y, **kwargs)
    print(type(x_train), type(x_test), type(y_train), type(x_test))
    return x_train, x_test, y_train, y_test


# ---
# Examples
# ---


def _basic_multivariate_linear_regression():
    df = _get_housing_df()

    lr = LinearRegression()
    lr.fit(
        X=df.drop(columns=["Price"]),
        y=df["Price"],
    )
    intercept = np.round(cast(float, lr.intercept_), 2)
    coef = len(lr.coef_)
    print(f"estimated intercept: {intercept}")
    print(f"number of coefficients: {coef}")

    # Coefficients
    coef_df = pd.DataFrame(df.columns)
    coef_df.columns = ["Features"]
    coef_df["Coefficient Estimate"] = pd.Series(lr.coef_)
    print(coef_df)


def _basic_linear_regression_train_test_split():
    df = _get_housing_df()
    X = df.drop(columns=["Price"])
    y = df["Price"]
    x_train, x_test, y_train, y_test = _train_test_split_2d(X, y)

    lr = LinearRegression()
    lr.fit(X=x_train, y=y_train)

    y_pred_test = lr.predict(x_test)
    mse_test = np.mean((y_test - y_pred_test) ** 2)
    rmse_test = np.sqrt(mse_test / len(x_test))
    print(f"rmse_test: {rmse_test}")

    y_pred_train = lr.predict(x_train)
    mse_train = np.mean((y_train - y_pred_train) ** 2)
    rmse_train = np.sqrt(mse_train / len(x_train))
    print(f"rmse_train: {rmse_train}")

    # residual plot
    # - visualization: where is the error occuring?
    # - residual = y_train - y_pred_train
    # - testing to see if linear regression is a good choice
    train = plt.scatter(y_pred_train, (y_train - y_pred_train), c="b", alpha=0.5)
    test = plt.scatter(y_pred_test, (y_test - y_pred_test), c="r", alpha=0.5)
    plt.legend((train, test), ("Training", "Test"), loc="lower left")
    plt.title("Residual PLots")


# ---
# logistic function
# ---


def _basic_logistic_function():
    def logistic(t):
        # sigmoid function is a special case of the logistic function (1 / (1 + e^-t))
        return 1.0 / (1 + math.exp((-1.0) * t))

    t = np.linspace(-6, 6, 500)
    y = np.array([logistic(n) for n in t])
    plt.plot(t, y)
    plt.title("Logistic Function Example")


def _basic_logistic_regression():
    df = cast(pd.DataFrame, sm.datasets.fair.load_pandas().data)
    df["Had_Affair"] = df["affairs"].apply(lambda x: 0 if x == 0 else 1)  # pylint: disable=E1137,E1136
    # df2 = df.groupby("Had_Affair").mean().applymap(lambda x: round(x, 1))
    sns.catplot(
        x="rate_marriage",
        data=df,
        kind="count",
        hue="Had_Affair",
        palette="coolwarm",
    )


def _basic_logistic_regression_multiclass():
    df = _get_iris_df()
    species_map = {0: "Setosa", 1: "Versicolour", 2: "Virginica"}
    df["Species"] = df["Species"].replace(species_map)
    sns.pairplot(df, hue="Species")
    sns.catplot(x="Petal Length", data=df, kind="count", hue="Species")

    logr = LogisticRegression(solver="lbfgs")

    x = df.drop(columns=["Species"])
    y = df["Species"]
    x_train, x_test, y_train, y_test = _train_test_split_2d(
        x,
        y,
        test_size=0.3,
        random_state=101,
    )
    logr.fit(
        X=x_train,
        y=y_train.to_numpy().ravel(),
    )
    y_pred = logr.predict(x_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"accuracy: {accuracy}")


def _basic_classification_knn_multiclass():
    df = _get_iris_df()
    species_map = {0: "Setosa", 1: "Versicolour", 2: "Virginica"}
    df["Species"] = df["Species"].replace(species_map)
    sns.pairplot(df, hue="Species")
    sns.catplot(x="Petal Length", data=df, kind="count", hue="Species")

    x = df.drop(columns=["Species"])
    y = df["Species"]
    x_train, x_test, y_train, y_test = _train_test_split_2d(
        x,
        y,
        test_size=0.3,
        random_state=101,
    )

    knn = KNeighborsClassifier(n_neighbors=5)  # k = 5
    knn.fit(x_train, y_train)
    y_pred = knn.predict(x_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"accuracy: {accuracy}")


def _basic_svm_classification():
    df = _get_iris_df()
    species_map = {0: "Setosa", 1: "Versicolour", 2: "Virginica"}
    df["Species"] = df["Species"].replace(species_map)
    sns.pairplot(df, hue="Species")
    sns.catplot(x="Petal Length", data=df, kind="count", hue="Species")

    x = df.drop(columns=["Species"])
    y = df["Species"]
    x_train, x_test, y_train, y_test = _train_test_split_2d(
        x,
        y,
        test_size=0.3,
        random_state=101,
    )

    model = SVC(gamma="scale")  # gamma='auto' will soon be deprecated
    model.fit(
        x_train,
        y_train.values.ravel(),
    )

    y_pred = model.predict(x_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"accuracy: {round(accuracy, 2)}")


def _basic_svm_classification_different_models():
    df = _get_iris_df()
    species_map = {0: "Setosa", 1: "Versicolour", 2: "Virginica"}
    df["Species"] = df["Species"].replace(species_map)
    sns.pairplot(df, hue="Species")
    sns.catplot(x="Petal Length", data=df, kind="count", hue="Species")

    x = df.drop(columns=["Species"])
    y = df["Species"]
    x_train, x_test, y_train, y_test = _train_test_split_2d(
        x,
        y,
        test_size=0.3,
        random_state=101,
    )

    # create models
    svc = SVC(kernel="linear", C=1.0, gamma="scale")
    svc.fit(x_train, y_train.values.ravel())
    rbf_svc = SVC(kernel="rbf", C=1.0, gamma=0.7)
    rbf_svc.fit(x_train, y_train.values.ravel())
    poly_svc = SVC(kernel="poly", degree=3, C=1.0, gamma="scale")
    poly_svc.fit(x_train, y_train.values.ravel())
    lin_svc = SVC(C=1.0, gamma="scale")
    lin_svc.fit(x_train, y_train.values.ravel())
    # predict
    y_pred_svc = svc.predict(x_test)
    y_pred_rbf_svc = rbf_svc.predict(x_test)
    y_pred_poly_svc = poly_svc.predict(x_test)
    y_pred_lin_svc = lin_svc.predict(x_test)
    # accuracy
    acc_svc = accuracy_score(y_test, y_pred_svc)
    acc_rbf_svc = accuracy_score(y_test, y_pred_rbf_svc)
    acc_poly_svc = accuracy_score(y_test, y_pred_poly_svc)
    acc_lin_svc = accuracy_score(y_test, y_pred_lin_svc)
    print(f"acc_svc: {acc_svc}")
    print(f"acc_rbf_svc: {acc_rbf_svc}")
    print(f"acc_poly_svc: {acc_poly_svc}")
    print(f"acc_lin_svc: {acc_lin_svc}")


def _basic_gaussian_naive_bayes_classification_multiclass():
    # operates with the naive assumption that every feature is independent of each other

    df = _get_iris_df()
    species_map = {0: "Setosa", 1: "Versicolour", 2: "Virginica"}
    df["Species"] = df["Species"].replace(species_map)
    sns.pairplot(df, hue="Species")
    sns.catplot(x="Petal Length", data=df, kind="count", hue="Species")

    x = df.drop(columns=["Species"])
    y = df["Species"]
    x_train, x_test, y_train, y_test = _train_test_split_2d(
        x,
        y,
        test_size=0.3,
        random_state=101,
    )

    model = GaussianNB()
    model.fit(x_train, y_train.values.ravel())
    y_pred = model.predict(x_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"accuracy: {round(accuracy, 2)}")


def _basic_decision_trees():
    # decision trees
    # - ensemble learner -- ensemble of weak learners
    # - binary questions

    # make blobs (random clusters of points)
    x, y, *_ = make_blobs(
        n_samples=500,
        centers=4,
        random_state=8,
        cluster_std=2.4,
    )
    plt.figure(figsize=(6, 6))
    plt.scatter(
        x[:, 0],
        x[:, 1],
        c=y,
        s=50,
        cmap="jet",
    )  # axis, axis, classifier, size, colors

    model = DecisionTreeClassifier(max_depth=4, random_state=0)
    model = RandomForestClassifier(n_estimators=100, random_state=0)
    # TODO: complete


def _basic_random_forest_regression():
    def add_noise(x):
        noise = 0.2 * np.random.rand(len(x))
        return np.sin(5 * x) + np.sin(0.5 * x) + noise

    x = 10 * np.random.rand(100)
    y = add_noise(x)
    # plt.figure
    # plt.errorbar(x, y, yerr=0.1, fmt="o")

    # test data is made up -- does it match the train data?
    x_test = np.linspace(0, 10, 1000)
    model = RandomForestRegressor(100)
    model.fit(x[:, None], y)
    y_pred = model.predict(x_test[:, None])
    y_true = add_noise(x_test)

    # plot train and test values
    plt.errorbar(x, y, 0.1, fmt="o")  # train points
    plt.plot(x_test, y_pred, "-r")  # prediction line
    plt.plot(x_test, y_true, "-k", alpha=0.5)  # true line


# ---
# Run
# ---

main()
