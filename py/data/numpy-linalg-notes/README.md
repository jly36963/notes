# Linear Algebra / Numpy Notes

## Linear algebra

- linear algebra: the branch of math concerned with vectors/matrices
  - important for computing, statistics, data science, and graphics
  - linear algebra: focus on theory and proofs
  - matrix algebra: focus on practical application
- vector: ordered list of numbers
- matrix: 'spreadsheet' of numbers

## Dimensionality

- scalar: `1 * 1 (α, β, λ (regular))`
- vector: `1 * n (v, u, w (bold))`
- matrix: `n * n (A, M, C (bold))`

## Vectors

### Vector terminology

- vector: ordered list of numbers
  - column vector: vertical list
  - row vectors: horizontal list
- element: each item in a vector
- dimensionality: number of elements in a vector

- what defines a vector geometrically is the length and direction (start to end)
  - vectors can be geometrically equal but can have different locations
- vectors are geometrically robust to translation (or rigid body motion)
- standard position: when a vector starts at the origin

- head: start point
- tail: end point

### Vectors addition/subtraction

- algebraic addition
  - add corresponding elements (`v1[0] + v2[0] = v3[0]`)
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

### Vector multiplication (scalar)

- multiply each vector element by the scalar.
  - positive scalar : same direction,
  - negative scalar : opposite direction
  - `abs(λ) > 1` : gets longer,`
  - 0 < abs(λ) < 1` : vector shrinks
- all vectors that can be produced by scalar multiplication of a vector occupy the same subspace

### Vector multiplication (vector)

- dot product
- vectors need to have the same dimensions
- the result of the dot product is a scalar
- `sum v1[i]*v2[i]`
- the sum of the product of each associated element
- 'a transpose b' assumes they are both column vectors

### Vector dot product (geometric perspective)

- vector dot product produces single value
  - dot_product = `magnitude_a * magnitude_b * cos(angle_between)`
  - angle_between = `arccos(dot_product / (magnitude_a * magnitude_b))`
- cos(angle_between):
  - positive if `angle_between < 90`
  - negative if `angle_between > 90`
  - 0 if `angle_between == 90` (orthogonal)
  - 1 if `angle_between == 0`
  - -1 if `angle_between == 180`
- law of cosines
  - `length_c^2 = length_a^2 + length_b^2 - (2 * at * b)`
  - `length_c^2 = length_a^2 + length_b^2 - (2 * length_a * length_b * cos(angle_between))`
  - `length_c^2 = (at * a) + (bt * b) - (2 * at * b)`
  - things to keep in mind about law of cosines
    - last term is 0 when orthogonal
    - `at * b = cos(angle_between) * length_a * length_b`
- `at * b = cos(angle_between) * length_a * length_b`

### Vector outer product

- dimensions:dv
  - `dot product = at * b`
    - `(1 x m) * (n x 1)` produces 1x1 matrix
    - only works if `m == n`
  - `outer product = a * bt`
    - `(m x 1) * (1 x n)` produces m x n matrix
- `np.outer(v1,v2)`
- `v1 @ v2.T`

### Vector cross product (3d vectors)

- produces vector that is orthogonal to both vectors
- method 1
  - `a x b = length_a * length_b * sin(angle_between) * orthogonal_unit_vector`
- method 2
  - `cx = ay*bz - az*by`
  - `cy = az*bx - ax*bz`
  - `cz = ax*by - ay*bx`
- right hand rule
  - a: pointer
  - b: middle
  - c: thumb

### Hermitian transpose

- for vectors with only real numbers, hermitian transpose is the same as regular transpose.
- symbols
  - transpose: t
  - hermetian transpose: H or \*
- hermitian transpose:
  - transpose, flip sign of complex terms.
  - `(3 4i)` becomes `(3 -4i)`
- why we use conjugate:
  - `ztz = (3 4i)(3 4i) = -7 + 24i`
  - `zHz = (3 4i)(3 -4i) = 9 + 12i - 12i - 16i^2 = 9 + 16 = 25`

### Unit vector

- unit vector:
  - `scalar * length_v = 1`
  - `scalar = 1 / length_v`
  - zero vector has no unit vector (it lacks magnitude and direction)
  - for vector `[3 4]`, length = 5, mu = .2

### Dimensions and fields

- dimensions & fields
- fields
  - R: real numbers
  - Z: integers
  - C: complex numbers
- dimensions
  - `1,2,3,4,5, ... n`
- R2: 2 dimensional, real numbers
  - example: `[1 -2]`

### Subspaces

- subspaces:
  - subspace: a region of space that can be reached by any linear combination of the given vectors.
  - subspace (2): a vector space that is entirely contained within another vector space
  - hyperplane: a subspace whose dimension is one less than that of its ambient space
  - needs to include the origin
