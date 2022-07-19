# Linear algebra (mat)

## Types

- scalar: 1 * 1 (α, β, λ (regular))
- vector: 1 * n (v, u, w (bold))
- matrix: n * n (A, M, C (bold))

## Vector

- vector: ordered list of numbers
  - column vector: vertical list
  - row vector: horizontal list
- element: each item in a vector
- dimensionality: number of elements in a vector

- what defines a vector geometrically is the length and direction (start to end)
  - vectors can be geometrically equal but can have different locations
- vectors are geometrically robust to translation (or rigid body motion)
- standard position -- when a vector starts at the origin

- tail: start point
- head: end point

- vector length
  - v_length = sqrt(dot(vt,v))
- normalized vector (unit length)
  - v_norm = v / v_length

### Operations

- algebraic addition
  - add corresponding elements (v1[0] + v2[0] = v3[0])
  - vectors must have same dimensions (same number of elements)

- geometric addition
  - put tail of one vector to the head of the other
  - draw a vector that connects the tail of the first and the head of the second

- algebraic subtraction
  - minuend -- first argument
  - subtrahend -- second argument (the number being taken away)
  - negative addition -- make the subtrahend negative and add the vectors

- geometric subtraction
  - make subtrahend negative
  - do same process as geometric addition

- geometric subtraction (v2)
  - draw both vectors in standard position
  - draw vector from subtrahend head to minuend head
  - this gives you the dimensions of the difference vector

- vector-scalar multiplication
  - multiply each vector element by the scalar.
  - positive scalar -- same direction, negative scalar -- opposite direction
  - abs(λ) > 1 -- gets longer, 0 < abs(λ) < 1 -- vector shrinks
  - all vectors that can be produced by scalar multiplication of a vector occupy
    the same subspace

- vector product
  - dot product: `at @ b`
    - (1 x m) * (n x 1) produces 1x1 matrix
    - only works if m == n
  - outer product: `a @ bt`
    - (m x 1) * (1 x n) produces m x n matrix

- vector-vector multiplication (vector dot product)
  - the result of the dot product is a scalar
  - `sum ( v1[i] * v2[i] )`
    - the sum of the product of each associated element
  - vectors need to have the same dimensions
  - 'a transpose b' assumes they are both column vectors

- vector dot product (geometric perspective)
  - dot_product = magnitude_a * magnitude_b * cos(angle_between)
    - angle_between = arccos(dot_product / (magnitude_a * magnitude_b))
    - cos(angle_between):
      - positive if angle_between < 90
      - negative if angle_between > 90
      - 0 if angle_between == 90 (orthogonal)
      - 1 if angle_between == 0
      - -1 if angle_between == 180
    - law of cosines
      - length_c^2 = length_a^2 + length_b^2 - (2 * at * b)
      - length_c^2 = length_a^2 + length_b^2 - (2 * length_a * length_b *
        cos(angle_between))
      - length_c^2 = (at * a) + (bt * b) - (2 * at * b)
    - things to keep in mind about law of cosines
      - last term is 0 when orthogonal
      - at * b = cos(angle_between) * length_a * length_b
    - at * b = cos(angle_between) * length_a * length_b

- vector hadamard multiplication
  - element-wise multiplication
  - produces vector
  - must be same length

- vector cross product
  - produces vector that is orthogonal to both vectors
  - cross(a, b):
    `a_length * b_length * sin(angle_between) * orthogonal_unit_vector`

## Matrix

- sizing
  - MxN -- M rows, N cols

- indexing
  - Aij
    - A: matrix
    - i: row index
    - j: col index

- diagonal elements
  - elements along the diagonal (from top left to bottom right)
  - for non-square, all elements aij where i=j

- transpose
  - flip elements over diagonal

- trace
  - sum of diagonal elements
  - only exists for square
  - trace(A1 + A2) == trace(A1) + trace(A2)

- kronecker delta -- 0 if i != j, 1 if i = j

