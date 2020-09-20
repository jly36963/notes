# -------------
# computer vision (python, numpy, pandas, opencv, tensorflow, keras)
# -------------

# OpenCV (Open Source Computer Vision) is written in C++ (has Python bindings)

# dependencies
    # conda
    # jupyterlab
    # numpy
    # pandas
    # pillow
    # opencv (opencv-python)
    # tensorflow
    # keras

# -------------
# numpy
# -------------

# IMPORTS
import numpy as np

# CREATE ARRAYS
# array from list
list1 = [1,2,3]
arr1 = np.array(list1)
type(arr1) # numpy.ndarray
# array from range
arr1 = np.arange(0,10,1) # start, stop (cuts off before), step (optional)
# array of zeros (2d) (uses floats)
np.zeros(shape=(10,5)) # 10 rows, 5 columns
# array of ones (2d) (uses floats)
np.ones(shape=(2,4)) # 2 rows, 4 columns
# array of random integers (seed makes the random integers consistent)
np.random.seed(101)
arr1 = np.random.randint(0,100,10) # 10 random integers between 0 and 100
# copy array
arr1 = np.arange(0,10,1)
arr2 = arr1.copy()

# NUMPY (STATS)
arr1.max() # max value
arr1.argmax() # return index of max
arr1.min() # min value
arr1.argmin() # return index of min
arr1.mean() # mean

# NUMPY (SHAPING)
arr1 = np.arange(0,100).reshape(10,10) # array of 0-100, reshaped to 10 rows/cols
arr1.shape # dimensions of array (rows, columns)

# NUMPY INDEXING/SLICING
arr1 = np.arange(0,100).reshape(10,10)
arr1[2,4] # row index 2, col index 4 (nested array: which array, which element)
arr1[:,5] # col index 5 (all intersections between rows and col index 5)
arr1[3,:] # row index 3 (all intersections between cols and row index 3)
arr1[2:4,3:5] # 2d array -- rows 2 & 3, cols 3 & 4

# NUMPY ASSIGNMENT (using indexing)
arr1[2,4] = 0 # assign value to one element 
arr1[:,5] = 0 # assign value to a slice
arr1[:,:] = 123 # assign value to 2d slice

# -------------
# pillow (pil -- python image library)
# -------------

# IMPORTS
import numpy as np
import matplotlib.pyplot as plt
# needed by older versions of jupyter to do plots
%matplotlib inline 
from PIL import Image

# PLOT IMAGE
# open image
fp1 = '../path/to/pic/filename.jpg'
img1 = Image.open(fp1) # relative or absolute
# check type
print(type(img1)) # PIL.JpegImagePlugin.JpegImageFile
# convert to array
img_arr1 = np.asarray(img1)
# info about array
print(img_arr1.shape) # (dimensions -- rows, cols, z) (rows, cols, bands)
# plot array as image
plt.imshow(img_arr1)

# PLOT IMAGE (RED BAND) 
# get red band 
fp1 = '../path/to/pic/filename.jpg'
img1 = Image.open(fp1) # relative or absolute
img_arr1 = np.asarray(img1)
img_arr1_red = np.array(img_arr1[:,:,0])
# plot array as image (cmap -- set color ramp)
plt.imshow(img_arr1_red, cmap='gray')

# SET OTHER COLOR BANDS TO ZERO (RED BAND VALUES ONLY)
fp1 = '../path/to/pic/filename.jpg'
img1 = Image.open(fp1)
img_arr1 = np.asarray(img1)
img_arr1[:,:,1:] = 0

# -------------
# OpenCV (jupyter)
# -------------

# IMPORTS
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline 
import cv2

# PLOT IMAGE
# import image (and convert to array)
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
type(img1) # numpy.ndarray (if fp1 doesn't exist, type will be 'NoneType')
# matplotlib expects RGB, opencv uses BGR. this function makes the image RGB
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
plt.imshow(img1)

# REVERSE ORDER OF BANDS (BGR TO RGB)
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
img1 = np.flip(img1, 2) # reverse the z axis (args -- image, axis)
plt.imshow(img1)

# PLOT GRAYSCALE IMAGE 
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1, cv2.IMREAD_GRAYSCALE)
print(img1.shape) # (rows, cols) (no longer a z dimension)
plt.imshow(img1, cmap='gray')

# RESIZE IMAGE (shape -- rows/cols, resize -- x/y )
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
print(img1.shape) # (rows, cols, bands)
img1 = cv2.resize(img1, (500, 500)) # source, dimensions (x & y)
plt.imshow(img1)

