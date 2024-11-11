"""Numpy linalg notes."""

# pylint: disable=C0103

from typing import cast

import matplotlib.pyplot as plt
import numpy as np
import scipy
from matplotlib.patches import Circle, PathPatch
from matplotlib.pyplot import figaspect  # type: ignore
from mpl_toolkits.mplot3d import Axes3D, art3d
from sympy import Matrix, matrix2numpy


def _basic_matrix_one_sided_inverse():
    """One-sided, left or right inverse."""
    # m>n for left inverse,
    # m<n for right inverse
    m = 6
    n = 3

    # create matrices
    A = np.random.randn(m, n)
    AtA = A.T @ A
    AAt = A @ A.T

    # inspect ranks
    # tall matrices -- use left inverse
    # wide matrices -- use right inverse
    # this matrix is tall
    # left will be full rank (3 out of 3)
    # right will be rank deficient (3 out of 7)
    print("Rank of A^TA:", np.linalg.matrix_rank(AtA))
    print("Rank of AA^T:", np.linalg.matrix_rank(AAt))

    # left inverse
    Aleft = np.linalg.inv(AtA) @ A.T

    # right inverse
    Aright = A.T @ np.linalg.inv(AAt)

    # now test!
    I_left = Aleft @ A
    I_right = A @ Aright

    # and then test using the inverse function
    AtA_inv = np.linalg.inv(AtA)
    I_AtA = AtA_inv @ AtA

    AAt_inv = np.linalg.inv(AAt)
    I_AAt = AAt_inv @ AAt

    ## show images

    # A
    plt.subplot(331)
    plt.imshow(A)
    plt.axis("off")
    plt.title("A")

    # AtA
    plt.subplot(332)
    plt.imshow(AtA)
    plt.axis("off")
    plt.title("A$^T$A")

    # AAt
    plt.subplot(333)
    plt.imshow(AAt)
    plt.axis("off")
    plt.title("AA$^T$")

    # left inverse
    plt.subplot(335)
    plt.imshow(Aleft)
    plt.axis("off")
    plt.title("$(A^TA)^{-1}A^T$")

    # right inverse
    plt.subplot(336)
    plt.imshow(Aright)
    plt.axis("off")
    plt.title("$A^T(AA^T)^{-1}$")

    # left inverse @ A
    plt.subplot(338)
    plt.imshow(I_left)
    plt.axis("off")
    plt.title("[ $(A^TA)^{-1}A^T ]$  A")

    # A @ right inverse
    plt.subplot(339)
    plt.imshow(I_right)
    plt.axis("off")
    plt.title("A  [ $A^T(AA^T)^{-1}$ ]")

    plt.show()


def _basic_r2_projections():
    # point b
    b = np.array([4, 1])

    # line a
    a = np.array([2, 5])

    # beta
    beta = (a.T @ b) / (a.T @ a)

    # draw
    plt.plot(b[0], b[1], "ko", label="a")
    plt.plot([0, a[0]], [0, a[1]], "b", label="b")

    # now plot projection line
    plt.plot([b[0], beta * a[0]], [b[1], beta * a[1]], "r--", label=r"$beta$a")

    plt.legend()
    plt.axis((-6, 6, -6, 6))

    plt.show()


def _basic_rn_projections():
    # sizes
    m = 16
    n = 10

    # vector b
    b = np.random.randn(m, 1)

    # matrix A
    A = np.random.randn(m, n)

    # solution using explicit inverse (can cause computer rounding errors)
    x1 = np.linalg.inv(A.T @ A) @ (A.T @ b)

    # python solution (preferred method)
    x2 = np.linalg.solve(A.T @ A, A.T @ b)

    # show that the results are the same
    print(x1, x2, sep="\n\n")