- common types of matrices
  - square: MxM
  - rectangle: MxN
  - symmetric: A == At
  - skew symmetric: -A == At, matrix Aij where 0 if i == j
    - ie: negative if transposed, diagonal must be 0
  - diagonal: matrix Aij where ci * kronecker_delta
    - ie: non-zero only on diagonal
  - identity matrix: 1 if diagonal, else 0
    - a type of diagonal matrix
  - triangular
    - upper: matrix Aij == 0 if i > j
    - lower: matrix Aij == 0 if i < j
  - concatenated (augmented): -- matrix A3 where (A1 concatenated with A2) == A3
    - A1 and A2 must have same row count.
    - separator (vertical line) drawn to preserve separate identities.
      - eg: [A | B]
    - https://en.wikipedia.org/wiki/Augmented_matrix

### Operations

- matrix addition and subtraction
  - A1 and A2 must have same diensions to add/subract
  - to add/sucbract, do element-wise operation.
  - commutative (can switch the order)
  - associative (grouping quantities does not affect the result)

- shifting a matrix
  - A + I * scalar

- matrix scalar multiplication
  - multiply each element by scalar
  - commutative
    - A1 * s * A2 = scalar * A1 * A2 = A1 * A2 * s
  - s * (A1 + A2) = s * A1 + s * A2

- matrix multiplication and dims
  - standard matrix multiplication (matmul in python: `@`)
  - A1 left-multiples A2
    - not commutative (A1@A2 != A2@A1)
  - for two matrices with dimensions m x n, `A1[n]` must equal `A2[m]`
    - ie: inner dimensions must match
    - eg: (4 x 2) and (2 x 5)
  - multipy a tall/wide matrix by itself
    - At @ A and A @ At
      - these produce matrices with different dimensions
      - used in left-inverse and right-inverse
  - matrix multiplication with a diagonal matrix
    - A @ D --> modulate columns of A
    - D @ A --> modulate rows of A

- order and grouping
  - transpose: (ABCD)t = Dt @ Ct @ Bt @ At
  - inverse: inv(ABCD) = inv(D) @ inv(C) @ inv(B) @ inv(A)
    - not all matrices have an inverse

- symmetric matrices
  - additive symmetric matrix
    - (A + At)/2
    - A must be square
  - multiplicative symmetric matrix
    - left
      - At @ A
      - (n x m) (m x n) produces (n x n)
    - right
      - S = A @ At
      - (m x n) (n x m) produces (m x m)

- diagonal operations
  - diagonal matrix multiplication
    - for diagonal matrices, standard multiplication and hadamard multiplication
      yield the same results.
  - diagonal matrix inverse
    - the inverse of a diagonal matrix is just the diagonal matrix with the
      non-zero elements inverted.

- frobenius dot-product (two matrices must have same dims)
  - method 1
    - element-wise multiplication
    - sum all elements
  - method 2
    - vectorize both matrices (concat columns together -> single column vector)
    - compute vector dot product
  - method 3 (best)
    - product = trace( At @ B )

- frobenius norm (euclidean norm)
  - square root of frobenius dot product (of matrix with itself)
  - norm(A) = sqrt(trace(At @ A))

- matrix division
  - hadamard division (element-wise division)
  - for matrices A and B: A * inv(B)
    - not all matrices have inverses

## TODO

- rank
- space
- systems of equations
- determinant
- inverse
- least squares
- decomposition
  - QR
  - eigendecomposition / diagonalization
  - SVD
  - GSVD
- pseudoinveerse
- PCA

## Resources

- vectors/matrices
  - https://courses.lumenlearning.com/boundless-algebra/chapter/introduction-to-matrices/
  - https://web.stanford.edu/class/nbio228-01/handouts/Ch4_Linear_Algebra.pdf
  - https://math.boisestate.edu/~wright/courses/m565/LABackground.pdf

