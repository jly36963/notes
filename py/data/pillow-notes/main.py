"""Pillow notes."""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageFilter

DATA_DIR = Path("data")
INPUT_DIR = DATA_DIR / "input"
OUTPUT_DIR = DATA_DIR / "output"

POLARIS_FN = "tesseract-polaris.jpg"


def main():
    """Run PIL examples."""
    print_section_title("basic_metadata")
    _basic_metadata()

    print_section_title("basic_crop")
    _basic_crop()

    print_section_title("basic_resize")
    _basic_resize()

    print_section_title("basic_reduce")
    _basic_reduce()

    print_section_title("basic_transpose")
    _basic_transpose()

    print_section_title("basic_rotate")
    _basic_rotate()

    print_section_title("basic_convert")
    _basic_convert()

    print_section_title("basic_filter")
    _basic_filter()

    print_section_title("basic_edges")
    _basic_edges()

    # TODO:
    # thresholding
    # dilate/erode
    # segmentation


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase and wrap in new lines."""
    print(f"\n{string.upper()}\n")


def _get_input_fp(filename: str) -> Path:
    return INPUT_DIR / filename


def _get_output_fp(filename: str) -> Path:
    return OUTPUT_DIR / filename


# ---
# Examples
# ---


def _basic_metadata():
    img = Image.open(_get_input_fp(POLARIS_FN))
    print({"format": img.format, "size": img.size, "mode": img.mode})


def _basic_crop():
    img = Image.open(_get_input_fp(POLARIS_FN))

    border = 10
    length = img.size[0]

    img = img.crop((10, 10, length - border, length - border))
    img.save(_get_output_fp("cropped.jpg"))


def _basic_resize():
    img = Image.open(_get_input_fp(POLARIS_FN))

    img = img.resize((256, 256))
    img.save(_get_output_fp("resized.jpg"))


def _basic_reduce():
    img = Image.open(_get_input_fp(POLARIS_FN))

    img = img.reduce(2)
    img.save(_get_output_fp("reduced.jpg"))


def _basic_transpose():
    img = Image.open(_get_input_fp(POLARIS_FN))

    img = img.transpose(Image.FLIP_TOP_BOTTOM)  # type: ignore # pylint: disable=E1101
    img.save(_get_output_fp("transposed.jpg"))


def _basic_rotate():
    img = Image.open(_get_input_fp(POLARIS_FN))

    img = img.rotate(-45, expand=True)  # Degrees, counter-clockwise
    img.save(_get_output_fp("rotated.jpg"))


def _basic_convert():
    img = Image.open(_get_input_fp(POLARIS_FN))

    img = img.convert("CMYK")  # Re-encoded as CMYK, used for printing
    img.save(_get_output_fp("converted.jpg"))

    bands = img.split()  # Tuple of bands (3 for RGB, 4 or CMYK)
    cyan_band = bands[0]
    cyan_band.save(_get_output_fp("split.jpg"))


def _basic_filter():
    img = Image.open(_get_input_fp(POLARIS_FN))
    img = img.filter(ImageFilter.BLUR)  # BoxBlur, GaussianBlur
    img.save(_get_output_fp("blurred.jpg"))

    img = Image.open(_get_input_fp(POLARIS_FN))
    img = img.filter(ImageFilter.SHARPEN)
    img.save(_get_output_fp("sharpened.jpg"))

    img = Image.open(_get_input_fp(POLARIS_FN))
    img = img.filter(ImageFilter.SMOOTH)
    img.save(_get_output_fp("smoothed.jpg"))


def _basic_edges():
    img = Image.open(_get_input_fp(POLARIS_FN))
    img = img.convert("L")  # Convert to grayscale

    img_edges = img.filter(ImageFilter.FIND_EDGES)
    img_edges.save(_get_output_fp("edges.jpg"))

    img_blurred = img.filter(ImageFilter.BLUR)
    img_blurred_edges = img_blurred.filter(ImageFilter.FIND_EDGES)
    img_blurred_edges.save(_get_output_fp("edges(pre-blurred).jpg"))

    img_sharpened = img.filter(ImageFilter.SHARPEN)
    img_sharpened_edges = img_sharpened.filter(ImageFilter.FIND_EDGES)
    img_sharpened_edges.save(_get_output_fp("edges(pre-sharpened).jpg"))

    img_embossed = img.filter(ImageFilter.SMOOTH).filter(ImageFilter.EMBOSS)
    img_embossed.save(_get_output_fp("embossed.jpg"))


def _basic_pillow():
    # PLOT IMAGE
    # open image
    fp1 = "../path/to/pic/filename.jpg"
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
    fp1 = "../path/to/pic/filename.jpg"
    img1 = Image.open(fp1)  # relative or absolute
    img_arr1 = np.asarray(img1)
    img_arr1_red = np.array(img_arr1[:, :, 0])
    # plot array as image (cmap -- set color ramp)
    plt.imshow(img_arr1_red, cmap="gray")

    # SET OTHER COLOR BANDS TO ZERO (RED BAND VALUES ONLY)
    fp1 = "../path/to/pic/filename.jpg"
    img1 = Image.open(fp1)
    img_arr1 = np.asarray(img1)
    img_arr1[:, :, 1:] = 0


# ---
# Main
# ---


if __name__ == "__main__":
    main()
