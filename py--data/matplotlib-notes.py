# ---
# matplotlib
# ---

# ---
# imports
# ---

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# ---
# setup
# ---

sns.set(style='white', color_codes=True)

'''
# needed in jupyter notebooks
%matplotlib inline
'''

# ---
# histogram
# ---

# histogram (multiple datasets)
ds1: np.ndarray = np.random.randn(100)
ds2: np.ndarray = np.random.randn(80)
plt.hist(ds1, density=True, color='red', alpha=.5, bins=[-4, -3, -2, -1, 0, 1, 2, 3, 4])
plt.hist(ds2, density=True, color='blue', alpha=.5, bins=[-4, -3, -2, -1, 0, 1, 2, 3, 4])

# histogram (with arguments)
ds3: np.ndarray = np.random.randn(100)
plt.hist(
    ds3,
    alpha=.8,  # 0-1 transparency
    bins=10,  # int -- number of equal bins (default 10), list -- edges of bins ([1,2,3,4])
    histtype='bar',  # bar (traditional), barstacked, step (generates lineplot), stepfilled
    align='mid',  # left (centered on left bin edge), mid, right
    orientation='vertical',  # vertical, horizontal
    color='#aaaaff',  # str -- color, list -- colors (1:1 color:ds ratio)
    label='label1',  # str -- label, list -- labels for multiple datasets
    density=True  # idk lol
)

# histogram methods
plt.xlabel('label for x')
plt.ylabel('label for y')
plt.title('histogram title')
plt.text(60, .025, 'my text here'),  # x, y, text_to_display
plt.axis([40, 160, 0, 0.03])  # xmin, xmax, ymin, ymax
plt.show()


# ---
# functional method
# ---

# dataset
x: np.ndarray = np.linspace(0, 5, 11)
y: np.ndarray = x ** 2
print(x is y)
# plot
plt.plot(x, y)
plt.xlabel('x')  # set x label
plt.ylabel('y')  # set y label
plt.title('y = x ** 2')  # set title
plt.show()

# ---
# subplots (functional method)
# ---

# dataset
x = np.linspace(0, 5, 11)
y = x ** 2
# subplot
plt.subplot(1, 2, 1)  # ncols, nrows, index
plt.plot(x, y, 'b')  # x, y, color
plt.subplot(1, 2, 2)  # ncols, nrows, index
plt.plot(y, x, 'g')


# ---
# object oriented
# ---

# dataset
x = np.linspace(0, 5, 11)
y = x ** 2
# figure object
fig = plt.figure()
axes = fig.add_axes([0.1, 0.1, 0.8, 0.8])  # left, bottom, width, height (values between 0 and 1)
axes.plot(x, y)
axes.set_xlabel('x')
axes.set_label('y')
axes.set_title('y = x ** 2')


# ---
# OOP method (insert)
# ---

# dataset
x = np.linspace(0, 5, 11)
y = x ** 2
# figure object
fig = plt.figure()
# axes
axes1 = fig.add_axes([0.1, 0.1, 0.8, 0.8])
axes1.set_title('larger plot')
axes2 = fig.add_axes([0.2, 0.5, 0.4, 0.3])
axes2.set_title('smaller plot')
# plot
axes1.plot(x, y)
axes2.plot(y, x)

# ---
# OOP method (subplots)
# ---

# dataset
x = np.linspace(0, 5, 11)
y = x ** 2
# figure object
fig, axes = plt.subplots(nrows=1, ncols=2)
# axes
axes[0].plot(x, y)
axes[0].set_title('plot1')
axes[1].plot(y, x)
axes[1].set_title('plot2')
# force space (prevent overlap)
plt.tight_layout()

# ---
# figure size, and dpi
# ---

# dataset
x = np.linspace(0, 5, 11)
y = x ** 2
# figure object
fig = plt.figure(figsize=(4, 2), dpi=200)  # figsize: width,  height (inches)
# plot axis
ax = fig.add_axes([0, 0, 1, 1])
ax.plot(x, y)

# ---
# figure size & dpi
# ---

# dataset
x = np.linspace(0, 5, 11)
y = x ** 2
# fig size & dpi
fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(4, 2), dpi=150)
# axes
axes[0].plot(x, y)
axes[1].plot(y, x)
# space
plt.tight_layout()

# ---
# save figure (and legend)
# ---

# dataset
x = np.linspace(0, 5, 11)
# figure object
fig = plt.figure(figsize=(4, 2))  # figsize: width,  height (inches)
# axis (legend)
ax = fig.add_axes([0, 0, 1, 1])
ax.plot(x, 2 * x + 1, label='f(x)')
ax.plot(x, .5 * x + 3, label='g(x)')
ax.legend()
# save
fig.savefig('lines.png', dpi=200)


# ---
# control appearance (plot)
# ---

# dataset
x = np.linspace(0, 5, 11)
# figure object
fig = plt.figure()
# axis
ax = fig.add_axes([0, 0, 1, 1])  # left, bottom, width, height (values between 0 and 1)
ax.plot(
    x,  # input
    x**2,  # output
    color='blue',  # color: can also be hex '#aaaaff'
    lw=0.5,  # linewidth: 1 is default
    alpha=.75,  # opaqueness, 0-1
    linestyle='-',  # -. : -- - steps o +
    marker='.',  # marker for points: o + * . > < p x d D
    markersize=10,
    markerfacecolor='white',
    markeredgewidth=.5,
    markeredgecolor='black'
)

# ---
# control appearance (axis)
# ---

# dataset
x = np.linspace(0, 5, 11)
# figure object
fig = plt.figure()
# axis
ax = fig.add_axes([0, 0, 1, 1])  # left, bottom, width, height (values between 0 and 1)
ax.plot(x, .5 * x + 3, color='blue')
ax.set_xlim([0, 5])
ax.set_ylim([0, 10])

# ---
# examples of other plots
# ---

# https://matplotlib.org/gallery/index.html