# RESIZE IMAGE (ratio)
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
print(img1.shape) # (rows, cols, bands)
x = .5 # width multiplier
y = .5 # height multiplier
img1 = cv2.resize(img1, (0,0), img1, x, y) # source, zeros tuple, source, x, y
plt.imshow(img1)

# FLIP IMAGE
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
print(img1.shape) # (rows, cols, bands)
img1 = cv2.flip(img1, 0) # 0 -- flip rows (y), 1 -- flip columns (x), 2 flip bands
plt.imshow(img1)

# WRITE FILE
# import file
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
# save file
cv2.imwrite('image_name.jpg', img1) # output name, image to write

# -------------
# OpenCV (python scripts)
# -------------

# IMPORTS 
import numpy as np
import cv2

# SHOW FILE
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
cv2.imshow('Window_Name', img1) # open window
cv2.waitKey() # wait until window is closed

# SHOW FILE (v2)
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
while True:
    # open window
    cv2.imshow('Window_Name', img1)
    # if 1 ms has passed and the escape key is pressed, break 
    if cv2.waitKey(1) & OxFF == 27:
        break
# destroy windows
cv2.destroyAllWindows()

# -------------
# OpenCV (drawing on images)
# -------------

# IMPORTS
import cv2
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

# CREATE IMG
img1 = np.zeros(shape=(500,500,3), dtype=np.int16)
print(img1.shape)

# DRAW
# rectangle (pt1 & pt2 are the corners)
cv2.rectangle(img1, pt1=(10,10), pt2=(490,490), color=(255,255,255), thickness=5)
# circles
cv2.circle(img1, center=(250,250), radius=90, color=(255,255,255), thickness=20 )
cv2.circle(img1, center=(250,250), radius=50, color=(255,255,255), thickness=20 )
cv2.circle(img1, center=(250,250), radius=20, color=(255,255,255), thickness=-1 )
# straight line
cv2.line(img1, pt1=(100,250), pt2=(400,250), color=(255,255,255), thickness=5)
cv2.line(img1, pt1=(250,100), pt2=(250,400), color=(255,255,255), thickness=5)
# polygon
vertices = np.array([ [100,100], [100,400], [400,400], [400,100] ])
pts = vertices.reshape(-1,1,2) # shape (4,2) to (4,1,2)
cv2.polylines(img1, [pts], isClosed=True, color=(255,255,255), thickness=5)

# plot image
plt.imshow(img1)

# -------------
# OpenCV (drawing on image with a mouse) (circles)
# -------------

import cv2
import numpy as np

# FUNCTION
# define callback function
def draw_circle(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        cv2.circle(img1, center=(x,y), radius=50, color=(255,255,255), thickness=5 )
    elif event == cv2.EVENT_RBUTTONDOWN:
        cv2.circle(img1, center=(x,y), radius=25, color=(255,255,255), thickness=5 )
# connect callback function
cv2.namedWindow(winname='window_name')
cv2.setMouseCallback('window_name', draw_circle)

# SHOW IMAGE
img1 = np.zeros((500,500,3))
while True:
    cv2.imshow('window_name', img1)
    if cv2.waitKey(20) & 0xFF == 27:
        break
cv2.destroyAllWindows()

# -------------
# OpenCV (drawing on image with a mouse) (rectangles)
# -------------

# when creating rectangles, drag from top left to bottom right 

import cv2
import numpy as np

# variables used
img = np.zeros((512,512,3)) # black image
drawing = False # mouse button down -- True, mouse button up -- False
ix, iy = -1, -1

# draw rectangle (callback function)
def draw_rectangle(event, x, y, flags, params):
    global ix, iy, drawing # use 3 global variables
    if event == cv2.EVENT_LBUTTONDOWN:
        # get x, y coordinates
        drawing = True
        ix, iy = x,y # store start position
    elif event == cv2.EVENT_MOUSEMOVE:
        # create rectangle
        if drawing == True:
            cv2.rectangle(img, (ix,iy), (x,y), (255,255,255))
    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        cv2.rectangle(img, (ix,iy), (x,y), (255,255,255))

cv2.namedWindow(winname='image')
cv2.setMouseCallback('image', draw_rectangle)

# open window/image
while True:
    cv2.imshow('image', img)
    if cv2.waitKey(20) & 0xFF == 27:
        # escape key pressed
        break
# destroy windows        
cv2.destroyAllWindows()

# -------------
# OpenCV (convert RGB to HSL/HSV)
# -------------

# HSL -- hue (color), saturation (intensity), lightness (brightness)

# IMPORTS
import cv2
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

# RGB TO HSL
# import image
fp1 = '../path/to/pic/filename.jpg'
img1 = cv2.imread(fp1)
# convert
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2HLS)
# plot image
plt.imshow(img1)