- subspace types:
  - ambient space (equal to the number of rows in a vector?),
    - R5: `[ 1 2 0 0 1 ]`
  - 0D (origin),
  - 1D (single vector),
  - 2D (plane created by two vectors that don't occupy the same vector subspace),
  - 3D,
  - 4D, ... nD
- subsets
  - a set of points that satisfies some condition(s)
  - doesn't need to include the origin, doesn't need to be closed, can have boundaries.

### Span

- span (for a set of vectors) -- all possible linear combinations of all vectors in that set
- example:
  - vectors v and scalars a
  - `span = (a1 * v1) + (a2 * v2) ... + (ai * vi)`
- a vector is in the span of a set if it can be expressed as a linear combination of vectors from that set
- example:
  - vector `[1 2 0]` is within set `{ [1 1 0 ], [1 7 0] }`
  - `[1 2 0] = a1 * [1 1 0] + a2 * [1 7 0]`
  - a1 = 5/6, a2 = 1/6

### Linear independence

- linear independence
  - a set is linearly dependent if:
    - a vector can be expressed by a linear combination of other rows.
    - eg: `[1 2 0] [2 4 0]`
    - eg: `[1 1 1] [1 2 3] [2 3 4]`
  - a set is linearly dependent if:
    - vectors `v` and scalars `a`
    - all `a` are real, and at least 1 `a` is non-zero
    - `a1*v1 + a2*v2 + ... an*vn = 0`
  - any set of `M > N` vectors in RN is dependent
  - any set of `M <= N` vectors in RN could be independent
- determine linear independence
  - count vectors, compare to dimensionality. (if there are more vectors than dimensions, it is dependent)
  - look at position of zeros (are any vectors all zeros?)
  - guess and test
  - matrix rank method (rank < number of vectors)
- rank: corresponds to the maximal number of linearly independent columns of A
- calculating rank:
  - reduce matrix to row echelon form (rref) using elementary row operations.
  - elementary row operations: row switching, row multiplication, row addition

### Basis (span and independence)

- standard basis vectors
  - R2: `[1 0] [0 1]`
  - R3: `[1 0 0] [0 1 0] [0 0 1]`
  - R4: `[1 0 0 0] [0 1 0 0] [0 0 1 0] [0 0 0 1]`
  - RN: `...`
  - unit length, mutually orthogonal (orthonormal)
- any point can be expressed by some unique linear combination of the vectors in its standard basis vectors

## Matrices

### Intro

- matrix notation
  - Matrix: A
  - element: a1,2 (subscripts: row, column)
- diagonal elements
  - elements along the diagonal (from top left to bottom right)
  - for non-square, all elements aij where i=j
- sizing
  - 4x3: 4 rows, 3 cols
- reference
  - MxN: M rows, N cols
- RMN does not equal RMxN
- tensors
  - MxNxN

### Common matrices

- square (MxM)
- rectangle (MxN)
- symmetric (A = At)
- skew symmetric (almost symmetric. diagonal must be zeros and -A = At)
- identity matrix (ones on the diagonal, zeros on non-diagonal elements)
- diagonal matrix (matrix Aij where `ci*kronecker_delta`)
  - kronecker delta: 0 if i !=j, 1 if i = j
- upper triangular (matrix Aij where 0 if i > j)
- lower triangular (matrix Aij where - if i < j)
- concatenated (augmented): matrix A3 where A1 concatenated with A2 = A3
  - A1 and A2 must have same row count.
  - separator (vertical line) drawn to preserve separate identities.
    - eg: `[A | B]`
  - [augmented matrix](https://en.wikipedia.org/wiki/Augmented_matrix)

### Matrix add/subtract

- matrix addition and subtraction
  - A1 and A2 must have same diensions to add/subract
  - to add/sucbract, do element-wise operation.
  - commutative (can switch the order)
  - associative (grouping quantities does not affect the result)
- shifting a matrix
  - A + I\*scalar

### Matrix-scalar multiplication

- multiply each element by scalar
- commutative
- `A1*scalar*A2 = scalar*A1*A2 = A1*A2*scalar`
- `scalar * (A1 + A2) = scalar*A1 + scalar*A2`

### Matrix transpose

- transposing a vector (or matrix) is to flip the elements around the diagonal
- transposing twice will return the original vector (or matrix)

### Diagonal and trace

- diagonal elements (matrix Aij) -- Aij where i = j
- `trace = sum of diagonal elements`
- `trace = sum of eigenvalues`
- trace only exists for square matrices
- `trace(A1 + A2) = trace(A1) + trace(A2)`

### matrix multiplication validity

- standard matrix multiplication (matmul in python)
- A1 left-multiples A2 (not commutative)
- not commutative (`A1@A2 != A2@A1`)
- for two matrices (m x n), `A1[n]` must equal `A2[m]`
  - inner dimensions must match; eg: (4 x 2) and (2 x 5)
- `AtA` and `AAt` are ways to multipy a tall/wide matrix by itself
  - used in left-inverse and right-inverse
  - `AtA` and `AAt` produce matrices with different dimensions

### Matrix multiplication with a diagonal matrix

- `A@D`: modulate columns of A
- `D@A`: modulate rows of A

Example1 (`A@D`):

- `A1 = [[1 2 3], [4 5 6], [7 8 9]]`
- `A2 = [[a 0 0], [0 b 0], [0 0 c]]`
- `A1 @ A2 = [[a1 b2 c3], [a4 b5 c6], [a7 b8 c9]]`

Example2 (`D@A`):

- `A1 = [[a 0 0], [0 b 0], [0 0 c]]`
- `A2 = [[1 2 3], [4 5 6], [7 8 9]]`
- `A1 @ A2 = [[a1 a2 a3], [b4 b5 b6], [c7 c8 c9]]`

### Order of operations

- order of operations (matrices)
  - reversing matrix order when applying operation to multiplied matrices
  - sometimes the operator is valid for the product matrix, but not valid on each individual matrix
- operations examples
  - transpose: `(ABCD)t = Dt @ Ct @ Bt @ At`
  - inverse: `inv(ABCD) = inv(D) @ inv(C) @ inv(B) @ inv(A)`
    - not all matrices have an inverse
- `@` operator
  - https://docs.scipy.org/doc/numpy/reference/generated/numpy.matmul.html#numpy.matmul
