
import matplotlib.pyplot as plt
import numpy as np


def basic_array_creation():
    # list to array
    list1 = [1, 2, 3, 4, 5]
    arr1 = np.array(list1)

    # array to list
    list1 = arr1.tolist()

    # multi-dimensional array
    list1 = [1, 2, 3, 4, 5]
    list2 = ['a', 'b', 'c', 'd', 'e']
    both_lists = [list1, list2]
    arr1 = np.array(both_lists)
    print(f'shape: {arr1.shape}')

    # array from range
    arr1 = np.arange(10)  # length
    arr1 = np.arange(0, 10)  # start, stop
    arr1 = np.arange(0, 10, 1)  # start, stop, step

    # copying arrays
    # if a slice of array is assigned to a variable,
    # the variable references a portion of the original array
    # if the new array is changed, so is the original array (same space in memory)

    # arr2 = arr1[:]  # don't do this
    _ = arr1.copy()  # do this


# ---
# quick array creation
# ---

def basic_array_generating():
    # 2d zeros array
    np.zeros((10, 10))  # 10x10 array of zeros

    # 2d ones array
    np.ones(5)  # array of ones (5 elements)
    np.ones((6, 8))  # array of ones (6 rows, 8 cols)

    # np.random.randn
    # 'standard normal' (gaussian) distribution, mean 0, variance 1 (values mostly around 0)
    np.random.randn()  # returns single float
    np.random.randn(10)  # array of 10 random numbers
    np.random.randn(2, 4)  # 2 rows, 4 cols
    3 * np.random.randn(2, 4) + 3  # each_element * 3 + 3

    # np.random.seed (same random values)
    np.random.seed(0)  # random values will be predictale
    np.random.randn(5)  # same values every time

    # np.random.rand
    # uniform distribution over [0,1)
    np.random.rand()  # single float
    np.random.rand(5)  # array of 5 values
    np.random.rand(2, 4)  # 2 rows, 4 cols

    # np.random.normal (like 'np.random.randn', but control over mu/sigma (mean/standdev))
    # draw random samples from a normal (Gaussian) distribution
    np.random.normal(loc=0.0, scale=1.0, size=(3, 3))

    # np.randint
    np.random.randint(low=0, high=1000, size=10)  # array of 10 random integers (0-999)
    np.random.randint(low=0, high=1000, size=(3, 3))  # 3x3 of random integers (0-999)

    # np.random.random
    np.random.random(size=(2, 4))  # rows:2, cols:4, values:random floats (0 <= n < 1)

    # np.random.uniform
    np.random.uniform(low=0, high=100, size=(5, 5))  # array, 5 rows, 5 cols, 0-99

    # np.linspace
    np.linspace(0, 11, 6)  # array of (6) evenly spaced values between 0 and 10

    # np.nan
    arr1 = np.ones(10)
    arr1[5] = np.nan  # change value to NaN

    # np.eye (identity matrix)
    np.eye(4)  # 4x4 array, mostly zeros, diagonal line of ones [[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]]


def basic_array_indexing():
    """
    Indexing, slicing, filtering (boolean indexing)
    """
    # indexing arrays
    arr1 = np.arange(0, 10)  # array([0,1,2,3,4,5,6,7,8,9])
    arr1[5]  # 5
    arr1[1:5]  # array([1,2,3,4])
    arr1[1:7:2]  # array([1,3,5])
    arr1[8:]  # array([8,9])
    arr1[:3]  # array([0,1,2,3])
    arr1[:] = 0  # array([0,0,0,0,0,0,0,0,0,0])

    # indexing 2d arrays
    arr_2d = np.array(([2, 4, 6], [8, 10, 12], [14, 16, 18]))
    arr_2d[1]  # array([8,10,12])
    arr_2d[1][0]  # 8

    # slice 2d arrays
    arr_2d = np.array(([2, 4, 6], [8, 10, 12], [14, 16, 18]))
    arr_2d[0:2, 1:3]  # array([[4,6],[10,12]]) (rows -- 0 & 1, columns 1 & 2)
    arr_2d[:2, 1:]  # array([[4,6],[10,12]])

    # filter array
    arr1 = np.arange(0, 100, 1).reshape(10, 10)
    arr1[arr1 > 50]  # return subset where condition is true

    # fancy indexing
    arr_2d = np.zeros((10, 10))
    arr_2d[[2, 4, 6, 8]]  # rows 2, 4, 6, 8 (excludes 0,1,3,5,7,9)
    arr_2d[[0, 1, 2, 9]]  # rows 0, 1, 2, 9
    arr_2d[[4, 3, 2, 1]]  # rows 4, 3, 2, 1