- linear algebra review
  - http://cseweb.ucsd.edu/classes/wi05/cse252a/linear_algebra_review.pdf
  - https://minireference.com/static/tutorials/linear_algebra_in_4_pages.pdf
  - http://cs229.stanford.edu/section/cs229-linalg.pdfv
  - http://www.cs.toronto.edu/~bonner/courses/2016s/csc321/readings/optional/la.pdf

- symbols
  - https://en.wikipedia.org/wiki/List_of_mathematical_symbols_by_subject#Linear_algebra_and_geometry

- greek alphabet
  - https://www.rapidtables.com/math/symbols/greek_alphabet.html

- matrix multiplication
  - https://en.wikipedia.org/wiki/Matrix_multiplication#Illustration

- cross product of vectors
  - https://en.wikipedia.org/wiki/Cross_product
  - https://betterexplained.com/articles/cross-product/

- "@" infix operator
  - https://docs.scipy.org/doc/numpy/reference/generated/numpy.matmul.html#numpy.matmul

- reduced row echelon form (rref) (gaussian elimination)
  - http://www.math.jhu.edu/~bernstein/math201/RREF.pdf
  - https://stattrek.com/matrix-algebra/echelon-transform.aspx
  - https://newonlinecourses.science.psu.edu/statprogram/reviews/matrix-algebra/gauss-jordan-elimination

- solve system of equations (using inverse)
  - https://courses.lumenlearning.com/boundless-algebra/chapter/using-matrices-to-solve-systems-of-equations/

- orthogonality
  - http://www.math.harvard.edu/~knill/teaching/math19b_2011/handouts/lecture17.pdf

- properties of determinants (shortcuts)
  - https://www.math10.com/en/algebra/matrices/determinant.html

- determinant (4x4)
  - https://en.wikipedia.org/wiki/Laplace_expansion#Laplace_expansion_of_a_determinant_by_complementary_minors
  - http://mathcentral.uregina.ca/QQ/database/QQ.09.07/h/rav1.html
  - https://www.geometrictools.com/Documentation/LaplaceExpansionTheorem.pdf
  - http://pi.math.cornell.edu/~andreim/Lec16.pdf

- laplace expansion (cofactor expansion)
  - https://en.wikipedia.org/wiki/Laplace_expansion
  - https://textbooks.math.gatech.edu/ila/determinants-cofactors.html
  - https://en.wikibooks.org/wiki/Linear_Algebra/Laplace%27s_Expansion
  - http://calvino.polito.it/~adiscala/didattica/Lingotto/2009/English/Lectures/EN-LeLing12.pdf

- inverse using cofactors
  - https://math.vanderbilt.edu/rolenl/LinearAlgebraNotes10.pdf

- eigenvectors, eigenvalues, eigen decomposition
  - http://mathworld.wolfram.com/Eigenvector.html
  - http://mathworld.wolfram.com/EigenDecomposition.html
  - http://mathworld.wolfram.com/Eigenvalue.html

- calculating eigenvectors & eigenvalues
  - http://homepages.ed.ac.uk/hopkinse/eigen
  - https://www.adelaide.edu.au/mathslearning/play/seminars/evalue-magic-tricks-handout.pdf
  - https://math.mit.edu/~gs/linearalgebra/ila0601.pdf
  - https://lpsa.swarthmore.edu/MtrxVibe/EigMat/MatrixEigen.html
  - https://personal.utdallas.edu/~herve/Abdi-EVD2007-pretty.pdf
  - https://math.mit.edu/~gs/linearalgebra/ila0601.pdf
  - http://www.sosmath.com/matrix/eigen2/eigen2.html
  - https://www.scss.tcd.ie/Rozenn.Dahyot/CS1BA1/SolutionEigen.pdf
  - http://wwwf.imperial.ac.uk/metric/metric_public/matrices/eigenvalues_and_eigenvectors/eigenvalues2.html

