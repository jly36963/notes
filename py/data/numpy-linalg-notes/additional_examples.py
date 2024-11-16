"""Numpy linalg notes."""

# pylint: disable=C0103

from typing import cast

import matplotlib.pyplot as plt
import numpy as np
import scipy
from matplotlib.pyplot import figaspect  # type: ignore
from mpl_toolkits.mplot3d import Axes3D


def _basic_eigendecompositon_of_symmetric_matrices():
    # eigendecomposition of symmetric matrices
    # symmetric matrices -- eigenvectors are all orthogonal to each other

    # create a random matrix
    A = np.random.randn(14, 14)

    # make it symmetric (additive method)
    A = A + A.T

    # diagonalize it
    evals, evecs = np.linalg.eig(A)

    # magnitudes of each vector
    print(np.sqrt(sum(evecs**2)))

    # and make plots
    plt.imshow(A)
    plt.axis("off")
    plt.title("A")
    plt.show()

    plt.imshow(evecs)
    plt.axis("off")
    plt.title("Eigenvectors")
    plt.show()

    plt.imshow(evecs @ evecs.T)
    plt.axis("off")
    plt.title("V @ Vt")
    plt.show()


def basic_eigenlayers():
    # reconstruct matrix from eigenlayers (outer products)

    # create matrix A (symmetric is easier since Vt = inv(v))
    m = 5  # dimensions
    A = np.random.randn(m, m)  # before symmetric
    A = A.T @ A  # now symmetric (contrived example)

    # eig
    evals, evecs = np.linalg.eig(A)
    # get P and D (for P @ D @ inv(P))
    D = np.diag(evals)
    P = evecs
    PtP = np.around(P.T @ P)
    # print(D, P, PtP, sep='\n\n')

    # reconstruction in layers
    A2 = np.zeros((m, m))
    for i, eigval in enumerate(evals):
        layer = np.outer(P[:, i] * D[i, i], P[:, i].T)
        A2 += layer

    # compare A and A2
    print(A, A2, sep="\n\n")


def basic_generalized_decomposition():
    # define matrices
    A = np.array([[3, 2], [1, 3]])
    B = np.array([[1, 1], [4, 1]])

    # GED
    eigvals, eigvecs = scipy.linalg.eig(A, B)

    # matrix-vector multiplication
    Av = A @ eigvecs[:, 1]
    Bv = B @ eigvecs[:, 1]
    BinvAv = np.linalg.inv(B) @ A @ eigvecs[:, 1]

    plt.plot([0, eigvecs[0, 1]], [0, eigvecs[1, 1]], "k", linewidth=4, label="v_2")
    plt.plot([0, Av[0]], [0, Av[1]], "r--", linewidth=2, label="Av_2")
    plt.xlim([-3, 3]), plt.ylim([-3, 3])
    plt.plot([-3, 3], [0, 0], "k:")
    plt.plot([0, 0], [-3, 3], "k:")
    plt.legend()
    plt.title("Av")
    plt.show()

    plt.plot([0, eigvecs[0, 1]], [0, eigvecs[1, 1]], "k", linewidth=4, label="v_2")
    plt.plot([0, Bv[0]], [0, Bv[1]], "r--", linewidth=2, label="Bv_2")
    plt.xlim([-3, 3]), plt.ylim([-3, 3])
    plt.plot([-3, 3], [0, 0], "k:")
    plt.plot([0, 0], [-3, 3], "k:")
    plt.legend()
    plt.title("Bv")
    plt.show()

    plt.plot([0, eigvecs[0, 1]], [0, eigvecs[1, 1]], "k", linewidth=4, label="v_2")
    plt.plot([0, BinvAv[0]], [0, BinvAv[1]], "r--", linewidth=2, label="B^{-1}Av_2")
    plt.xlim([-3, 3]), plt.ylim([-3, 3])
    plt.plot([-3, 3], [0, 0], "k:")
    plt.plot([0, 0], [-3, 3], "k:")
    plt.legend()
    plt.title("B^{-1}Av")
    plt.show()