def basic_array_shaping():
    # array transposition
    arr = np.arange(50).reshape(10, 5)  # 0-49 (10 rows, 5 columns)
    arr1 = np.arange(100).reshape(10, 10)  # 0-99 (10r, 10c)
    arr1.T  # transpose rows/columns

    # swap axes
    arr = np.array([[1, 2, 3]])  # array([1,2,3])
    arr.swapaxes(0, 1)  # array([ [1],[2],[3] ])

    # 3d array (z,y,x)
    arr_3d = np.arange(60).reshape(5, 4, 3)  # 5 layers, 4 rows, 3 columns
    arr_3d.transpose((1, 0, 2))  # 4 layers, 5 rows, 3 columns

    # flatten
    arr_3d = np.arange(60).reshape(5, 4, 3)  # 5 layers, 4 rows, 3 columns
    arr1 = arr_3d.flatten()  # ndarray method (only works on ndarray)
    arr1 = arr_3d.ravel()  # library method (works on ndarrays and more (ie: list of ndarrays.))


def basic_array_methods():
    arr1 = np.arange(25).reshape(5, 5)  # 0-24 (5 rows, 5 columns)

    # math
    arr1.prod()  # prod
    arr1.prod(axis=0)  # prod along axis
    arr1.sum()  # sum
    arr1.sum(axis=0)  # sum along axis
    arr1.cumprod()  # list of cumulative products
    arr1.cumsum()  # list of cumulative sums

    # stats
    arr1.max()  # maximum
    arr1.max(axis=0)  # maximum along axis (2d array returns list)
    arr1.min()  # minimum
    arr1.min(axis=0)  # minimum along axis
    arr1.mean()  # mean
    arr1.mean(axis=0)  # mean along axis
    arr1.argmax()  # returns index of maximum value
    arr1.argmax(axis=0)  # returns index of maximum value along axis
    arr1.argmin()  # returns index of minimum value
    arr1.argmin(axis=0)  # returns index of minimum value along axis
    arr1.ptp()  # range (peak to peak) (min to max)
    arr1.ptp(axis=0)  # range along axis
    arr1.std()  # std: sqrt(mean(abs(arr1[i] - arr1.mean())**2)) / len(arr1)
    arr1.std(ddof=1)  # std: sqrt(mean(abs(arr1[i] - arr1.mean())**2)) / (len(arr1) - 1)
    arr1.std(axis=0)  # standard deviation (along axis)
    arr1.var()  # variance
    arr1.var(ddof=1)  # variance (n-1)
    arr1.var(axis=0)  # variance (along axis)
    np.median(arr1)  # median
    np.median(arr1, axis=0)  # median along axis

    # misc
    arr1.clip(min=5, max=20)  # values are clipped to interval edges (5,5,5,5,5,6,7,8, ...)
    arr1.sort()  # sort in-place

    # arrays with math operators
    arr1 = np.array([[1, 2, 3, 4], [5, 6, 7, 8]])
    arr1 + arr1  # array([2,4,6,8],[10,12,14,16])
    1 / arr1  # array([ 1, .5, .333, .25 ],[ .2, .166, .143, .125 ])
    arr1 ** 3  # array([1,8,27,64],[125,216,343,512])

    # 2d array (for loops)
    arr_2d = np.zeros((10, 10))
    arr_length = arr_2d.shape[1]  # 10L
    for i in range(arr_length):
        arr_2d[i] = 1  # change all values to 1
    for i in range(arr_length):
        arr_2d[i] = i  # change each row to [i,i,i,i,i,i,i,i,i,i]

    # dot product (2d -- matrix multiplication)
    arr = np.arange(25).reshape(5, 5)  # 0-24 (5 rows, 5 columns)
    np.dot(arr.T, arr)


