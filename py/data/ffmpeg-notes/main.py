"""ffmpeg examples."""

import os

import ffmpeg

# ---
# Constants
# ---

HOME = os.path.expanduser("~")
DATA_DIR = os.path.join(".", "data")
INPUT_DIR = os.path.join(DATA_DIR, "input")
OUTPUT_DIR = os.path.join(DATA_DIR, "output")
VID_FN = "video.mp4"

# ---
# Main
# ---


def main():
    """ffmpeg examples."""
    print_section_title("setup")
    setup()

    print_section_title("basic probe")
    basic_probe()

    print_section_title("basic import/export")
    basic_import_export()

    print_section_title("basic encode")
    basic_encode()

    print_section_title("basic flip")
    basic_flip()

    print_section_title("basic crop")
    basic_crop()

    print_section_title("basic hue")
    basic_hue()

    print_section_title("basic trim")
    basic_trim()

    print_section_title("basic pad")
    basic_pad()

    print_section_title("basic transpose")
    basic_transpose()

    print_section_title("basic rotate")
    basic_rotate()

    print_section_title("basic pad and rotate")
    basic_pad_and_rotate()


# ---
# Examples
# ---


def setup():
    """Do setup before running examples."""
    for d in [DATA_DIR, INPUT_DIR, OUTPUT_DIR]:
        os.makedirs(d, exist_ok=True)
    print("...")


def basic_import_export():
    """Import and export a file"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("video.mp4")

    ffmpeg.input(input_path).output(output_path).run(overwrite_output=True)


def basic_probe():
    """Probe a file"""
    input_path = os.path.join(INPUT_DIR, VID_FN)

    res = ffmpeg.probe(input_path)
    print("filename:", res["format"]["filename"])
    print("duration:", res["format"]["duration"])
    print("width", res["streams"][0]["width"])
    print("height", res["streams"][0]["height"])


def basic_encode():
    """Convert from mp4 to webm"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("re-encoded.webm")

    ffmpeg.input(input_path).output(output_path).run(overwrite_output=True)


def basic_flip():
    """Flip video"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("flipped.mp4")

    s = ffmpeg.input(input_path)
    s.video.hflip().output(s.audio, output_path).run(overwrite_output=True)


def basic_crop():
    """Crop video"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("cropped.mp4")

    res = ffmpeg.probe(input_path)

    # Remove b px from top/bottom/left/right
    w = res["streams"][0]["width"]
    h = res["streams"][0]["height"]
    b = 50
    config = {"x": b, "y": b, "width": w - 2 * b, "height": h - 2 * b}

    s = ffmpeg.input(input_path)
    s.video.crop(**config).output(s.audio, output_path).run(overwrite_output=True)


def basic_hue():
    """Brighten video using hue"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("brightened.mp4")

    s = ffmpeg.input(input_path)
    s.video.hue(b=2).output(s.audio, output_path).run(overwrite_output=True)


def basic_trim():
    """Trim video"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("trimmed.mp4")

    trim_config = {"start": "00:00:01", "end": "00:00:02"}

    s = ffmpeg.input(input_path)
    sa = s.audio.filter("atrim", **trim_config).filter("asetpts", "PTS-STARTPTS")
    sv = s.video.filter("trim", **trim_config).filter("setpts", "PTS-STARTPTS")
    ffmpeg.output(sa, sv, output_path).run(overwrite_output=True)


def basic_pad():
    """Add padding to video"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("padded.mp4")

    res = ffmpeg.probe(input_path)
    w = res["streams"][0]["width"]
    h = res["streams"][0]["height"]

    b = 0.3 * min(w, h)

    pad_config = {"w": w + b, "h": h + b, "x": b / 2, "y": b / 2, "color": "black"}

    s = ffmpeg.input(input_path)
    s.video.filter("pad", **pad_config).output(s.audio, output_path).run(
        overwrite_output=True
    )


def basic_transpose():
    """Transpose video"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("transposed.mp4")

    s = ffmpeg.input(input_path)
    s.video.filter("transpose", 1).output(s.audio, output_path).run(
        overwrite_output=True
    )


def basic_rotate():
    """Rotate video by 45 degrees"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("rotated.mp4")

    s = ffmpeg.input(input_path)
    s.video.filter("rotate", "PI/4").output(s.audio, output_path).run(
        overwrite_output=True
    )


def basic_pad_and_rotate():
    """Pad and rotate video"""
    input_path = os.path.join(INPUT_DIR, VID_FN)
    output_path = get_output_path("padded_and_rotated.mp4")

    res = ffmpeg.probe(input_path)
    w = res["streams"][0]["width"]
    h = res["streams"][0]["height"]

    # Reversed because the smaller dimension needs to grow more
    dw = h * 0.3
    dh = w * 0.3

    pad_config = {"w": w + dw, "h": h + dh, "x": dw / 2, "y": dh / 2, "color": "black"}

    s = ffmpeg.input(input_path)
    (
        s.video.filter("pad", **pad_config)
        .filter("rotate", "PI/4")
        .output(s.audio, output_path)
        .run(overwrite_output=True)
    )


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Uppercase and newline wrap a string."""
    print(f"\n{string.upper()}\n")


def get_output_path(filename: str) -> str:
    """Get path to input file"""
    return os.path.join(OUTPUT_DIR, filename)


# ---
# Run
# ---

if __name__ == "__main__":
    main()
