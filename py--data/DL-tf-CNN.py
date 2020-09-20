
# ----------------
# CNN
# ----------------

# neuron
    # z = w * x + b (weight, input, bias)
    # a = σ(z) (activation function)
    # activation functions -- perceptrons, sigmoid, tanh, relu
# NN
    # input layer, hidden layers, output layer 
    # more layers, more abstraction
# cost functions
    # quadratic
    # cross-entropy
# learning
    # measure error
    # minimize by changing weight/bias values
    # gradient descent to find the optimal values
        # learning rate -- step size during gradient descent
        # batch size -- batches allow us to use stochastic gradient descent
            # small -- faster, but less representative
            # large -- slower, but more representative
        # second-order behavior (rate) of GD allows us to adjust learning rate.
            # AdaGrad, RMSProp, Adam
    # under/over fitting can be problematic
        # L1/L2 regularization -- penalty for larger weights in table (prevents overfitting)
        # dropout -- randomly remove neurons during training. (better balance of weight)
        # expanding data -- artificially expand data by adding noise.


# initializing weights (options)
    # zeros (no randomness, not a great choice)
    # random distribution near zero (not optimal, activation functions distortion)
    # xavier (glorot) initialization
        # uniform or normal
        # draw weights from a distribution with zero mean and specific variance.


# ----------------
# mnist
# ----------------

# download dataset
# from tensorflow.examples.tutorials.mnist import input_data
# mnist = input_data.read_data_sets('MNIST_data/', one_hot=True)
mnist.train.images # array
mnist.train.num_examples # 55000
mnist.test.num_examples # 10000
mnist.train.images.shape # 55000 784
img1 = mnist.train.images[1].reshape(28,28) # image as array
plt.imshow(img1, cmap='gray') # plot image

# ----------------
# softmax regression
# ----------------

# feature is matched to all potential labels.
# returns a list of probabilities that add up to 1.
# highest probability in list is likely to be the match
# y1 = w1x1 + w1x2 + w1x3 + b1 (probability, weight, neuron)

# placeholder
x = tf.placeholder(tf.float32,shape=[None,784]) # batch size, w*h
y_true = tf.placeholder(tf.float32,[None,10])
# variables
W = tf.Variable(tf.zeros([784,10])) # w*h, potential labels
b = tf.Variable(tf.zeros([10])) # potential labels
# graph operation
y = tf.matmul(x,W) + b
# loss function
cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(
    labels=y_true, logits=y
))
# optimizer
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.5)
train = optimizer.minimize(cross_entropy)
# create session
init = tf.global_variables_initializer()
with tf.Session() as sess:
    sess.run(init)
    for step in range(1000):
        batch_x, batch_y = mnist.train.next_batch(100)
        sess.run(train,feed_dict={x:batch_x, y_true:batch_y})
    # evaluate the model
    correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_true,1))
    acc = tf.reduce_mean(tf.cast(correct_prediction, tf.float32)) # average of boolean (cast as 0,1)
    print(sess.run(acc,feed_dict={x:mnist.test.images,y_true:mnist.test.labels}))

# ----------------
# CNN
# ----------------

# DNN -- neuron is connected to each neuron in the next layer
# CNN -- neuron is connected to some neurons in the next layer
    # convolutional layer -- apply filter to image
    # pooling layer -- take kernel (ie: 2x2) and use max value. reduces image size
    # dropout -- throughout training, units/connections are randomly dropped. prevents overfitting
    # popular CNNs -- LeNet, AlexNet, GoogLeNet, ResNet
        # each are characterized by their convolution/pooling layers, stride, etc.


# ----------------
# CNN (mnist)
# ----------------

# import steps for 'mnist' above.

# helper
# init weights
def init_weights(shape):
    init_random_dist = tf.truncated_normal(shape, mean=0, stddev=0.1)
    return tf.Variable(init_random_dist)
# init bias
def init_bias(shape):
    init_bias_vals = tf.constant(0.1, shape=shape)
    return tf.Variable(init_bias_vals)
# conv2d
def conv2d(x,W):
    # x -- neuron -- [batch, h, w, channels]
    # W -- kernel -- [filter_h, filter_w, channels_in, channels_out]
    return tf.nn.conv2d(x, W, strides=[1,1,1,1], padding='SAME')
# pooling
def max_pool_2by2(x):
    # x -- neuron -- [batch, h, w, channels]
    return tf.nn.max_pool(x,ksize=[1,2,2,1],strides=[1,2,2,1],padding='SAME')
# convolutional layer
def convolutional_layer(input_x, shape):
    W = init_weights(shape)
    b = init_bias([shape[3]])
    return tf.nn.relu(conv2d(input_x,W) + b) # activation function
# normal (fully connected)
def normal_full_layer(input_layer,size):
    input_size = int(input_layer.get_shape()[1])
    W = init_weights([input_size,size])
    b = init_bias([size])
    return tf.matmul(input_layer,W) + b