def basic_svd():
    # the matrix
    A = np.array([[3, 0, 5], [8, 1, 3]])
    m = A.shape[0]
    n = A.shape[1]

    # SVD
    # 0 -- matrix U
    # 1 -- array of eigenvalues (needs to be diagonalized)
    # 2 -- matrix Vt
    U, s, Vt = np.linalg.svd(A)

    # reconstruct (check work)

    # create m x n Sigma matrix
    Sigma = np.zeros((m, n))
    # populate Sigma with n x n diagonal matrix
    # create zeros matrix (m x n) and populate with values
    # https://docs.scipy.org/doc/numpy/reference/generated/numpy.linalg.svd.html
    max_rank = min(m, n)
    Sigma[:max_rank, :max_rank] = np.diag(s)
    # reconstruct matrix
    A2 = U @ Sigma @ Vt
    # check work
    print(np.round(A - A2))

    # plot
    plt.subplot(141)
    plt.imshow(A)
    plt.title("A")
    plt.axis("off")

    plt.subplot(142)
    plt.imshow(U)
    plt.title("U")
    plt.axis("off")

    plt.subplot(143)
    plt.imshow(Sigma)
    plt.title("$Sigma$")
    plt.axis("off")

    plt.subplot(144)
    plt.imshow(Vt)
    plt.title("$V^T$")
    plt.axis("off")

    plt.show()

    def _basic_svd_example():
        # svd examples (from external source)
        # https://machinelearningmastery.com/singular-value-decomposition-for-machine-learning/

        # svd (m x n)

        # define a matrix
        A = np.array([[1, 2], [3, 4], [5, 6]])
        # SVD
        U, s, Vt = scipy.linalg.svd(A)

        # svd and reconstruct (m x n)

        # define a matrix
        A = np.array([[1, 2], [3, 4], [5, 6]])
        m = A.shape[0]
        n = A.shape[1]
        # Singular-value decomposition
        U, s, Vt = scipy.linalg.svd(A)
        # create m x n Sigma matrix
        Sigma = np.zeros((m, n))
        # populate Sigma with n x n diagonal matrixs
        max_rank = min(m, n)
        Sigma[:max_rank, :max_rank] = np.diag(s)
        # reconstruct matrix
        A2 = U @ Sigma @ Vt  # B = U.dot(Sigma.dot(Vt))
        # compare
        print(A, A2, sep="\n\n")
        print("\n---\n")

        # svd and reconstruct matrix (m x m)

        # define a matrix
        A = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
        m = A.shape[0]
        n = A.shape[1]
        # Singular-value decomposition
        U, s, Vt = scipy.linalg.svd(A)
        # create n x n Sigma matrix
        Sigma = np.diag(s)
        # reconstruct matrix
        A2 = U @ Sigma @ Vt  # B = U.dot(Sigma.dot(Vt))
        # compare
        print(A, A2, sep="\n\n")

    def _another_svd_example():
        # SVD (another example)

        # define a matrix
        A = np.random.randn(10, 4)
        m = A.shape[0]
        n = A.shape[1]
        # Singular-value decomposition
        U, s, Vt = scipy.linalg.svd(A)
        # create m x n Sigma matrix
        Sigma = np.zeros((m, n))
        # populate Sigma with n x n diagonal matrixs
        max_rank = min(m, n)
        Sigma[:max_rank, :max_rank] = np.diag(s)
        # reconstruct matrix
        A2 = U @ Sigma @ Vt  # A2 = U.dot(Sigma.dot(Vt))
        # compare
        diff = A - A2
        sq_diff = diff * diff  # hadamard multiplication
        sum_sq_diff = sq_diff.sum()
        sqrt_sum_sq_diff = np.sqrt(sum_sq_diff)
        print(f"magnitude of difference between A and A2: {round(sqrt_sum_sq_diff, 1)}")

        # plot
        plt.subplot(151)
        plt.imshow(A)
        plt.title("A")
        plt.axis("off")

        plt.subplot(152)
        plt.imshow(U)
        plt.title("U")
        plt.axis("off")

        plt.subplot(153)
        plt.imshow(Sigma)
        plt.title("$Sigma$")
        plt.axis("off")

        plt.subplot(154)
        plt.imshow(Vt)
        plt.title("$V^T$")
        plt.axis("off")

        plt.subplot(155)
        plt.imshow(A2)
        plt.title("A2")
        plt.axis("off")

        plt.show()