def add_one(n):
    n = n + 1
    return n


def basic_vectorization():
    # array
    arr1 = np.arange(11)

    # vectorized function
    v_add_one = np.vectorize(add_one)
    # apply vectorized function to each element in array
    v_add_one(arr1)


def basic_ufunc():
    # unversal array (math ufunc)
    arr1 = np.arange(11)
    np.sqrt(arr1)  # square root (each element)
    np.square(arr1)  # square (each element)
    np.exp(arr1)  # e^element (each element)
    np.exp2(arr1)  # 2^element (each element)
    np.log(arr1)  # ln(element) (each element)
    np.log2(arr1)  # log base 2 (each element)
    np.log10(arr1)  # log base 10 (each element)
    np.positive(arr1)  # postive (each element)
    np.absolute(arr1)  # absolute value (each element)

    # trig ufunc
    np.deg2rad(arr1)  # degrees to radians (each element)
    np.rad2deg(arr1)  # radians to degrees (each element)
    np.sin(arr1)  # sin(element) (each element)
    np.cos(arr1)  # cos(element) (each element)
    np.tan(arr1)  # tan(element) (each element)
    np.arcsin(arr1)  # arcsin(element) (each element)
    np.arccos(arr1)  # arccos(element) (each element)
    np.arctan(arr1)  # arctan(element) (each element)

    # binary functions
    arr1 = np.arange(11)
    arr2 = np.arange(11)
    np.add(arr1, arr2)  # array([0,2,4,6,8,10,12,14,16,18])
    np.subtract(arr1, arr2)  # subtract arguments (element-wise)
    np.multiply(arr1, arr2)  # multiply arguments (element-wise)
    np.divide(arr1, arr2)  # divide arguments (element-wise)
    np.power(arr1, arr2)  # arr1^arr2 (element-wise)
    np.maximum(arr1, arr2)  # find maximum (element-wise)
    np.minimum(arr1, arr2)  # find minimum (element-wise)

    # comparison functions
    arr1 = np.arange(11)
    arr2 = np.arange(11)
    np.greater(arr1, arr2)  # elem1 > elem2 (element wise)
    np.greater_equal(arr1, arr2)  # elem1 >= elem2 (element wise)
    np.less(arr1, arr2)  # elem1 < elem2 (element wise)
    np.less_equal(arr1, arr2)  # elem1 <= elem2 (element wise)
    np.equal(arr1, arr2)  # elem1 == elem2 (element-wise)
    # logical functions
    np.logical_and()
    np.logical_or()
    np.logical_not()


# ---
# matplotlib example (meshgrid & pyplot(plt))
# ---

'''
# make matplotlib work in jupyter
%matplotlib inline
'''


def basic_array_matplotlib():
    # basics
    x = np.arange(0, 10)
    y = x**2
    plt.plot(x, y, '*')  # x axis, y axis, marker

    # manually control plot
    x = np.arange(0, 10)
    y = x**2
    plt.plot(x, y, '*')  # x axis, y axis, marker
    plt.xlim(0, 5)  # control axis bounds
    plt.ylim(0, 5)  # control axis bounds
    plt.title("my_title")
    plt.xlabel('x_label')
    plt.ylabel('y_label')

    # imshow example
    arr1 = np.arange(0, 100).reshape(10, 10)
    plt.imshow(arr1, cmap='BrBG')  # 'brown, blue, green' color ramp

    # imshow example 2
    arr1 = np.random.randint(0, 255).reshape(10, 10)
    plt.imshow(arr1, cmap='BrBG')
    plt.colorbar()  # show color bar (basically a legend)

    # more complicated example
    points = np.arange(-5, 5, 0.01)
    dx, dy = np.meshgrid(points, points)
    z = (np.sin(dx) + np.sin(dy))

    plt.imshow(z)
    plt.colorbar()
    plt.title('plot for sin(x) + sin(y)')