def _basic_qr_decomposition():
    # example from the slides

    A = [[1, 0], [1, 0], [0, 1]]

    # "full" QR decomposition
    Q, R = np.linalg.qr(A, "complete")
    print(Q, "\n" * 2, R, "\n" * 2)

    # "economy" QR decompmosition
    Q, R = np.linalg.qr(A)  # is the default option in Python
    print(Q, "\n" * 2, R, "\n" * 2)


def _basic_qr_decomposition_2():
    # QR decomposition (example 2)

    # the to-be-decomposed matrix
    M = np.array([[1, 1, -2], [3, -1, 1]])

    # QR decomposition
    Q, R = np.linalg.qr(M, "complete")

    # notice:
    print("R from QR: "), print(R)
    print("R from QtA: "), print(Q.T @ M)

    # plot
    colorz = "krg"

    for i in range(0, np.shape(M)[1]):
        # plot original vector M
        plt.plot([0, M[0, i]], [0, M[1, i]], colorz[i])

        # plot orthogonalized vector Q
        if i < np.shape(Q)[1]:
            plt.plot([0, Q[0, i]], [0, Q[1, i]], colorz[i], linestyle="--")

        # plot residual vector R
        plt.plot([0, R[0, i]], [0, R[1, i]], colorz[i], linestyle=":")

    plt.legend(["M_1", "Q_1", "R_1"])
    plt.axis("square")
    plt.xlim(-4, 4)
    plt.ylim(-4, 4)
    plt.grid(True)
    plt.plot()


def _basic_gran_schmidt_algorithm():
    # gran-schmidt algorithm

    # POSSIBLY WORKING?

    m, n = 4, 4

    A = np.random.randn(m, n)
    G = np.copy(A)

    # Gran Schmidt
    for i in range(0, n):
        # orthogonalize
        for j in range(0, i):
            G[:, i] = G[:, i] - G[:, i].T * G[:, j] * G[:, j]
        # normalize
        G[:, i] = G[:, i] / np.linalg.norm(G[:, i])

    # QR Decomp
    Q, R = np.linalg.qr(A)
    print(G, Q, sep="\n\n")

    # Plot
    plt.subplot(221)
    plt.imshow(G)
    plt.axis("off")
    plt.title("G")

    plt.subplot(222)
    plt.imshow(Q)
    plt.axis("off")
    plt.title("Q")


def _basic_inverse_via_qr_decomposition():
    # QR for matrix inverse
    # A = QR
    # inv(A) = inv(QR)
    # inv(A) = inv(R) @ Qt

    m, n = 3, 3
    A = np.random.randn(m, n)

    Ainv = np.linalg.inv(A)

    Q, R = np.linalg.qr(A)

    Ainv_qr = np.linalg.inv(R) @ Q.T  # matmul

    # Plot
    plt.subplot(221)
    plt.imshow(Ainv)
    plt.axis("off")
    plt.title("inv")

    plt.subplot(222)
    plt.imshow(Ainv_qr)
    plt.axis("off")
    plt.title("qr inv")

    plt.subplot(223)
    plt.imshow(Q @ Q.T)
    plt.axis("off")
    plt.title("Q @ Qt")

    # correlation
    corr = np.corrcoef(Ainv, Ainv_qr)
    np.round(corr, 1)


def _basic_sherman_morrison_inverse():
    # COMPUTER ROUNDING ERRORS PROPOGATE
    # DIVIDE BY ZERO ERROR IF denominator = 0

    m = 5
    a = np.random.randn(m, 1)
    b = np.random.randn(m, 1)

    # I - a*bt
    A = np.eye(m) - a @ b.T
    # Ainv = I + (a @ bt) / (1 - at*b)
    Ainv = np.eye(m) + (a @ b.T) / (1 - a.T * b)
    # A @ Ainv = I
    outer_product = A @ Ainv
    np.round(outer_product)