# -------------
# OpenCV (blending and pasting images)
# -------------

# weighted blending
    # pixel = α * pixel1 + β * pixel2 + γ

# IMPORTS
import cv2
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

# BLEND IMAGES (different size)
# import images
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
fp2 = '../path/to/pic/filename2.jpg'
img2 = cv2.imread(fp2)
img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
# resize (resize img2 to dimensions of img1)
print( img1.shape, img2.shape ) # before
dimensions = img1.shape # rows, cols, bands
img2 = cv2.resize(img2, (dimensions[1], dimensions[0])) # x, y
print( img1.shape, img2.shape ) # after
# blend
img3 = cv2.addWeighted(src1=img1, alpha=.6, src2=img2, beta=.4, gamma=0 )
# plot blended image
plt.imshow(img3)

# OVERLAY IMAGES
# skipped this part

# MASKING & OVERLAYING IMAGES
# skipped this part

# -------------
# OpenCV (thresholding)
# -------------

# https://docs.opencv.org/3.2.0/d7/d4d/tutorial_py_thresholding.html

# IMPORTS
import cv2
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

# THRESHOLDING
# import image (grayscale)
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1, 0)
# threshold (returns tuple)
thresh_val1, output_img1 = cv2.threshold(src=img1, thresh=110, maxval=255, type=cv2.THRESH_BINARY)
# plot image
plt.imshow(output_img1, cmap='gray')

# ADAPTIVE THRESHOLDING
# import image (grayscale)
fp2 = '../path/to/pic/filename2.jpg'
img2 = cv2.imread(fp2, 0)
# threshold
output_img2 = cv2.adaptiveThreshold(src=img2, maxValue=255, adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C, thresholdType=cv2.THRESH_BINARY, blockSize=5, C=8)
# plot image
plt.imshow(output_img2, cmap='gray')

# -------------
# OpenCV (gamma correction)
# -------------

# IMPORTS
import cv2
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

# GAMMA CORRECTION
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# gamma correction (pixel value ^ gamma)
gamma = 3/4 # 0 < gamma < 1 (brighter), gamma > 1 (darker)
img1 = np.power(img1/255, gamma) # (I/255)^γ
# plot image
plt.imshow(img1)

# -------------
# OpenCV (blurring and smoothing images)
# -------------

# BLUR (concept)
# basically takes a weighted average of a pixel with its surrounding pixels.
# kernel example
    # 3 x 3 matrix, mutliply by values below, the sum becomes the new pixel value
    # (.0625) (.125) (.0625)
    # (.125) (.25) (.125)
    # (.0625) (.125) (.0625)

# IMPORTS
import cv2
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

# BLUR (manual kernel)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# blur image 
kernel = np.ones(shape=(3,3), dtype=np.float32)/9
img2 = cv2.filter2D(src=img1, ddepth=-1, kernel=kernel, anchor=(-1,-1) )
# plot image
plt.imshow(img2)

# BLUR (built in kernel)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# blur image 
img2 = cv2.blur(src=img1, ksize=(3,3))
# plot image
plt.imshow(img2)

# BLUR (gaussian)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# blur image 
img2 = cv2.GaussianBlur(src=img1, ksize=(3,3), sigmaX=10) # sigmaY (stddev) is assumed
# plot image
plt.imshow(img2)

# BLUR (median)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# blur image 
img2 = cv2.medianBlur(src=img1, ksize=3) 
# plot image
plt.imshow(img2)

# BLUR (bilateral filtering)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# blur image 
img2 = cv2.bilateralFilter(src=img1, d=9, sigmaColor=75, sigmaSpace=75 ) 
# plot image
plt.imshow(img2)

# -------------
# OpenCV (morphological operators)
# -------------

# ERODE (decrease white area)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# erode boundaries
kernel = np.ones((3,3), dtype=np.uint8)
img2 = cv2.erode(src=img1, kernel=kernel, iterations=1)
# plot image
plt.imshow(img2)

# DILATE (increase white area)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# dilate boundaries
kernel = np.ones((3,3), dtype=np.uint8)
img2 = cv2.dilate(src=img1, kernel=kernel, iterations=1)
# plot image
plt.imshow(img2)

# OPENING (erode, then dilate) (remove white noise)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# dilate boundaries
kernel = np.ones((3,3), dtype=np.uint8)
img2 = cv2.morphologyEx(src=img1, op=cv2.MORPH_OPEN, kernel=kernel, iterations=1)
# plot image
plt.imshow(img2)

