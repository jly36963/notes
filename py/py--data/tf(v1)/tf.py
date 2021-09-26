# ----------------
# tensorflow
# ----------------

# imports
import numpy as np
import pandas as pd
import tensorflow as tf
import matplotlib.pyplot as plt
%matplotlib inline
from sklearn.model_selection import train_test_split


# ----------------
# scikit-learn preprocessing
# ----------------

# imports
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# scale data set from 0 to 1
data = np.random.randint(0,100,(10,2)) # random integers (0-99), 10 rows, 2 cols
scaler_model = MinMaxScaler() # type -- sklearn.preprocessing.data.MinMaxScaler
scaler_model.fit(data)
scaler_model.transform(data) # divides each value in a column by the max (scale between 0 and 1)
# combine fit & transform
scaler_model.fit_transform(data)

# test/train split
from sklearn.model_selection import train_test_split
arr1 = np.random.randint(0,100,(50,4))
df1 = pd.DataFrame(data=arr1, columns=['f1', 'f2', 'f3', 'label']) # features & label columns
X = df1[['f1','f2','f3']] # features
y = df1['label'] # label
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
X_train.shape # (35, 3)
X_test.shape # (15, 3)

# ----------------
# basic syntax
# ----------------

import tensorflow as tf

t1 = tf.constant(2)
t2 = tf.constant(3)
a = t1 + t2
type(t1) # tensorflow.python.framework.ops.Tensor
print(t1) # prints tensor (symbolic handle, not evaluated value)
with tf.Session() as sess:
    result = sess.run(a) 
print(result) # prints graph evaluation

# interactive session (keeps open, useful in jupyter notebooks)
sess = tf.InteractiveSession()

# fill, zeros, ones, random
mat1 = tf.fill(dims=(4,4),value=1) # 4 rows, 4 cols, fill_value 1 
mat2 = tf.zeros((4,4)) # 4 rows, 4 cols, fill value 0
mat3 = tf.ones((4,4)) # 4 rows, 4 cols, fill value 1
mat4 = tf.random_normal(shape=(4,4), mean=0.0, stddev=1.0) # normal distribution
mat5 = tf.random_uniform(shape=(4,4), minval=0, maxval=1) # uniform distribution
# run all 
my_ops = [mat1, mat2, mat3, mat4, mat5]
with tf.Session() as sess:
    for op in my_ops:
        print(sess.run(op))
        print('\n')

# matrix multiplication
mat1 = tf.constant([[1,2],[3,4]])
print(mat1.get_shape()) # TensorShape([Dimension(2), Dimension(2)])
mat2 = tf.constant([[10], [100]])
print(mat2.get_shape()) # TensorShape([Dimension(2), Dimension(1)])
# execute (v1)
with tf.Session() as sess:
    result = tf.matmul(mat1, mat2)
print(result)
# execute (v2)
result = tf.matmul(mat1, mat2)
print(result.eval())

# ----------------
# graphs
# ----------------

# construct graph
n1 = tf.constant(1)
n2 = tf.constant(2)
n3 = n1 + n2
# execute graph
with tf.Session() as sess:
    result = sess.run(n3)
print(result)

# default graph
graph_one = tf.get_default_graph()
graph_two = tf.Graph()
print(graph_one) # default graph
print(graph_two) # not default graph
# set default graph
with graph_two.as_default():
    print(graph_two is tf.get_default_graph()) # True

# ----------------
# variables and placeholders
# ----------------

# variables
sess = tf.InteractiveSession() # initialize session
mat1 = tf.random_uniform((4,4),0,1) # matrix
var1 = tf.Variable(initial_value=mat1) # variable
print(var1) # tf.Variable object
init = tf.global_variables_initializer() # initialize variable
sess.run(init) # execute initialization
sess.run(var1) # execute graph (variables must be initialized before graph execution)

# placeholders
input1 = tf.placeholder(tf.float32)
input2 = tf.placeholder(tf.float32)
output = tf.mul(input1, input2)
with tf.Session() as sess:
    result = sess.run([output], feed_dict={input1:[7.], input2:[2.]})
print(result) # [array([14.], dtype=float32)]

# ----------------
# neural network (example 1) (operations)
# ----------------

import numpy as np
import tensorflow as tf
# set seeds
np.random.seed(101)
tf.set_random_seed(101)
# arrays
arr1 = np.random.uniform(0,100,(5,5)) # array, 5 rows, 5 cols, 0-99
arr2 = np.random.uniform(0,100,(5,1)) # array, 5 rows, 1 col, 0-99
# placeholders
input1 = tf.placeholder(tf.float32)
input2 = tf.placeholder(tf.float32)
# operations ('tf.add(a,b)' or 'a + b')
op1 = input1 + input2
op2 = input1 * input2
with tf.Session() as sess:
    result1 = sess.run(op1, feed_dict={input1:6,input2:8}) # 14
    result2 = sess.run(op2, feed_dict={input1:6,input2:8}) # 48
    result1 = sess.run(op1, feed_dict={input1:arr1,input2:arr2}) # 
    result2 = sess.run(op2, feed_dict={input1:arr1,input2:arr2}) # 