def _basic_qr_decomp_3():
    # AtA = RtR
    # A is matrix A
    # R is matrix R from QR decomposition -- A = QR

    # dimensions
    m, n = 10, 4
    # matrix
    A = np.random.randn(m, n)
    Q, R = np.linalg.qr(A)

    AtA = A.T @ A
    RtR = R.T @ R

    print(np.round(AtA, 2), np.round(RtR, 2), sep="\n\n")


def _least_squares():
    print("...")


def _least_squares_examples():
    print("...")

    def _lease_squares_row_reduction():
        m = 10
        n = 3

        # create data
        X = np.random.randn(m, n)  # "design matrix"
        y = np.random.randn(m, 1)  # "outcome measures (data)"

        # try directly applying RREF
        Xy = Matrix(np.concatenate([X, y], axis=1))

        # now reapply to the normal equations
        XtX = X.T @ X
        Xty = X.T @ y
        normEQ = Matrix(np.concatenate([XtX, Xty], axis=1))

        Xsol = normEQ.rref()
        Xsol = Xsol[0]
        beta = Xsol[:, -1]

        # compare to left-inverse
        beta2 = np.linalg.inv(XtX) @ Xty

        # and with the python solver
        beta3 = np.linalg.solve(XtX, Xty)
        print(beta, beta2, beta3, sep="\n\n")

    def _least_squares_vis_example():
        # least squares (example 1, pt1) (different design matrices)
        # X @ Beta = y

        # data
        data = np.array([[-4, 0, -3, 1, 2, 8, 5, 8]]).T  # the ".T" is for transpose
        N = len(data)

        # design matrix
        X = np.ones([N, 1])
        # fit the model
        b = np.linalg.solve(X.T @ X, X.T @ data)

        # compare against the mean
        m = np.mean(data)

        # print the results
        print(b, m)

        # compute the model-predicted values
        yHat = X @ b

        # plot data and model prediction
        plt.plot(np.arange(1, N + 1), data, "bs-", label="Data")
        plt.plot(np.arange(1, N + 1), yHat, "ro--", label="Model pred.")

        plt.legend()
        plt.show()

        # least squares -- (example 1, pt2)
        # X @ Beta = y

        # new design matrix
        X = np.array([np.arange(0, N)]).T
        # fit the model
        b = np.linalg.solve(X.T @ X, X.T @ data)

        # compute the model-predicted values
        yHat = X @ b

        # plot data and model prediction
        plt.plot(np.arange(1, N + 1), data, "bs-", label="Data")
        plt.plot(np.arange(1, N + 1), yHat, "ro--", label="Model pred.")

        plt.legend()
        plt.show()

    def _least_squares_vis_example_2():
        # least squares (example 2, pt1)

        # load data
        data = sio.loadmat("./data/EEG_RT_data.mat")
        rts = data["rts"]
        rts = rts[0]
        EEGdata = data["EEGdata"]
        frex = data["frex"]
        frex = frex[0]

        n_trials = len(rts)
        n_frex = len(frex)

        # show the data
        plt.subplot(211)
        plt.plot(rts, "ks-")
        plt.xlabel("Trial")

        plt.subplot(212)
        plt.imshow(EEGdata, origin="lower")
        plt.xlabel("Trial")
        plt.ylabel("Frequency")
        plt.show()

        # least squares (example 2, pt2)

        # initialize beta coefficients vector
        b = np.zeros(len(frex))

        # loop over frequencies
        for fi in np.arange(0, len(frex)):
            # design matrix
            X = np.concatenate(
                [np.ones([n_trials, 1]), np.reshape(EEGdata[fi, :], (n_trials, 1))],
                axis=1,
            )

            # compute parameters
            t = np.linalg.solve(X.T @ X, X.T @ rts)
            b[fi] = t[1]

        # plots
        plt.subplot(211)
        plt.plot(frex, b, "rs-")
        plt.xlabel("Frequency (Hz)")
        plt.ylabel("beta-coefficient")

        plt.subplot(223)
        plt.plot(EEGdata[8, :], rts, "ks")

        plt.subplot(224)
        plt.plot(EEGdata[23, :], rts, "ks")
        plt.show()

    def _least_squares_via_qr_decomp():
        # dimensions
        m, n = 10, 3
        # X @ Beta = y
        X = np.random.randn(m, n)
        y = np.random.randn(m, 1)

        # QR least square
        Q, R = np.linalg.qr(X)
        Beta1 = np.linalg.inv(R.T @ R) @ (Q @ R).T @ y

        # inv least square (lstsq returns more than just beta)
        Beta2 = np.linalg.lstsq(X, y, rcond=None)[0]

        # print
        print(Beta1, Beta2, sep="\n\n")