# CLOSING (dilate, then erode) (remove black noise)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# dilate boundaries
kernel = np.ones((3,3), dtype=np.uint8)
img2 = cv2.morphologyEx(src=img1, op=cv2.MORPH_CLOSE, kernel=kernel, iterations=1)
# plot image
plt.imshow(img2)

# MORPHOLOGICAL GRADIENT (dilation - erosion)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# dilate boundaries
kernel = np.ones((3,3), dtype=np.uint8)
img2 = cv2.morphologyEx(src=img1, op=cv2.MORPH_GRADIENT, kernel=kernel, iterations=1)
# plot image
plt.imshow(img2)

# -------------
# OpenCV (gradients)
# -------------

# image gradient is a directional change in the intensity/color of an image
# sobel feldman operator is used to try and approximate the derivative
    # normalized x-gradient -- shows vertical edges
    # normalized y-gradient -- shows horizontal edges
    # normalized gradient magnitude -- shows edges from both directions
# blending the results of sobel gradients (x and y) together can be helpful.

# Gx
    # +1 0 -1
    # +2 0 -2
    # +1 0 -1

# Gy
    # +1 +2 +1
    # 0 0 0
    # -1 -2 -1

# GRADIENTS (sobel x)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1, 0)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# gradient (x)
img2 = cv2.Sobel(src=img1, ddepth=cv2.CV_64F, dx=1, dy=0, ksize=5)
# plot image
plt.imshow(img2, cmap='gray')

# GRADIENTS (sobel y)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1, 0)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# gradient (x)
img2 = cv2.Sobel(src=img1, ddepth=cv2.CV_64F, dx=0, dy=1, ksize=5)
# plot image
plt.imshow(img2, cmap='gray')

# GRADIENTS (Laplacian) (laplace operator)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1, 0)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# gradient (x)
img2 = cv2.Laplacian(src=img1, ddepth=cv2.CV_64F, ksize=5)
# plot image
plt.imshow(img2, cmap='gray')

# -------------
# OpenCV (histograms)
# -------------

# HISTOGRAM (one band)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
# compute histogram (B G R)
hist1 = cv2.calcHist(images=[img1], channels=[0], mask=None, histSize=[256], ranges=[0,256])
# plot histogram
plt.plot(hist1)

# HISTOGRAM (3 bands)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
# enumerate through bands
color = ('b', 'g', 'r')
for i,c in enumerate(color):
    hist = cv2.calcHist(images=[img1], channels=[i], mask=None, histSize=[256], ranges=[0,256])
    plt.plot(hist, color=c)

# HISTOGRAM (with mask) (converted to RGB before histogram)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# mask
mask = np.zeros(shape=img1.shape[:2], dtype=np.uint8) # rows, cols, but not bands
mask[50:-50, 50:-50] = 255 # rows slice, cols slice (assuming rows/cols > 50)
img1m = cv2.bitwise_and(src1=img1, src2=img1, mask=mask)
# show
# plt.imshow(img1m)
# histogram
color = ('r', 'g', 'b')
for i,c in enumerate(color):
    hist = cv2.calcHist(images=[img1m], channels=[i], mask=mask, histSize=[256], ranges=[0,256])
    plt.plot(hist, color=c)

# HISTOGRAM EQUALIZATION (grayscale)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1, 0)
# equalize
img2 = cv2.equalizeHist(img1)
# plot image
plt.imshow(img2, cmap='gray')

# HISTOGRAM EQUALIZATION (color)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2HSV)
# equalize (HSV insead of BGR (value is needed))
img1[:,:,2] = cv2.equalizeHist(img1[:,:,2])
# convert back to rgb
img1 = cv2.cvtColor(img1, cv2.COLOR_HSV2RGB)
# plot image
plt.imshow(img1)

# -------------
# OpenCV (video)
# -------------

# skipped this section

# -------------
# OpenCV (template matching)
# -------------

# CCOEFF, CCORR -- max value is the top left corner (of template)
# SQDIFF -- min value is the top left corner (of template)

# to draw rectangle around match
    # get top left corner,
    # use dimensions of template to get bottom right corner
    # cv2.rectangle(img1, pt1=top_left, pt2=bottom_right, color=(255,255,255), thickness=5)