def basic_spectral_theory():
    # matrix sizes
    m = 40
    n = 30

    # define a 2D Gaussian for smoothing
    k = int((m + n) / 4)
    xx = np.linspace(-3, 3, k)
    [X, Y] = np.meshgrid(xx, xx)
    g2d = np.exp(-(X**2 + Y**2) / (k / 8))

    # matrix
    A = scipy.signal.convolve2d(np.random.randn(m, n), g2d, "same")

    # SVD
    U, s, Vt = np.linalg.svd(A)

    # get Sigma
    Sigma = np.zeros((m, n))
    # populate Sigma with n x n diagonal matrixs
    max_rank = min(m, n)
    Sigma[:max_rank, :max_rank] = np.diag(s)

    # show the constituent matrices
    plt.subplot(241)
    plt.imshow(A)
    plt.title("A")

    plt.subplot(242)
    plt.imshow(U)
    plt.title("U")

    plt.subplot(243)
    plt.imshow(Sigma)
    plt.title("$Sigma$")

    plt.subplot(244)
    plt.imshow(Vt)
    plt.title("V$^T$")

    plt.subplot(212)
    plt.plot(S, "ks-")
    plt.xlabel("Component number")
    plt.ylabel("$sigma$")
    plt.title('"Scree plot" of singular values')

    plt.show()

    # ---

    # spectral theory (part 2)

    rank1mats = np.zeros((5, m, n))

    for i in range(0, 5):
        # create rank1 matrix
        rank1mats[i, :, :] = np.outer(U[:, i] * s[i], Vt[i, :])

        plt.subplot2grid((2, 5), (0, i))
        plt.imshow(rank1mats[i, :, :])
        plt.axis("off")
        plt.title(f"C.{(i + 1)}")

        plt.subplot2grid((2, 5), (1, i))
        imdat = np.sum(rank1mats[: i + 1, :, :], axis=0)
        plt.imshow(imdat)
        plt.axis("off")
        plt.title(f"Cs 1:{(i + 1)}")

    plt.show()

    # ---

    # spectral theory (part 3)
    # compare A and low-rank version of A

    # svd for low-rank approximations

    # number of components (singular "layers") to keep
    nComps = 5

    # reduced vectors
    Ur = U[:, 0:nComps]  # 5 columns from U
    Sr = s[0:nComps]  # 5 singular values
    Vr = Vt[0:nComps, :]  # 5 rows from Vt

    # low-rank approximation
    # sum of 5 most important layers from SVD
    reconImage = Ur @ np.diag(Sr) @ Vr

    # rank (confirm same as nComps)
    print("rank =", np.linalg.matrix_rank(reconImage))

    # error map and percent difference from original matrix
    errormap = (reconImage - A) ** 2
    pctdiff = 100 * np.linalg.norm(reconImage - A) / np.linalg.norm(A)

    # show the results!
    plt.subplot(131)
    plt.imshow(A)
    plt.axis("off")
    plt.title("Original")

    plt.subplot(132)
    plt.imshow(reconImage)
    plt.axis("off")
    plt.title("Low-rank")

    plt.subplot(133)
    plt.imshow(errormap)
    plt.axis("off")
    plt.title("error")
    plt.show()


def svd_to_percent_variance():
    # convert singular values to percent variance
    # svd
    # sum all singular values
    # divide each value by sum
    # multiply by 100

    # matrix sizes
    m = 40
    n = 30

    # define a 2D Gaussian for smoothing
    k = int((m + n) / 4)
    xx = np.linspace(-3, 3, k)
    [X, Y] = np.meshgrid(xx, xx)
    g2d = np.exp(-(X**2 + Y**2) / (k / 8))

    # matrix
    A = scipy.signal.convolve2d(np.random.randn(m, n), g2d, "same")

    # SVD
    U, s, Vt = np.linalg.svd(A)

    # convert to percent variance
    spct = 100 * s / np.sum(s)

    # plot the singular values for comparison
    plt.subplot(211)
    plt.plot(s, "ks-")
    plt.xlabel("Component number")
    plt.ylabel("$sigma$")
    plt.title("Raw singular values")

    plt.subplot(212)
    plt.plot(spct, "ks-")
    plt.xlabel("Component number")
    plt.ylabel("$sigma$ (% of total)")
    plt.title("Percent-change-normalized singular values")
    plt.show()