def _basic_eigendecomposition():
    def _basic_eigendecomposition_example():
        A = [[1, 5], [2, 4]]

        # extract the eigenvalues
        eigvals = np.linalg.eig(A)[0]  # eigenvalues are the first element of array
        print(eigvals)

        # specify two vectors
        v1 = np.array([1, 1])  # is an eigenvector!
        v2 = np.random.randn(2, 1)  # unlikely to be an eigenvector
        v2 = v2 / np.linalg.norm(v2)  # unit length for convenience

        # compute Av
        Av1 = A @ v1
        Av2 = A @ v2

        # plot the vectors and Av
        plt.plot([0, v1[0]], [0, v1[1]], "r")
        plt.plot([0, Av1[0]], [0, Av1[1]], "r--")
        plt.plot([0, v2[0]], [0, v2[1]], "k")
        plt.plot([0, Av2[0]], [0, Av2[1]], "k--")

        plt.axis([-8, 8, -8, 8])
        plt.show()

    def _basic_eigenvalues():
        # eigenvalues (3x3)

        # confirm eigenvalues for a 3x3 matrix

        # specify matrix
        A = [[-2, 2, -3], [-4, 1, -6], [-1, -2, 0]]

        # get eigenvalues
        evals = np.linalg.eig(A)[0]
        print(evals)

    def _basic_eigenvectors():
        # matrix
        A = [[1, 2], [2, 1]]

        # eigenvectors (compare with code above)
        # note also the differences with MATLAB: different order, evals in vector
        evals, evecs = np.linalg.eig(A)
        print(evals)  # could be in a different order compared to MATLAB output...

        # compute the norm of each eigenvector
        mag_v1 = np.sqrt(np.sum(np.square(evecs[:, 0])))
        mag_v2 = np.sqrt(np.sum(np.square(evecs[:, 1])))
        print(round(mag_v1), round(mag_v2))

        # plot
        plt.plot([0, evecs[0, 0]], [0, evecs[1, 0]], "r", label="v1")
        plt.plot([0, evecs[0, 1]], [0, evecs[1, 1]], "k", label="v2")

        plt.axis((-1, 1, -1, 1))
        plt.legend()
        plt.show()