# TEMPLATE MATCHING
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
# create smaller image
img2 = img1[50:-50,50:-50]
# template match
img3 = cv2.matchTemplate(image=img1, templ=img2, method=cv2.TM_CCOEFF)
img3 = cv2.matchTemplate(image=img1, templ=img2, method=cv2.TM_CCOEFF_NORMED)
img3 = cv2.matchTemplate(image=img1, templ=img2, method=cv2.TM_CCORR)
img3 = cv2.matchTemplate(image=img1, templ=img2, method=cv2.TM_CCORR_NORMED)
img3 = cv2.matchTemplate(image=img1, templ=img2, method=cv2.TM_SQDIFF)
img3 = cv2.matchTemplate(image=img1, templ=img2, method=cv2.TM_SQDIFF_NORMED)
# get values from resulting heatmap
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(img3)
# plot image (subplot)
plt.subplot(2,2,1) # rows, cols, index
plt.imshow(img1)
plt.title('image')
plt.subplot(2,2,2) 
plt.imshow(img2)
plt.title('template')
plt.subplot(2,2,3) 
plt.imshow(img3)
plt.title('heatmap result from template matching')
# plot
plt.show()

# -------------
# OpenCV (corner detection)
# -------------

# corner -- junction of two edges (edges -- sudden change in image brightness)

# CORNER DETECTION
# load image
fp1 = '../path/to/pic/filename1.jpg'
img0 = cv2.imread(fp1)
img0 = cv2.cvtColor(img0, cv2.COLOR_BGR2RGB)
# create grayscale image for corner detection
img1 = cv2.cvtColor(img0, cv2.COLOR_RGB2GRAY)
# convert values to floats
img1 = np.float32(img1)
# harris corner detection
img2 = cv2.cornerHarris(src=img1, blockSize=2, ksize=3, k=0.04)
img2 = cv2.dilate(img2, None)
# highlight corners on original image
img0[img2 > 0.01*img2.max()] = [0,255,0]
# plot images
plt.subplot(2,2,1)
plt.imshow(img2, cmap='gray')
plt.title('corners')
plt.subplot(2,2,2)
plt.imshow(img0)
plt.title('highlighted')

# SHI-TOMASI CORNER DETECTION
# load image
fp1 = '../path/to/pic/filename1.jpg'
img0 = cv2.imread(fp1)
img0 = cv2.cvtColor(img0, cv2.COLOR_BGR2RGB)
# create grayscale image for corner detection
img1 = cv2.cvtColor(img0, cv2.COLOR_RGB2GRAY)
# shi-tomasi corner detection
img2 = cv2.goodFeaturesToTrack(image=img1, maxCorners=50, qualityLevel=0.01, minDistance=10)
# draw on corners
img2 = np.int0(img2)
for c in img2:
    x,y = c.ravel()
    cv2.circle(img0, (x,y), radius=10, color=(0,255,0), thickness=-1)
# plot images
plt.imshow(img0)

# -------------
# OpenCV (canny edge detector)
# -------------

# intensity gradient < threshold1 -- not an edge
# intensity gradient > threshold2 -- edge
# intensity gradient between thresholds -- possibly (if connected to an edge pixel)

# CANNY EDGE DETECTOR
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
# blur (remove noise)
img1 = cv2.blur(src=img1, ksize=(5,5))
# edge detection 
img2 = cv2.Canny(image=img1, threshold1=100, threshold2=150) 
# plot image
plt.imshow(img2)

# CANNY EDGE DETECTOR (using median pixel value)
# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
# get median pixel value
median1 = np.median(img1)
# calculate thresholds based on median
img1_t1 = int(max(0, median1*.8)) # between median and 0
img1_t2 = int(min(255, median1*1.2)) # between median and 255
# blur (remove noise)
img1 = cv2.blur(src=img1, ksize=(5,5))
# edge detection 
img2 = cv2.Canny(image=img1, threshold1=img1_t1, threshold2=img1_t2) 
# plot image
plt.imshow(img2)


# -------------
# OpenCV (grid detection) 
# -------------

# skipped this section
    # use a grid pattern to track distortion and movement
    # cv2.findChessboardCorners
    # cv2.findCirclesGrid

# -------------
# OpenCV (grid detection)
# -------------

# skipped section -- breaking changes in syntax

# -------------
# OpenCV (feature detection) (orb -- harris corner)
# -------------

fp1 = 'tree.jpg'
img1 = cv2.imread(fp1, 0)
# Initiate ORB detector
orb_params = dict(edgeThreshold=15, patchSize=31, nlevels=8, fastThreshold=20, scaleFactor=1.2, scoreType=cv2.ORB_HARRIS_SCORE, nfeatures=5000, firstLevel=0)
orb = cv2.ORB_create(**orb_params)
# compute the descriptors with ORB
kp1, des1 = orb.detectAndCompute(img1, None)

# draw only keypoints location,not size and orientation
img2 = cv2.drawKeypoints(img1, kp1, None, color=(0,255,0), flags=0)
plt.imshow(img2), plt.show()

# -------------
# OpenCV (feature detection) (kaze -- blob)
# -------------