- diagonalization
  - https://yutsumura.com/how-to-diagonalize-a-matrix-step-by-step-explanation/
  - http://mathworld.wolfram.com/MatrixDiagonalization.html
  - http://mathworld.wolfram.com/DiagonalMatrix.html
  - http://mathworld.wolfram.com/DiagonalizableMatrix.html
  - https://math.stackexchange.com/questions/1064229/how-to-diagonalize-this-matrix/1064245
  - https://math.okstate.edu/people/binegar/3013-S99/3013-l16.pdf
  - https://en.wikipedia.org/wiki/Diagonalizable_matrix

- singular value decomposition (SVD)
  - https://pdfs.semanticscholar.org/62d0/2af1b4105fbb527d6509c1356e553781aa06.pdf
  - http://www.d.umn.edu/~mhampton/m4326svd_example.pdf
  - https://en.wikipedia.org/wiki/Singular_value_decomposition
  - http://www.sci.utah.edu/~gerig/CS6640-F2012/Materials/pseudoinverse-cis61009sl10.pdf
  - https://www.cs.cmu.edu/~venkatg/teaching/CStheory-infoage/book-chapter-4.pdf
  - http://web.mit.edu/be.400/www/SVD/Singular_Value_Decomposition.htm

- pseudo-inverse
  - https://www.cs.bgu.ac.il/~na181/wiki.files/SVD_application_paper[1].pdf
  - https://pdfs.semanticscholar.org/62d0/2af1b4105fbb527d6509c1356e553781aa06.pdf
  - http://www.sci.utah.edu/~gerig/CS6640-F2012/Materials/pseudoinverse-cis61009sl10.pdf
  - https://help.matheass.eu/en/Pseudoinverse.html
  - https://www.johndcook.com/blog/2018/05/05/svd/
  - http://www.sci.utah.edu/~gerig/CS6640-F2012/Materials/pseudoinverse-cis61009sl10.pdf
  - https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse
  - https://math.stackexchange.com/questions/2624440/how-to-find-moore-penrose-inverse

- QR decomposition (QR factorization) (Gram-Schmidt algorithm)
  - http://www.cs.nthu.edu.tw/~cherung/teaching/2008cs3331/chap4%20example.pdf
  - http://www.math.drexel.edu/~foucart/TeachingFiles/F12/M504Lect3.pdf
  - https://www.math.ucla.edu/~yanovsky/Teaching/Math151B/handouts/GramSchmidt.pdf
  - http://www.seas.ucla.edu/~vandenbe/133A/lectures/qr.pdf
  - https://en.wikipedia.org/wiki/QR_decomposition
  - http://ee263.stanford.edu/lectures/qr.pdf

- LU decomposition (gauss elimination)
  - http://www.math.iit.edu/~fass/477577_Chapter_7.pdf
  - http://www.ohiouniversityfaculty.com/youngt/IntNumMeth/lecture12.pdf
  - http://mathonline.wikidot.com/the-lu-decomposition-of-a-matrix
  - http://mathonline.wikidot.com/the-lu-decomposition-of-a-matrix-examples-1
  - https://math.libretexts.org/Special:Search?qid=&fpid=230&fpth=&path=&q=lu+qr
  - http://mathworld.wolfram.com/GaussianElimination.html
  - https://en.wikipedia.org/wiki/LU_decomposition
  - https://www.geeksforgeeks.org/l-u-decomposition-system-linear-equations/
  - http://mathworld.wolfram.com/LUDecomposition.html

- quadratic form
  - https://see.stanford.edu/materials/lsoeldsee263/15-symm.pdf
  - http://www2.econ.iastate.edu/classes/econ501/Hallam/documents/Quad_Forms_000.pdf
  - http://www.columbia.edu/~md3405/Linear%20Algebra.pdf

- principle component analysis (PCA)
  - http://www.math.union.edu/~jaureguj/PCA.pdf

- fourier transform
  - https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/