def _basic_diagonalization():
    ## eigendecomposition of A and A^N

    # make a symmetric matrix
    A = np.round(10 * np.random.randn(4, 4))
    A = A.T @ A

    # eigendecomposition
    evals, evecs = np.linalg.eig(A)

    # test reconstruction
    Ap = evecs @ np.diag(evals) @ np.linalg.inv(evecs)

    # plot
    plt.subplot(121)
    plt.imshow(A)
    plt.axis("off")
    plt.title("A")

    plt.subplot(122)
    plt.imshow(Ap)
    plt.axis("off")
    plt.title("$V\Lambda V^{-1}$")

    plt.show()

    # subtract the two (should be zero with rounding errors)
    recondiff = A - Ap

    # reconstruction error (due to inverse numerical inaccuracies)
    rmsA = np.sqrt(np.square(np.mean(np.reshape(recondiff, (1, -1)))))
    print("Reconstruction RMS:", rmsA)

    def _diagonalization_vis_example():
        # diagonalization in images
        # # A = P @ D @ inv(P)
        # A is a matrix like At @ A
        # P is a matrix with eigenvectors as columns
        # D is the diagonal matrix with eigenvalues along the diagonal
        # A = V @ Lambda @ inv(V)

        # A matrix
        A = np.random.randn(10, 10)
        A = A.T @ A

        # eigendecomposition
        D, V = np.linalg.eig(A)

        # show the results
        plt.subplot(141)
        plt.imshow(A)
        plt.title("A")
        plt.axis("off")

        plt.subplot(142)
        plt.imshow(V)
        plt.title("V")
        plt.axis("off")

        plt.subplot(143)
        plt.imshow(np.diag(D))
        plt.title("$Lambda$")
        plt.axis("off")

        plt.subplot(144)
        plt.imshow(np.linalg.inv(V))
        plt.title("$V^{-1}$")
        plt.axis("off")

        plt.show()

    def _basic_matrix_powers_via_diagonalization():
        # # matrix powers via diagonalization
        # A = P @ D @ inv(P)
        # A^n = P @ (D^n) @ inv(P)
        # D^n -- each diagonal element to the power of n

        ## matrix powers

        A = np.random.rand(2, 2)

        # compute matrix power directly
        print(np.linalg.matrix_power(A, 3))  # A*A*A

        # and via eigendecomposition
        D, V = np.linalg.eig(A)
        D = np.diag(D)

        # reproduce via diagonalization
        print(V @ np.linalg.matrix_power(D, 3) @ np.linalg.inv(V))

    def _basic_eigenvalues_of_related_symmetric_matrices():
        # eigenvalues of A and A^3 (pt1)
        # A is a matrix like At @ A

        # create a symmetric matrix
        A_raw = np.random.rand(3, 3)  # create square matrix
        A = A_raw @ A_raw.T  # contrived symmetric matrix

        D, V = np.linalg.eig(A)
        D3, V3 = np.linalg.eig(A @ A @ A)

        print(V, V3, sep="\n\n")

        plt.subplot(221)
        plt.imshow(V)
        plt.axis("off")
        plt.title("evecs of A")

        plt.subplot(223)
        plt.imshow(V3)
        plt.axis("off")
        plt.title("evecs of A^3")

        plt.show()

        # eigenvalues of A and A^3 (pt2)

        ## plot the eigenvectors and eigenvalues

        fig = plt.figure()
        ax = cast(Axes3D, fig.add_subplot(projection="3d"))

        # plot eigenvectors of A
        ax.plot([0, V[0, 0]], [0, V[1, 0]], [0, V[2, 0]], "r")
        ax.plot([0, V[0, 1]], [0, V[1, 1]], [0, V[2, 1]], "k")
        ax.plot([0, V[0, 2]], [0, V[1, 2]], [0, V[2, 2]], "b")

        # plot eigenvectors of A^3
        ax.plot([0, V3[0, 0]], [0, V3[1, 0]], [0, V3[2, 0]], "r--")
        ax.plot([0, V3[0, 1]], [0, V3[1, 1]], [0, V3[2, 1]], "k--")
        ax.plot([0, V3[0, 2]], [0, V3[1, 2]], [0, V3[2, 2]], "b--")

        plt.show()

        ## show the eigenvalues
        plt.plot([1, 2, 3], D, "bs-", label="A")
        plt.plot([1.1, 2.1, 3.1], D3, "rs-", label="A^3")
        plt.title("Eigenvalues")
        plt.legend()
        plt.show()

    def _eigenvectors_for_repeated_eigenvalues():
        # eigenvectors for repeated eigenvalues (functions)

        # this code is copy-pasted with some light editing from:
        # https://stackoverflow.com/questions/3461869/plot-a-plane-based-on-a-normal-vector-and-a-point-in-matlab-or-matplotlib

        def _plot_vector(fig, orig, v, color="blue"):
            ax = cast(Axes3D, fig.add_subplot(projection="3d"))
            orig = np.array(orig)
            v = np.array(v)
            ax.quiver(orig[0], orig[1], orig[2], v[0], v[1], v[2], color=color)
            ax.set_xlim(0, 10)
            ax.set_ylim(0, 10)
            ax.set_zlim(0, 10)
            ax = cast(Axes3D, fig.add_subplot(projection="3d"))
            return fig

        def rotation_matrix(d):
            sin_angle = np.linalg.norm(d)
            if sin_angle == 0:
                return np.identity(3)
            d /= sin_angle
            eye = np.eye(3)
            ddt = np.outer(d, d)
            skew = np.array(
                [[0, d[2], -d[1]], [-d[2], 0, d[0]], [d[1], -d[0], 0]], dtype=np.float64
            )

            M = ddt + np.sqrt(1 - sin_angle**2) * (eye - ddt) + sin_angle * skew
            return M

        def pathpatch_2d_to_3d(pathpatch: PathPatch, z, normal):
            if isinstance(normal, str):  # Translate strings to normal vectors
                index = "xyz".index(normal)
                normal = np.roll((1.0, 0, 0), index)

            normal /= np.linalg.norm(normal)  # Make sure the vector is normalised
            path = pathpatch.get_path()  # Get the path and the associated transform
            trans = pathpatch.get_patch_transform()

            path = trans.transform_path(path)  # Apply the transform

            pathpatch.__class__ = art3d.PathPatch3D  # Change the class
            pathpatch._code3d = path.codes  # Copy the codes
            pathpatch._facecolor3d = pathpatch.get_facecolor  # Get the face color

            verts = path.vertices  # Get the vertices in 2D

            d = np.cross(normal, (0, 0, 1))  # Obtain the rotation vector
            M = rotation_matrix(d)  # Get the rotation matrix

            pathpatch._segment3d = np.array(
                [np.dot(M, (x, y, 0)) + (0, 0, z) for x, y in verts]
            )

        def pathpatch_translate(pathpatch, delta):
            pathpatch._segment3d += delta

        def plot_plane(ax, point, normal, size=10, color="g"):
            p = Circle((0, 0), size, facecolor=color, alpha=0.8)
            ax.add_patch(p)
            pathpatch_2d_to_3d(p, z=0, normal=normal)
            pathpatch_translate(p, (point[0], point[1], point[2]))

        o = np.array([5, 5, 5])
        v = np.array([3, 3, 3])
        n = [0.5, 0.5, 0.5]

        # eigenvectors for repeated eigenvalues

        # NOTE: RUN PREVIOUS CELL FIRST

        # a matrix
        A = [[5, -1, 0], [-1, 5, 0], [1 / 3, -1 / 3, 4]]

        # its eigendecomposition
        D, V = np.linalg.eig(A)

        # sort eigenvalues
        i = np.argsort(D)
        D = D[i]
        V = V[:, i]

        ## plot eigenvectors
        fig = plt.figure()
        ax = cast(Axes3D, fig.add_subplot(projection="3d"))

        # plot eigenvectors of A
        ax.plot(
            [0, V[0, 0]],
            [0, V[1, 0]],
            [0, V[2, 0]],
            "r",
            label="v_1 ($lambda$=%g)" % D[0],
        )
        ax.plot(
            [0, V[0, 1]],
            [0, V[1, 1]],
            [0, V[2, 1]],
            "k",
            label="v_2 ($lambda$=%g)" % D[1],
        )
        ax.plot(
            [0, V[0, 2]],
            [0, V[1, 2]],
            [0, V[2, 2]],
            "b",
            label="v_3 ($lambda$=%g)" % D[2],
        )
        plt.legend()

        # plot subspace spanned by same-eigenvalued eigenvectors
        plot_plane(ax, V[:, 0], V[:, 1], size=3)
        ax.set_xlim3d(-1, 1)
        ax.set_ylim3d(-1, 1)
        ax.set_zlim3d(-1, 1)

        plt.show()

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