# load images
fp1 = 'tree.jpg'
img1 = cv2.imread(fp1, 0)
# initiate detector (kaze)
kaze = cv2.KAZE_create()
# get keypoints and descriptors
kp1, des1 = kaze.detectAndCompute(img1, None)

# print(des1[0], des1[round(len(des1)/2)],des1[-1])

# draw only keypoints location,not size and orientation
img2 = cv2.drawKeypoints(img1, kp1, None, color=(0,255,0), flags=0)
plt.imshow(img2), plt.show()

# -------------
# OpenCV (feature detection) (akaze -- blob)
# -------------

# load images
fp1 = 'tree.jpg'
img1 = cv2.imread(fp1, 0)
# initiate detector (akaze)
akaze = cv2.AKAZE_create()
# get keypoints and descriptors
kp1, des1 = akaze.detectAndCompute(img1, None)

# draw only keypoints location,not size and orientation
img2 = cv2.drawKeypoints(img1, kp1, None, color=(0,255,0), flags=0)
plt.imshow(img2), plt.show()

# -------------
# OpenCV (feature matching) (orb/bf/match)
# -------------

# BRUTE FORCE (with ORB and match)
# load images
fp1 = '../path/to/pic/filename1.jpg'
fp2 = '../path/to/pic/filename2.jpg'
img1 = cv2.imread(fp1, 0)
img2 = cv2.imread(fp2, 0)
# initiate detector (orb)
orb_params = dict(edgeThreshold=15, patchSize=31, nlevels=8, fastThreshold=20, scaleFactor=1.2, scoreType=cv2.ORB_HARRIS_SCORE, nfeatures=5000, firstLevel=0)
orb = cv2.ORB_create(**orb_params)
# get keypoints and descriptors
kp1, des1 = orb.detectAndCompute(img1, None)
kp2, des2 = orb.detectAndCompute(img2, None)
# create BFMatcher object
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
# match descriptors
matches = bf.match(des1, des2)
# sort by distance (low distance is better)
matches = sorted(matches, key=lambda x: x.distance)
# draw first 10 matches
img3 = cv2.drawMatches(img1, kp1, img2, kp2, matches[:10], outImg=None, flags=2)
# plot matched illustration
plt.imshow(img3), plt.show()


# -------------
# OpenCV (feature matching) (sift & knn) (SIFT HAS BEEN REMOVED FROM cv2)
# -------------

# BRUTE FORCE (with SIFT and bf.knnMatch) (SIFT -- scale invariant feature transform)
# load images
fp1 = '../path/to/pic/filename1.jpg'
fp2 = '../path/to/pic/filename2.jpg'
img1 = cv2.imread(fp1, 0)
img2 = cv2.imread(fp2, 0)
# initiate detector (sift)
sift = cv2.xFeatures2d.SIFT_create()
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)
# create BFMatcher object
bf = cv2.BFMatcher()
# find matches
matches = bf.knnMatch(des1, des2, k=2) # knnMatch -- finds the k best matches for each descriptor
# lowe's ratio test to filter good matches
good = []
for m, n in matches:
    if m.distance < (n.distance * .7):
        good.append([m])
# draw matches
img3 = cv2.drawMatchesKnn(img1, kp1, img2, kp2, good, flags=2)
plt.imshow(img3), plt.show()

# -------------
# OpenCV (feature matching) (orb/bf/knn)
# -------------

# BRUTE FORCE
# load images
fp1 = '../path/to/pic/filename1.jpg'
fp2 = '../path/to/pic/filename2.jpg'
img1 = cv2.imread(fp1, 0)
img2 = cv2.imread(fp2, 0)
# initiate detector (orb)
orb_params = dict(edgeThreshold=15, patchSize=31, nlevels=8, fastThreshold=20, scaleFactor=1.2, scoreType=cv2.ORB_HARRIS_SCORE, nfeatures=1000, firstLevel=0)
orb = cv2.ORB_create(**orb_params)
# get keypoints and descriptors
kp1, des1 = orb.detectAndCompute(img1, None)
kp2, des2 = orb.detectAndCompute(img2, None)
# create BFMatcher object
bf = cv2.BFMatcher()
# find matches
matches = bf.knnMatch(des1, des2, k=2) # knnMatch -- finds the k best matches for each descriptor
# lowe's ratio test to filter good matches
good = []
for m, n in matches:
    if m.distance < (n.distance * .55):
        good.append([m])
# draw matches
img3 = cv2.drawMatchesKnn(img1, kp1, img2, kp2, good, outImg=None, flags=2)
plt.imshow(img3), plt.show()


# -------------
# OpenCV (feature matching) (orb/flann/knn)
# -------------