def _basic_pseudoinverse():
    # # pseudoinverse for square matrix

    A = np.random.randn(4, 4)

    pseudoInvA = np.linalg.pinv(A)

    plt.subplot(131)
    plt.imshow(A)
    plt.axis("off")
    plt.title("A")

    plt.subplot(132)
    plt.imshow(pseudoInvA)
    plt.axis("off")
    plt.title("Pseudoinverse of A")

    plt.subplot(133)
    plt.imshow(pseudoInvA @ A)
    plt.axis("off")
    plt.title("A$^*$A")

    plt.show()

    # ---

    # pseudo-inverse (left and right multiplying pinv(A) and A)

    # create random matrix
    n = 50
    A = np.random.randn(n, n)

    # make rank deficient by repeating a column
    A[:, n - 1] = A[:, n - 2]

    # rank of A!
    print("rank =", np.linalg.matrix_rank(A))

    # compute the pseudoinverse
    Ai = np.linalg.pinv(A)

    # and show the matrices
    plt.subplot(221)
    plt.imshow(A)
    plt.axis("off")
    plt.title("A")

    plt.subplot(222)
    plt.imshow(Ai)
    plt.axis("off")
    plt.title("A$^*$")

    plt.subplot(223)
    plt.imshow(Ai @ A)
    plt.axis("off")
    plt.title("A$^*$A")

    plt.subplot(224)
    plt.imshow(A @ Ai)
    plt.axis("off")
    plt.title("AA$^*$")


def _basic_svd_pseudoinverse():
    # SVD, matrix inverse, pseudoinverse

    # the matrix
    A = np.matrix([[1, 2, 3], [1, 2, 4], [1, 2, 5]])

    # dimensions
    m = A.shape[0]
    n = A.shape[1]
    max_rank = min(m, n)

    # SVD
    U, s, Vt = np.linalg.svd(A)

    # get V
    V = Vt.T

    # get Sinv
    s_inv = s.copy()
    s_inv[s_inv > 0.001] **= -1
    s_inv[s_inv <= 0.001] *= 0

    # create Sigma -- zeros matrix (m x n)
    Sinv = np.zeros(A.shape)
    # populate Sigma with n x n diagonal matrix
    Sinv[:max_rank, :max_rank] = np.diag(s_inv)

    # now pseudoinvert A (note that python produces V^T, hence V.T below is actually V)
    Apinv = V @ Sinv.T @ U.T

    # SVD pseudoinverse
    print(Apinv @ A, "\n")
    # np.pinv pseudoinverse
    print(np.linalg.pinv(A) @ A)

    def _basic_pseudoinverse_example():
        # pseudoinverse (pinv) (external source)
        # Moore-Penrose Pseudoinverse

        # define matrix
        A = np.array([[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8]])
        # calculate pseudoinverse
        Apinv = np.linalg.pinv(A)
        print(np.round(Apinv))

    def _basic_pseudoinverse_using_svd_linear_dependent():
        # pseudoinverse using SVD (linearly dependent) (external source)

        # define matrix
        A = np.array([[0.2, 0.2], [0.4, 0.4], [0.6, 0.6], [0.8, 0.8]])
        # dimensions
        m = A.shape[0]
        n = A.shape[1]
        max_rank = min(m, n)
        # calculate svd
        U, s, Vt = np.linalg.svd(A)

        # get V
        V = Vt.T

        # get S
        # reciprocals of s (non-zero)
        s_inv = s.copy()
        s_inv[s_inv > 0.001] **= -1
        s_inv[s_inv <= 0.001] *= 0
        # create Sigma -- zeros matrix (m x n)
        Sigma = np.zeros(A.shape)
        # populate Sigma with n x n diagonal matrix
        Sigma[:max_rank, :max_rank] = np.diag(s_inv)

        # calculate pseudoinverse
        Apinv = V @ Sigma.T @ U.T  # Apinv = V.dot(Sigma.T).dot(U.T)
        print(np.round(Apinv, 3))

        # A @ Ainv should be I (for invertable matrix)
        np.round(A @ Apinv, 3)