def basic_np_where():
    # list comprehension (without np.where)
    a = np.array([1, 2, 3, 4])
    b = np.array([100, 200, 300, 400])
    condition = np.array([True, True, False, False])
    answer = [(A_val if cond else B_val) for A_val, B_val, cond in zip(a, b, condition)]

    # list comprehension (with np.where)
    answer2 = np.where(condition, a, b)  # condition ? a : b (like js ternary operator)

    # np.where (example)
    arr1 = np.random.randn(5, 5)  # 5x5 matrix of random numbers
    arr2 = np.random.randn(5, 5)

    np.where(arr1 > 0, arr1, 0)  # if -- elem > 0 return elem, else -- return 0.
    np.where(arr1 > arr2, arr1, arr2)  # if elem1 > elem2, return elem1, else return elem2


def basic_array_stats():
    arr1 = np.arange(1, 10, 1).reshape(3, 3)  # 3x3 grid, 1-9
    arr1.sum()  # 45
    arr1.sum(0)  # array([12,15,18]) (sum columns)
    arr1.sum(1)  # array([6,15,24]) (sum rows)
    arr1.mean()  # 5.0
    arr1.mean(0)  # array([4,5,6]) (mean columns)
    arr1.mean(1)  # array([2,5,8]) (mean rows)
    np.median(arr1)  # 5
    np.median(arr1, 0)  # array([4,5,6])
    np.median(arr1, 1)  # array([2,5,8])

    # standard deviation
    # find mean
    # (each_elem - mean)^2
    # divide by n (number of inputs)
    # sqrt(new_mean)
    arr1.std()  # 2.582

    # variance
    # find mean
    # (each_elem - mean)^2
    # divide by n (number of inputs)
    arr1.var()  # 6.666667

    # any, all
    arr1 = np.arange(1, 10, 1).reshape(3, 3)
    mean = arr1.mean()
    arr1 = np.greater_equal(arr1, mean)  # elem >= 5 ? True : False
    arr1.any()  # true (are any values True)
    arr1.all()  # false (are all values True)

    # sort
    arr1 = np.random.rand(5)  # 5 random numbers
    arr1.sort()  # sort random numbers
    arr2 = np.random.randn(5, 5)  # 5x5 matrix of random numbers
    arr2.sort()  # sort random numbers (local to each row)
    arr3 = np.array(['f', 'g', 'a', 'b', 'c', 'd', 'e', 'a'])
    arr3.sort()  # alphabetical
    arr3 = np.unique(arr3)  # remove duplicates

    # membership testing
    arr1 = np.array(['f', 'g', 'a', 'b', 'c', 'd', 'e', 'a'])
    arr2 = np.array(['a', 'b', 'c', 'z'])
    np.in1d(arr2, arr1)  # array([ True, True, True, False ])

# ---
# Array I/O (READ/WRITE)
# ---


def basic_array_io():
    # save/load array
    arr = np.arange(1, 26, 1).reshape(5, 5)  # create
    np.save('my_array', arr)  # save
    arr = "I've been changed"
    arr = np.load('my_array.npy')  # load

    # zip multiple arrays
    arr1 = np.arange(1, 10, 1).reshape(3, 3)
    arr2 = np.arange(1, 17, 1).reshape(4, 4)
    np.savez('zip_array.npz', arr1=arr1, arr2=arr2)
    zip_arrays = np.load('zip_array.npz')
    zip_arrays['arr1']
    zip_arrays['arr2']

    # save/load text files
    arr = np.array([1, 2, 3], [4, 5, 6])
    np.savetxt('text_array.txt', arr, delimiter=',')
    text_arr = np.loadtxt('text_array.txt', delimiter=',')

    # array concatenation
    arr1 = np.arange(1, 26, 1).reshape(5, 5)
    arr2 = np.arange(26, 51, 1).reshape(5, 5)

    arr = np.concatenate([arr1, arr2], axis=0)  # 5 cols, 10 rows (more rows)
    arr = np.concatenate([arr1, arr2], axis=1)  # 10 cols, 5 rows (more columns)