# FLANN
# load images
fp1 = '../path/to/pic/filename1.jpg'
fp2 = '../path/to/pic/filename2.jpg'
img1 = cv2.imread(fp1, 0)
img2 = cv2.imread(fp2, 0)
# initiate detector (orb)
orb_params = dict(edgeThreshold=15, patchSize=31, nlevels=8, fastThreshold=20, scaleFactor=1.2, scoreType=cv2.ORB_HARRIS_SCORE, nfeatures=1000, firstLevel=0)
orb = cv2.ORB_create(**orb_params)
# get keypoints and descriptors
kp1, des1 = orb.detectAndCompute(img1, None)
kp2, des2 = orb.detectAndCompute(img2, None)
# params for FlannBasedMatcher
FLANN_INDEX_LSH = 6
index_params= dict(algorithm=FLANN_INDEX_LSH, table_number=6, key_size=12, multi_probe_level=1) 
search_params = dict(checks=50)
# create flann object
flann = cv2.FlannBasedMatcher(index_params, search_params)
# find matches
matches = flann.knnMatch(des1, des2, k=2)
# lowe's ratio test to filter good matches
good = []
for m, n in matches:
    if m.distance < (n.distance * .55):
        good.append([m])
# draw matches
img3 = cv2.drawMatchesKnn(img1, kp1, img2, kp2, good, outImg=None, flags=2)
plt.imshow(img3), plt.show()

# -------------
# OpenCV (feature matching) (akaze/flann/knn)
# -------------

# FLANN
# load images
fp1 = 'tree.jpg'
fp2 = 'tree.png'
img1 = cv2.imread(fp1, 0)
img2 = cv2.imread(fp2, 0)
# initiate detector (akaze)
akaze = cv2.AKAZE_create()
# get keypoints and descriptors
kp1, des1 = akaze.detectAndCompute(img1, None)
kp2, des2 = akaze.detectAndCompute(img2, None)
# params for FlannBasedMatcher
FLANN_INDEX_LSH = 6
index_params= dict(algorithm=FLANN_INDEX_LSH, table_number=6, key_size=12, multi_probe_level=1) 
search_params = dict(checks=50)
# create flann object
flann = cv2.FlannBasedMatcher(index_params, search_params)
# find matches
matches = flann.knnMatch(des1, des2, k=2)
# lowe's ratio test to filter good matches
good = []
for m_n in matches:
    if len(m_n) != 2:
        continue
    (m,n) = m_n
    if m.distance < (n.distance * .4):
        good.append([m])
# draw matches
img3 = cv2.drawMatchesKnn(img1, kp1, img2, kp2, good, outImg=None, flags=2)
plt.imshow(img3), plt.show()

# -------------
# OpenCV (feature matching & homography) (akaze/flann/knn)
# -------------

print('getting kp and des')

# FLANN
# load images
fp1 = '9a.jpg'
fp2 = '9b.jpg'
img1 = cv2.imread(fp1, 0)
img2 = cv2.imread(fp2, 0)
# initiate detector (akaze)
akaze = cv2.AKAZE_create()
# get keypoints and descriptors
kp1, des1 = akaze.detectAndCompute(img1, None)
kp2, des2 = akaze.detectAndCompute(img2, None)

print('getting matches')

# params for FlannBasedMatcher
FLANN_INDEX_LSH = 6
index_params= dict(algorithm=FLANN_INDEX_LSH, table_number=6, key_size=12, multi_probe_level=1) 
search_params = dict(checks=50)
# create flann object
flann = cv2.FlannBasedMatcher(index_params, search_params)
# find matches
matches = flann.knnMatch(des1, des2, k=2)

print('filtering matches')

# lowe's ratio test to filter good matches
good = []
for m_n in matches:
    if len(m_n) != 2:
        continue
    (m,n) = m_n
    if m.distance < (n.distance * .4):
        good.append(m)
    
print('beginning homography')
    
# homography
if len(good) > 4:
    list_kp1 = []
    list_kp2 = []
    for match in good:
        # Get the matching keypoints for each of the images
        img1_idx = match.queryIdx
        img2_idx = match.trainIdx
        # Get points
        point1 = kp1[img1_idx].pt
        point2 = kp2[img2_idx].pt
        # append point to list
        list_kp1.append(point1)
        list_kp2.append(point2)
        
    H, mask = cv2.findHomography(
        srcPoints=np.array(list_kp2), 
        dstPoints=np.array(list_kp1), 
        method=cv2.RANSAC, 
        ransacReprojThreshold=4
    )
    
    h, w = img1.shape
    img3 = cv2.warpPerspective(img2, H, (w,h))
    