# ----------------
# neural network (example 2) (operations and activation functions)
# ----------------

n_features = 10
n_dense_neurons = 3
# variables/placeholders
x = tf.placeholder(tf.float32,(None,n_features)) # shape: unknown rows, 10 cols
W = tf.Variable(tf.random_normal([n_features,n_dense_neurons]))
b = tf.Variable(tf.ones([n_dense_neurons]))
# operations
xW = tf.matmul(x,W)
z = tf.add(xW,b)
# activation functions
a = tf.tanh(z) # tanh activation function
a = tf.nn.relu(z) # relu activation function (rectified linear unit)
a = tf.sigmoid(z) # sigmoid activation function
# initialize variables and session
init = tf.global_variables_initializer()
with tf.Session() as sess:
    sess.run(init)
    layer_out = sess.run(a, feed_dict={x:np.random.random([1,n_features])})

# ----------------
# neural network (example 3) (operations, activation, cost, optimize)
# ----------------

# arrays = evenly spaced points + noise
x_data = np.linspace(0,10,10) + np.random.uniform(-1.5, 1.5, 10)
y_label = np.linspace(0,10,10) + np.random.uniform(-1.5, 1.5, 10)
plt.plot(x_data, y_label, '*')
# y = mx + b
r1, r2 = np.random.randn(2)
m = tf.Variable(r1)
b = tf.Variable(r2)
# cost
    # y-hat: symbol that represents predicted equation for (best-fit) line in linear regression
    # y - y-hat: find the difference between y (point) and y-hat.
error = 0
for x,y in zip(x_data,y_label):
    y_hat = m*x + b
    error = error + (y - y_hat)** # squared difference of y: punishes higher errors
# optimize (gradient descent)
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.001)
train = optimizer.minimize(error)
# execute (train)
init = tf.global_variables_initializer()
with tf.Session() as sess:
    sess.run(init) # initialize variables
    training_steps = 100
    for i in range(training_steps):
        sess.run(train)
    m2, b2 = sess.run([m,b])
# test
x_test = np.linspace(-1,11, 10)
y_pred_plot = m2*x_test + b2
plt.plot(x_test, y_pred_plot, 'r') # y-hat line (prediction)
plt.plot(x_data, y_label, '*') # data points (actual)


# ----------------
# neural network (example 4) (linear regression)
# ----------------

import numpy as np
import pandas as pd
import tensorflow as tf
import matplotlib.pyplot as plt
%matplotlib inline
# create x and y data for points
x_data = np.linspace(0.0, 10.0, 10000)
noise = np.random.randn(len(x_data))
y_actual = (0.5 * x_data) + 5 + noise
# create df
x_df = pd.DataFrame(data=x_data,columns=['X Data'])
y_df = pd.DataFrame(data=y_actual,columns=['Y'])
my_data=pd.concat([x_df,y_df], axis=1) # concatenate as columns (not more rows)
# plot sample
sample = my_data.sample(n=100) # return sample (100 random rows)
sample.plot(kind='scatter',x='X Data',y='Y')

# linear regression
    # y = mx + b
batch_size = 8
r1, r2 = np.random.randn(2)
m = tf.Variable(r1, dtype=tf.float32)
b = tf.Variable(r2, dtype=tf.float32)
# placeholders
x_ph = tf.placeholder(tf.float32,[batch_size])
y_ph = tf.placeholder(tf.float32,[batch_size])
y_model = m * x_ph + b
error = tf.reduce_sum(tf.square(y_ph - y_model)) # reduce_sum: sum of array
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.001)
train = optimizer.minimize(error)
# execute
init = tf.global_variables_initializer()
with tf.Session() as sess:
    sess.run(init)
    batches = 1000
    for i in range(batches):
        rand_ind = np.random.randint(low=0,high=len(x_data),size=batch_size) # array: 8 random indices
        feed = {x_ph:x_data[rand_ind],y_ph:y_actual[rand_ind]} # feed_dict
        sess.run(train,feed_dict=feed)
    model_m, model_b = sess.run([m,b])
    print(model_m, model_b)
# test
y_pred_plot = model_m*x_data + model_b
plt.plot(x_data, y_actual, '*') # data points (actual)
plt.plot(x_data, y_pred_plot, 'r') # y-hat line (prediction)


# ----------------
# saving & restoring models
# ----------------

# personal preference -- train then save, load then test

# save
saver = tf.train.Saver()

with tf.Session() as sess:
    sess.run(init)
    epochs = 100
    for i in range(epochs):
        sess.run(train)
    # fetch results
    final_slope, final_intercept = sess.run([m,b])
    # save (checkpoint file)
    saver.save(sess,'./my_first_model.ckpt') # may have errors (depending on OS)

# load
with tf.Session() as sess:
    # restore
    saver.restore(sess,'./my_first_model.ckpt')
    # fetch results
    restored_slope, restored_intercept = sess.run([m,b])





# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




# ----------------
#
# ----------------