def _basic_condition_number():
    # example of well structured data with a high condition number

    # matrix sizes
    m = 40
    n = 40

    # define a 2D Gaussian for smoothing
    k = int((m + n) / 4)
    xx = np.linspace(-3, 3, k)
    [X, Y] = np.meshgrid(xx, xx)
    g2d = np.exp(-(X**2 + Y**2) / (k / 8))

    # matrix
    A = np.random.randn(m, m)
    A = scipy.signal.convolve2d(np.random.randn(m, n), g2d, "same")

    # SVD
    U, s, Vt = np.linalg.svd(A)

    # compute condition number
    condnum = s[0] / s[-1]

    # show the matrix
    plt.subplot(211)
    plt.imshow(A)
    plt.axis("off")
    plt.title(f"Cond.num: {condnum}")

    plt.subplot(212)
    plt.plot(s, "ks-")
    plt.xlabel("Component number")
    plt.ylabel("$sigma$")
    plt.title('"Scree plot" of singular values')

    plt.show()

    # condition number of a matrix (pt 2?)

    ## sphere

    # the transformation matrix T
    T = np.eye(3)
    T[-1, -1] = 0.5

    fig = plt.figure()
    ax = cast(Axes3D, fig.add_subplot(111, projection="3d"))

    # Make data
    n = 21
    u = np.linspace(0, 2 * np.pi, n)
    v = np.linspace(0, np.pi, n)
    x = np.outer(np.cos(u), np.sin(v))
    y = np.outer(np.sin(u), np.sin(v))
    z = np.outer(np.ones(np.size(u)), np.cos(v))

    # put coords in a matrix to be transformed
    M = np.concatenate(
        (
            np.reshape(x, (n * n, 1)),
            np.reshape(y, (n * n, 1)),
            np.reshape(z, (n * n, 1)),
        ),
        axis=1,
    )

    # apply the transformation matrix to the coordinates
    TM = T @ M.T

    # get out the new coordinates
    xp = np.reshape(TM[0, :], (n, n))
    yp = np.reshape(TM[1, :], (n, n))
    zp = np.reshape(TM[2, :], (n, n))

    # Plot the surface
    ax.plot_surface(xp, yp, zp, color="b")
    ax.set_xlim3d(-1, 1)
    ax.set_ylim3d(-1, 1)
    ax.set_zlim3d(-1, 1)

    plt.show()