# plot images
plt.subplot(2,2,1)
plt.imshow(img1, cmap='gray')
plt.title('raw1')
plt.subplot(2,2,2)
plt.imshow(img3, cmap='gray')
plt.title('warp2')


# -------------
# OpenCV (contour)
# -------------

# larger kernel size for blurring might help

# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
# blur image
img2 = cv2.medianBlur(src=img1, ksize=5)
# grayscale
img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
# binary threshold
ret, img2 = cv2.threshold(src=img2, thresh=160, maxval=255, type=cv2.THRESH_BINARY_INV)
# find contours
contours, hierarchy = cv2.findContours(image=img2.copy(), mode=cv2.RETR_CCOMP, method=cv2.CHAIN_APPROX_SIMPLE)
# show contours (before watershed)
for i,c in enumerate(contours):
    if hierarchy[0][i][3] == -1:
        # external contour
        img2 = cv2.drawContours(image=img1, contours=contours, contourIdx=i, color=(100,100,255), thickness=10)
# plot image
plt.imshow(img2)


# -------------
# OpenCV (contours -- watershed algorithm)
# -------------

# larger kernel size for blurring might help
# otsu's method works well with watershed algorithm
# distance transform: 
    # binary image: background (0), foreground (1)
    # foreground value increases as it gets further away from background.

# first threshold produces img2, second threshold produces img3

# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1)
# blur image
img2 = cv2.medianBlur(src=img1, ksize=3)
# grayscale
img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
# binary threshold
ret, img2 = cv2.threshold(src=img2, thresh=160, maxval=255, type=cv2.THRESH_OTSU)
# noise removal (optional) (morphological operator)
kernel = np.ones((3,3), np.uint8)
img2 = cv2.morphologyEx(src=img2, op=cv2.MORPH_OPEN, kernel=kernel, iterations=2)
# distance transform 
img3 = cv2.distanceTransform(src=img2, distanceType=cv2.DIST_L2, maskSize=5)
# threshold
threshold = 0.7*img3.max()
ret, img3 = cv2.threshold(src=img3, thresh=threshold, maxval=255, type=cv2.THRESH_BINARY) # idk, cv2.THRESH_BINARY
# subtract img2, img3
img3 = np.uint8(img3)
unknown = cv2.subtract(img2, img3)
# get img4 (sure foreground, unknown area, background) (sure foreground will be the seeds for watershed)
ret, img4 = cv2.connectedComponents(img3)
img4 = img4 + 1
img4[unknown==255] = 0
# watershed algorithm
img4 = cv2.watershed(img1, img4)
# find contours
contours, hierarchy = cv2.findContours(image=img2.copy(), mode=cv2.RETR_CCOMP, method=cv2.CHAIN_APPROX_SIMPLE)

# show contours
for i,c in enumerate(contours):
    if hierarchy[0][i][3] == -1:
        # external contour
        img5 = cv2.drawContours(image=img1, contours=contours, contourIdx=i, color=(100,100,255), thickness=3)

# plot image
plt.imshow(img5)

# -------------
# OpenCV (watershed algorithm -- custom seeds)
# -------------

# skipped this section

# -------------
# OpenCV (face detection) (viola-jones algorithm with haar cascades)
# -------------

# main features -- edges, lines, four-rectangle 
    # edges = mean_light - mean_dark (the higher the value, the better the edge)
        # calculating all possible edges is computationally expensive.
        # viola-jones algorithm uses the 'integral' image (summed area table).
            # create a rectangle between the top left corner and the current pixel.
            # sum all values, that is the pixel value.
        # the image then goes through a cascade of classifiers.
        # if the image fails a classifier, we can stop attempting to detect a face.

# take an image of a front-facing person
# make grayscale
# search for eyes/cheek, then nose, then eyebrows, then lips
# see if image passes all classifiers

# load image
fp1 = '../path/to/pic/filename1.jpg'
img1 = cv2.imread(fp1, 0)
# import classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def detect_face(img):
    img1 = img.copy()
    face_rectangles = face_cascade.detectMultiScale(img1) # scaleFactor=1.2, minNeighbors=5
    for (x,y,w,h) in face_rectangles:
        cv2.rectangle(img=img1, pt1=(x,y), pt2=(x+w,y+h), color=(255,255,255), thickness=10)
    return img1

img2 = detect_face(img1)
plt.imshow(img2, cmap='gray')

# -------------
# OpenCV (object tracking) (video)
# -------------

# optical flow -- the pattern of apparent motion of image objects between two consecutive frames (caused by camera/object movement)
# skipped this section

# -------------
# OpenCV (deep learning and computer vision)
# -------------

# keras basics
# MNIST data overview
# convolutional neural network theory
# keras CNN


# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



# -------------
# 
# -------------



