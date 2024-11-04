"""Pillow notes."""

import os

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageFilter

DATA_DIR = os.path.join('.', 'data')
INPUT_DIR = os.path.join(DATA_DIR, 'input')
OUTPUT_DIR = os.path.join(DATA_DIR, 'output')

POLARIS_FN = 'tesseract-polaris.jpg'

# TODO:
# thresholding
# dilate/erode
# segmentation


def main():
    print_section_title('basic_metadata')
    basic_metadata()

    print_section_title('basic_crop')
    basic_crop()

    print_section_title('basic_resize')
    basic_resize()

    print_section_title('basic_reduce')
    basic_reduce()

    print_section_title('basic_transpose')
    basic_transpose()

    print_section_title('basic_rotate')
    basic_rotate()

    print_section_title('basic_convert')
    basic_convert()

    print_section_title('basic_filter')
    basic_filter()

    print_section_title('basic_edges')
    basic_edges()

# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def get_input_fp(filename: str) -> str:
    return os.path.join(INPUT_DIR, filename)


def get_output_fp(filename: str) -> str:
    return os.path.join(OUTPUT_DIR, filename)

# ---
# Examples
# ---


def basic_metadata():
    img = Image.open(get_input_fp(POLARIS_FN))
    print({
        "format": img.format,
        "size": img.size,
        "mode": img.mode
    })


def basic_crop():
    img = Image.open(get_input_fp(POLARIS_FN))

    border = 10
    length = img.size[0]

    img = img.crop((10, 10, length - border, length - border))
    img.save(get_output_fp('cropped.jpg'))


def basic_resize():
    img = Image.open(get_input_fp(POLARIS_FN))

    img = img.resize((256, 256))
    img.save(get_output_fp('resized.jpg'))


def basic_reduce():
    img = Image.open(get_input_fp(POLARIS_FN))

    img = img.reduce(2)
    img.save(get_output_fp('reduced.jpg'))


def basic_transpose():
    img = Image.open(get_input_fp(POLARIS_FN))

    img = img.transpose(Image.FLIP_TOP_BOTTOM)
    img.save(get_output_fp('transposed.jpg'))


def basic_rotate():
    img = Image.open(get_input_fp(POLARIS_FN))

    img = img.rotate(-45, expand=True)  # Degrees, counter-clockwise
    img.save(get_output_fp('rotated.jpg'))


def basic_convert():
    img = Image.open(get_input_fp(POLARIS_FN))

    img = img.convert('CMYK')  # Re-encoded as CMYK, used for printing
    img.save(get_output_fp('converted.jpg'))

    bands = img.split()  # Tuple of bands (3 for RGB, 4 or CMYK)
    cyan_band = bands[0]
    cyan_band.save(get_output_fp('split.jpg'))


def basic_filter():
    img = Image.open(get_input_fp(POLARIS_FN))
    img = img.filter(ImageFilter.BLUR)  # BoxBlur, GaussianBlur
    img.save(get_output_fp('blurred.jpg'))

    img = Image.open(get_input_fp(POLARIS_FN))
    img = img.filter(ImageFilter.SHARPEN)
    img.save(get_output_fp('sharpened.jpg'))

    img = Image.open(get_input_fp(POLARIS_FN))
    img = img.filter(ImageFilter.SMOOTH)
    img.save(get_output_fp('smoothed.jpg'))


def basic_edges():
    img = Image.open(get_input_fp(POLARIS_FN))
    img = img.convert('L')  # Convert to grayscale

    img_edges = img.filter(ImageFilter.FIND_EDGES)
    img_edges.save(get_output_fp('edges.jpg'))

    img_blurred = img.filter(ImageFilter.BLUR)
    img_blurred_edges = img_blurred.filter(ImageFilter.FIND_EDGES)
    img_blurred_edges.save(get_output_fp('edges(pre-blurred).jpg'))

    img_sharpened = img.filter(ImageFilter.SHARPEN)
    img_sharpened_edges = img_sharpened.filter(ImageFilter.FIND_EDGES)
    img_sharpened_edges.save(get_output_fp('edges(pre-sharpened).jpg'))

    img_embossed = img.filter(ImageFilter.SMOOTH).filter(ImageFilter.EMBOSS)
    img_embossed.save(get_output_fp('embossed.jpg'))


def basic_pillow():
    # PLOT IMAGE
    # open image
    fp1 = '../path/to/pic/filename.jpg'
    img1 = Image.open(fp1)  # relative or absolute
    # check type
    print(type(img1))  # PIL.JpegImagePlugin.JpegImageFile
    # convert to array
    img_arr1 = np.asarray(img1)
    # info about array
    print(img_arr1.shape)  # (dimensions -- rows, cols, z) (rows, cols, bands)
    # plot array as image
    plt.imshow(img_arr1)

    # PLOT IMAGE (RED BAND)
    # get red band
    fp1 = '../path/to/pic/filename.jpg'
    img1 = Image.open(fp1)  # relative or absolute
    img_arr1 = np.asarray(img1)
    img_arr1_red = np.array(img_arr1[:, :, 0])
    # plot array as image (cmap -- set color ramp)
    plt.imshow(img_arr1_red, cmap='gray')

    # SET OTHER COLOR BANDS TO ZERO (RED BAND VALUES ONLY)
    fp1 = '../path/to/pic/filename.jpg'
    img1 = Image.open(fp1)
    img_arr1 = np.asarray(img1)
    img_arr1[:, :, 1:] = 0

# ---
# Main
# ---


if __name__ == '__main__':
    main()