def _basic_quadratic_form():
    # quadratic form in linear algebra

    # matrix and vector
    S = [[1, 3, -2], [0, 3, 4], [-5, -2, 4]]

    w = np.transpose([[-2, 4, 3]])

    # compute the quadratic form
    qf = np.transpose(w) @ S @ w

    n = len(w)  # used for plotting

    # show the matrices
    plt.subplot(131)
    plt.imshow(S)
    plt.axis("off")
    plt.title("Matrix S")

    plt.subplot(132)
    plt.imshow(w)
    plt.axis("off")
    plt.title("Vector w")

    plt.subplot(133)
    plt.imshow(qf)
    plt.title("Quadratic form: w^TSw")

    plt.show()

    def _basic_quadratic_form_geometry():
        # quadratic form in linear geometry

        # some different matrices
        S = np.zeros((4,), dtype=object)
        S[0] = [[4, 4], [4, 9]]
        S[1] = [[-4, -1], [3, -5]]
        S[2] = [[0, 1], [2, 0]]
        S[3] = [[1, 1], [1, 1]]

        # range for vector w
        n = 30
        wRange = np.linspace(-2, 2, n)

        # initialize quadratic form matrix
        qf = np.zeros((len(wRange), len(wRange)))

        for i in range(4):
            # compute QF
            for xi in range(n):
                for yi in range(n):
                    # this w
                    w = np.transpose([wRange[xi], wRange[yi]])
                    # QF
                    qf[xi, yi] = np.transpose(w) @ S[i] @ w

            # show the map
            plt.subplot(2, 2, i + 1)
            plt.imshow(qf)

        plt.show()

        # 3D plotting code, contributed by student Laurens Sandt

        for i in range(4):
            for xi in range(n):
                for yi in range(n):
                    w = np.array([wRange[xi], wRange[yi]])
                    qf[xi, yi] = w.T @ S[i] @ w

            # show the map
            fig = plt.figure(figsize=(10, 6))
            ax1 = cast(Axes3D, fig.add_subplot(221 + i, projection="3d"))

            X, Y = np.meshgrid(wRange, wRange)
            Z = qf.T

            mycmap = plt.get_cmap("gist_earth")
            surf1 = ax1.plot_surface(X, Y, Z, cmap=mycmap)
            fig.colorbar(surf1, ax=ax1, shrink=0.5, aspect=5)

            # play with the azim and elevation to look at the plot from different perspectives
            ax1.view_init(azim=-30, elev=30)

        plt.show()

    def _eigenvectors_and_quadratic_form_surface():
        # eigenvectors and the quadratic form surface

        # a happy little symmetric matrix
        A = [[1, 2], [2, 3]]

        # range for vector w
        n = 30
        wRange = np.linspace(-2, 2, n)

        # initialize quadratic form matrix
        qf = np.zeros((len(wRange), len(wRange)))

        # compute QF
        for xi in range(n):
            for yi in range(n):
                # this w
                w = np.transpose([wRange[xi], wRange[yi]])

                # QF
                qf[xi, yi] = np.transpose(w) @ A @ w / (np.transpose(w) @ w)

        # compute eigendecomposition
        D, V = np.linalg.eig(A)

        # show the surface
        plt.imshow(qf, extent=(-2, 2, -2, 2))

        # show the eigenvectors
        plt.plot([0, V[0, 0]], [0, V[1, 0]])
        plt.plot([0, V[0, 1]], [0, V[1, 1]])
        print(V)
        plt.show()

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

    def _quadratic_form_of_generalized_eigenvectors():
        # quadratic form of generalized eigenvectors

        # create two symmetric matrices
        m = 14
        n = 1000

        # create A as random sine-modulated noise, then its covariance matrix
        A = np.zeros((m, n))
        for i in range(0, n):
            A[:, i] = np.random.randn(m) * np.cos(np.linspace(0, np.pi, m))
        A = A @ A.T

        # B is the same thing, just different random numbers
        B = np.zeros((m, n))
        for i in range(0, n):
            B[:, i] = np.random.randn(m) * np.cos(np.linspace(0, np.pi, m))
        B = B @ B.T

        # generalized eigendecomposition
        evals, evecs = scipy.linalg.eig(A, B)

        # ---

        # quadratic form of generalized eigenvectors (visualization)

        ## some plotting

        # W'W
        plt.subplot(231)
        plt.imshow(evecs.T @ evecs, extent=(-m, m, -m, m))
        plt.xticks([])
        plt.title("W^TW")

        # one row of W'W
        tmp = evecs.T @ evecs
        plt.subplot(234)
        plt.plot(tmp[1, :])
        plt.title("W_j^TW")

        # W'AW
        plt.subplot(232)
        plt.imshow(evecs.T @ A @ evecs, extent=(-m, m, -m, m))
        plt.xticks([])
        plt.title("W^TAW")

        # one row of W'AW
        tmp = evecs.T @ A @ evecs
        plt.subplot(235)
        plt.plot(tmp[1, :])
        plt.title("W_j^TAW")

        # W'BW
        plt.subplot(233)
        plt.imshow(evecs.T @ B @ evecs, extent=(-m, m, -m, m))
        plt.xticks([])
        plt.title("W^TBW")

        # diagonal of W'BW
        plt.subplot(236)
        plt.plot(np.diag(evecs.T @ B @ evecs))
        plt.title("diag(W^TBW)")

        plt.show()


