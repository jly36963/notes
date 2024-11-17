"""Numpy linalg notes."""

# pylint: disable=C0103

from typing import cast

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.pyplot import figaspect  # type: ignore
from mpl_toolkits.mplot3d import Axes3D


def _basic_quadratic_form():
    # quadratic form in linear algebra

    # matrix and vector
    S = [[1, 3, -2], [0, 3, 4], [-5, -2, 4]]

    w = np.transpose([[-2, 4, 3]])

    # compute the quadratic form
    qf = np.transpose(w) @ S @ w

    n = len(w)  # used for plotting


def _basic_pca():
    # application of the normalized quadratic form (principle component analysis) (PCA)

    # simulation parameters
    N = 1000  # time points
    M = 20  # channels

    # time vector (radian units)
    t = np.linspace(0, 6 * np.pi, N)

    # relationship across channels (imposing covariance)
    chanrel = np.sin(np.linspace(0, 2 * np.pi, M))

    # initialize data
    data = np.zeros((M, N))

    # create dataset
    for i in np.arange(0, M):
        data[i, :] = np.sin(t) * chanrel[i]

    # add noise
    data = data + np.random.randn(M, N) / 3

    # mean-center
    for i in np.arange(0, M):
        data[i, :] = data[i, :] - np.mean(data[i, :])

    # compute covariance matrix
    covmat = data @ data.T / (N - 1)

    # eigendecomposition of the covariance matrix
    evals, evecs = np.linalg.eig(covmat)

    # sort eigenvalues and eigenvectors
    idx = evals.argsort()[::-1]
    evals = np.real(evals[idx])
    evecs = evecs[:, idx]

    # convert eigenvalues to percent variance explained
    evals = 100 * evals / np.sum(evals)

    # compute component time series
    r = 2  # two components
    comp_time_series = evecs[:, 0:r].T @ data

    # visualize and interpret the results

    # eigenvalues
    plt.subplot(121)
    plt.plot(evals)
    plt.xlabel("Component number")
    plt.ylabel("$lambda$ (% total variance)")
    plt.title("Eigenspectrum")

    # eigenvectors
    plt.subplot(122)
    plt.plot(evecs[:, 0], label="PC1")
    plt.plot(evecs[:, 1], label="PC2")
    plt.xlabel("Channel")
    plt.ylabel("PC weight")
    plt.title("Eigenvectors")
    plt.legend()
    plt.show()

    # original channel modulator
    plt.plot(chanrel)
    plt.xlabel("Channel")
    plt.ylabel("Channel weight")
    plt.title("Ground truth channel weights")
    plt.show()

    # component time series
    plt.plot(comp_time_series[0, :], label="PC1")
    plt.plot(comp_time_series[1, :], label="PC2")
    plt.xlabel("Time (a.u.)")
    plt.ylabel("Activity")
    plt.legend()
    plt.title("Time course plots")
    plt.show()


# ---
# Figures
# ---


def _r3_projections_geometric_perspective():
    ## geometric perspective in R3 (projections)

    # matrix sizes
    m = 3
    n = 2

    # vector b
    b = np.random.randn(m, 1)

    # matrix A
    A = np.random.randn(m, n)

    # solution
    x = np.linalg.solve(A.T @ A, A.T @ b)
    Ax = A @ x

    print(b)
    print(Ax)

    ## plot
    fig = plt.figure(figsize=figaspect(1))
    ax = cast(Axes3D, fig.add_subplot(projection="3d"))

    # plot the vectors
    ax.plot([0, b[0]], [0, b[1]], [0, b[2]], "r")
    ax.plot([0, Ax[0]], [0, Ax[1]], [0, Ax[2]], "b")

    # plot the projection line
    ax.plot([Ax[0][0], b[0]], [Ax[1][0], b[1]], [Ax[2][0], b[2]], "g")

    # now draw plane
    xx, yy = np.meshgrid(np.linspace(-2, 2), np.linspace(-2, 2))
    cp = np.cross(A[:, 0], A[:, 1])
    z1 = (-cp[0] * xx - cp[1] * yy) * 1.0 / cp[2]
    ax.plot_surface(xx, yy, z1)

    plt.show()