# placeholders
x = tf.placeholder(tf.float32, shape=[None, 784]) # batch size, image size
y_true = tf.placeholder(tf.float32, shape=[None, 10]) # batch size, possible labels
# layers
x_image = tf.reshape(x, [-1,28,28,1]) # reshape flattened array back to image array
# conv layer 1 (compute 32 features or each 5x5 patch)
convo_1 = convolutional_layer(x_image, shape=[5,5,1,32])
# pooling 1 (2x2)
convo_1_pooling = max_pool_2by2(convo_1)
# conv layer 2
convo_2 = convolutional_layer(convo_1_pooling, shape=[5,5,32,64])
# pooling 2 (2x2)
convo_2_pooling = max_pool_2by2(convo_2)
# flatten (prepare for fully connected layer) (7x7 image, 64 features?)
convo_2_flat = tf.reshape(convo_2_pooling, [-1, 7*7*64]) # flat layer
full_layer_one = tf.nn.relu(normal_full_layer(convo_2_flat, 1024)) # layer, neurons
# dropout
hold_prob = tf.placeholder(tf.float32)
full_one_dropout = tf.nn.dropout(full_layer_one, keep_prob=hold_prob)
y_pred = normal_full_layer(full_one_dropout, 10) # layer, # of labels

# loss function
cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(
    labels=y_true, logits=y_pred
))
# optimizer
optimizer = tf.train.AdamOptimizer(learning_rate=0.001)
train = optimizer.minimize(cross_entropy)
# session
init = tf.global_variables_initializer()
steps = 500 # 5000 for better results
with tf.Session() as sess:
    sess.run(init)
    for i in range(steps):
        batch_x, batch_y = mnist.train.next_batch(50) # 50 images per batch
        sess.run(train,feed_dict={x:batch_x, y_true:batch_y, hold_prob:0.5})
        if i%100 == 0:
            matches = tf.equal(tf.argmax(y_pred,1), tf.argmax(y_true,1)) # list of booleans (match)
            acc = tf.reduce_mean(tf.cast(matches, tf.float32)) # cast list of booleans to 1,0. get average
            acc_report = sess.run(acc,feed_dict={x:mnist.test.images, y_true:mnist.test.labels, hold_prob:1.0 })
            print(f"on step: {i}")
            print(f"accuracy: {acc_report}",'\n')

# ----------------
# CNN (CIFAR-10) (dataset)
# ----------------

# download dataset

# 60k colors images, 10 classes, 6k images/class, 50k train, 10k test
# creating tensor batches is the difficulty here
import pickle
import os
def unpickle(file):
    with open(file, 'rb') as fo:
        cifar_dict = pickle.load(fo, encoding='bytes')
    return cifar_dict
cifar_dir = './cifar-10-batches-py/'
fn_all = ['batches.meta', 'data_batch_1','data_batch_2','data_batch_3','data_batch_4','data_batch_5','test_batch']
### all_data = [0,1,2,3,4,5,6] # only needed if using 'zip' instead of 'enumerate'
all_data = []
for i, fn in enumerate(fn_all):
    fp = os.path.join(cifar_dir, fn)
    all_data.append(unpickle(fp))

# batch_meta
    # dict: keys -- 'label_names','num_cases_per_batch','num_vis'
# data_batch
    # dict: keys -- 'data','labels' 
    # data -- 10k x 3072 np.array uint8
        # each row is a 32x32 image, RGB Channels (32x32x3)
    # labels -- list of 10k nums (0-9)

batch_meta = all_data[0] 
data_batch1 = all_data[1] 
data_batch2 = all_data[2]
data_batch3 = all_data[3]
data_batch4 = all_data[4]
data_batch5 = all_data[5]
test_data = all_data[6]

# reshape (10k images, 3 channels, 32x32) (10k images, 32x32, 3 channels)
db1 = data_batch1[b'data']
db1 = db1.reshape(10000, 3, 32, 32).transpose(0,3,2,1).astype('uint8') 
plt.imshow(db1[0]) # show image (plt understands this shape)

# ----------------
# CNN (CIFAR-10) (functions and classes)
# ----------------

# helper functions
def one_hot_encode(vec, vals=10):
    # for use to one-hot encode the 10 possible labels
    n = len(vec)
    out = np.zeros((n,vals))
    out[range(n), vec] = 1
    return out