def basic_metric_definiteness():
    # matrix definiteness, geometry, eigenvalues

    # some different matrices
    S = np.zeros((5,), dtype=object)
    S[0] = [[4, 4], [4, 9]]
    S[1] = [[-4, -1], [-3, -5]]
    S[2] = [[0, 1], [2, 0]]
    S[3] = [[1, 1], [1, 1]]
    S[4] = [[-1, -2], [-3, -6]]

    # range for vector w
    n = 30
    wRange = np.linspace(-2, 2, n)

    # initialize quadratic form matrix
    qf = np.zeros((len(wRange), len(wRange)))

    for i in range(5):
        # compute QF
        for xi in range(n):
            for yi in range(n):
                # this w
                w = np.transpose([wRange[xi], wRange[yi]])

                # QF
                qf[xi, yi] = np.transpose(w) @ S[i] @ w

        # show the map
        plt.subplot(2, 3, i + 1)
        plt.imshow(qf.T)

        ## compute the matrix's definiteness based on the eigenvalues

        # get eigenvalues
        evals = np.linalg.eig(S[i])

        # we care about their signs
        esign = np.sign(evals[0])

        # test for signs (note: this test is valid only for 2x2 matrices!)
        match sum(esign):
            case 2:
                defcat = "Pos. def."
            case 1:
                defcat = "Pos. semidef."
            case 0:
                defcat = "Indeterminant"
            case -1:
                defcat = "Neg. semidef."
            case -2:
                defcat = "Neg. def."
            case _:
                defcat = "Idk"

        # add title
        plt.title(defcat)

    plt.show()


# ---
# Figures
# ---


def _basic_matrix_systems_of_linear_equations():
    # systems of linear equations

    # these are the coefficients of the equation:
    # az = bx + cy + d
    eq1o = [1, 2, 3, -1]  # [a b c d]
    eq2o = [2, 1, 3, 3]

    # set up for 3D plot
    fig = plt.figure()
    ax = cast(Axes3D, fig.add_subplot(projection="3d"))

    # 10 plots
    for i in range(0, 10):
        # randomly update equations
        eq1 = np.add(eq2o, np.random.randn(1) * eq1o)
        eq2 = np.add(eq1o, np.random.randn(1) * eq2o)

        # plot new lines (solutions)
        y = ([eq1[1] * -3, eq1[1] * 3] + eq1[3]) / eq1[0]
        z = ([eq1[2] * -3, eq1[2] * 3] + eq1[3]) / eq1[0]
        ax.plot([-3, 3], y, z)

        # plot new lines (solutions)
        y = ([eq2[1] * -3, eq2[1] * 3] + eq2[3]) / eq2[0]
        z = ([eq2[2] * -3, eq2[2] * 3] + eq2[3]) / eq2[0]
        ax.plot([-3, 3], y, z)

        # axis limits
        ax.set_xlim3d(-3, 6)
        ax.set_ylim3d(-3, 6)
        ax.set_zlim3d(-1, 10)


def _column_space_example():
    # column space example

    # matrix S
    S = np.array([[1, 0], [5, 2], [1, 1]])

    # vector v
    v = np.array([[1], [7], [3]])

    # create plt figure object
    fig = plt.figure()
    ax = cast(Axes3D, fig.add_subplot(projection="3d"))

    # draw plane corresponding to the column space
    xx, yy = np.meshgrid(np.linspace(-1, 1, 10), np.linspace(-1, 6, 10))
    cp = np.cross(S[:, 0], S[:, 1])
    z1 = (-cp[0] * xx - cp[1] * yy) / cp[2]
    ax.plot_surface(xx, yy, z1)

    ## plot the two vectors from matrix S
    ax.plot([0, S[0, 0]], [0, S[1, 0]], [0, S[2, 0]], "k")
    ax.plot([0, S[0, 1]], [0, S[1, 1]], [0, S[2, 1]], "k")

    # and the vector v
    ax.plot([0, v[0]], [0, v[1]], [0, v[2]], "r")

    ax.view_init(elev=60, azim=0)
    plt.show()


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