class CifarHelper():
    def __init__(self):
        self.i = 0
        # grabs a list of all the data batches for training
        self.all_train_batches = [data_batch1, data_batch2, data_batch3, data_batch4, data_batch5 ]
        self.test_batch = [test_data]
        # initialize some empty variables for later on
        self.training_images = None
        self.training_labels = None
        self.test_images = None
        self.test_labels = None

    def set_up_images(self):
        # TRAIN
        print('setting up training images and labels')
        # vertically stack training images
        self.training_images = np.vstack([d[b'data'] for d in self.all_train_batches])
        train_len = len(self.training_images)
        # reshape and normalize
        self.training_images = self.training_images.reshape(train_len,3,32,32).transpose(0,2,3,1)/255
        # one hot encode the training labels (ie [0,0,0,1,0,0,0,0,0,0])
        self.training_labels = one_hot_encode(np.hstack([d[b'labels'] for d in self.all_train_batches]))
        # TEST
        print('setting up test images and labels')
        # vertically stack test images
        self.test_images = np.vstack([d[b'data'] for d in self.test_batch])
        train_len = len(self.test_images)
        # reshape and normalize
        self.test_images = self.test_images.reshape(train_len,3,32,32).transpose(0,2,3,1)/255
        # one hot encode the training labels (ie [0,0,0,1,0,0,0,0,0,0])
        self.test_labels = one_hot_encode(np.hstack([d[b'labels'] for d in self.test_batch]))

    def next_batch(self, batch_size):
        # note that the 100 dimension in the reshape call is set by an assumed batch size of 100
        x = self.training_images[self.i:self.i+batch_size].reshape(100,32,32,3)
        y = self.training_labels[self.i:self.i+batch_size]
        self.i = (self.i + batch_size) % len(self.training_images)
        return x, y

# ----------------
# CNN (CIFAR-10) (model)
# ----------------

# placeholders
x = tf.placeholder(tf.float32,shape=[None,32,32,3]) # batch size, 32x32, 3 channels
y_true = tf.placeholder(tf.float32,shape=[None,10]) # batch size, labels (one-hot-encoded)
hold_prob = tf.placeholder(tf.float32)

# helper functions
# init weights
def init_weights(shape):
    init_random_dist = tf.truncated_normal(shape, mean=0, stddev=0.1)
    return tf.Variable(init_random_dist)
# init bias
def init_bias(shape):
    init_bias_vals = tf.constant(0.1, shape=shape)
    return tf.Variable(init_bias_vals)
# conv2d
def conv2d(x,W):
    # x -- neuron -- [batch, h, w, channels]
    # W -- kernel -- [filter_h, filter_w, channels_in, channels_out]
    return tf.nn.conv2d(x, W, strides=[1,1,1,1], padding='SAME')
# pooling
def max_pool_2by2(x):
    # x -- neuron -- [batch, h, w, channels]
    return tf.nn.max_pool(x,ksize=[1,2,2,1],strides=[1,2,2,1],padding='SAME')
# convolutional layer
def convolutional_layer(input_x, shape):
    W = init_weights(shape)
    b = init_bias([shape[3]])
    return tf.nn.relu(conv2d(input_x,W) + b) # activation function
# normal (fully connected)
def normal_full_layer(input_layer,size):
    input_size = int(input_layer.get_shape()[1])
    W = init_weights([input_size,size])
    b = init_bias([size])
    return tf.matmul(input_layer,W) + b

# create layers
convo_1 = convolutional_layer(x,shape=[4,4,3,32]) # 4x4, 3 ch in, 32 ch out
convo_1_pooling = max_pool_2by2(convo_1)
convo_2 = convolutional_layer(convo_1_pooling, shape=[4,4,32,64]) # 4x4, 32 ch in, 64 ch out
convo_2_pooling = max_pool_2by2(convo_2)
# flat layer
convo_2_flat = tf.reshape(convo_2_pooling, [-1,8*8*64])
# normal full layer (1024 neurons) (relu = max(0,x))
full_layer_one = tf.nn.relu(normal_full_layer(convo_2_flat,1024))
# dropout layer
full_one_dropout = tf.nn.dropout(full_layer_one, keep_prob=hold_prob)
y_pred = normal_full_layer(full_one_dropout, 10) # 10 neurons, 10 possible labels
# loss function
cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(
    labels=y_true, logits=y_pred
))
# optimizer
optimizer = tf.train.AdamOptimizer(learning_rate=0.001)
# train
train = optimizer.minimize(cross_entropy)

# ----------------
# CNN (CIFAR-10) (session)
# ----------------

# instantiate class
ch = CifarHelper()
# set up images
ch.set_up_images()

# init global variables
init = tf.global_variables_initializer()
steps = 500 # better results at 5000
with tf.Session() as sess:
    sess.run(init)
    for i in range(steps):
        batch = ch.next_batch(100) # returns x,y (input images, output labels)
        sess.run(train, feed_dict={x:batch[0], y_true:batch[1], hold_prob:0.5})
        if i % 100 == 0:
            print(f"step: {i}")
            matches = tf.equal(tf.argmax(y_pred,1), tf.argmax(y_true,1)) # equal?
            acc = tf.reduce_mean(tf.cast(matches,tf.float32)) # cast booleans to 1,0. get average
            acc_report = sess.run(acc,feed_dict={x:ch.test_images,y_true:ch.test_labels,hold_prob:1.0})
            print(f"accuracy: {acc_report}",'\n')
