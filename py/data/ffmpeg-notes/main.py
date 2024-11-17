"""ffmpeg examples."""

from pathlib import Path

import ffmpeg

# ---
# Constants
# ---

HOME = Path.expanduser(Path("~"))
DATA_DIR = Path("data")
INPUT_DIR = DATA_DIR / "input"
OUTPUT_DIR = DATA_DIR / "output"
INPUT_VID_FP = INPUT_DIR / "video.mp4"

# ---
# Main
# ---


def main():
    """Show ffmpeg examples."""
    print_section_title("setup")
    _setup()

    print_section_title("basic probe")
    _basic_probe()

    print_section_title("basic import/export")
    _basic_import_export()

    print_section_title("basic encode")
    _basic_encode()

    print_section_title("basic flip")
    _basic_flip()

    print_section_title("basic crop")
    _basic_crop()

    print_section_title("basic hue")
    _basic_hue()

    print_section_title("basic trim")
    _basic_trim()

    print_section_title("basic pad")
    _basic_pad()

    print_section_title("basic transpose")
    _basic_transpose()

    print_section_title("basic rotate")
    _basic_rotate()

    print_section_title("basic pad and rotate")
    _basic_pad_and_rotate()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Uppercase and newline wrap a string."""
    print(f"\n{string.upper()}\n")


# ---
# Examples
# ---


def _setup():
    """Do setup before running examples."""
    for d in [DATA_DIR, INPUT_DIR, OUTPUT_DIR]:
        Path.mkdir(d, parents=True, exist_ok=True)
    print("...")


def _basic_import_export():
    """Import and export a file."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "video.mp4"

    ffmpeg.input(input_path).output(str(output_path)).run(overwrite_output=True)


def _basic_probe():
    """Probe a file."""
    input_path = INPUT_VID_FP

    res = ffmpeg.probe(input_path)
    print("filename:", res["format"]["filename"])
    print("duration:", res["format"]["duration"])
    print("width", res["streams"][0]["width"])
    print("height", res["streams"][0]["height"])


def _basic_encode():
    """Convert from mp4 to webm."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "re-encoded.webm"

    ffmpeg.input(input_path).output(str(output_path)).run(overwrite_output=True)


def _basic_flip():
    """Flip video."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "flipped.mp4"

    s = ffmpeg.input(input_path)
    s.video.hflip().output(s.audio, str(output_path)).run(overwrite_output=True)


def _basic_crop():
    """Crop video."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "cropped.mp4"

    res = ffmpeg.probe(input_path)

    # Remove b px from top/bottom/left/right
    w = res["streams"][0]["width"]
    h = res["streams"][0]["height"]
    b = 50
    config = {"x": b, "y": b, "width": w - 2 * b, "height": h - 2 * b}

    s = ffmpeg.input(input_path)
    s.video.crop(**config).output(s.audio, str(output_path)).run(overwrite_output=True)


def _basic_hue():
    """Brighten video using hue."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "brightened.mp4"

    s = ffmpeg.input(input_path)
    s.video.hue(b=2).output(s.audio, str(output_path)).run(overwrite_output=True)


def _basic_trim():
    """Trim video."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "trimmed.mp4"

    trim_config = {"start": "00:00:01", "end": "00:00:02"}

    s = ffmpeg.input(input_path)
    sa = s.audio.filter("atrim", **trim_config).filter("asetpts", "PTS-STARTPTS")
    sv = s.video.filter("trim", **trim_config).filter("setpts", "PTS-STARTPTS")
    ffmpeg.output(sa, sv, str(output_path)).run(overwrite_output=True)


def _basic_pad():
    """Add padding to video."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "padded.mp4"

    res = ffmpeg.probe(input_path)
    w = res["streams"][0]["width"]
    h = res["streams"][0]["height"]

    b = 0.3 * min(w, h)

    pad_config = {"w": w + b, "h": h + b, "x": b / 2, "y": b / 2, "color": "black"}

    s = ffmpeg.input(input_path)
    (
        s.video.filter("pad", **pad_config)
        .output(s.audio, str(output_path))
        .run(overwrite_output=True)
    )


def _basic_transpose():
    """Transpose video."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "transposed.mp4"

    s = ffmpeg.input(input_path)
    (
        s.video.filter("transpose", 1)
        .output(s.audio, str(output_path))
        .run(overwrite_output=True)
    )


def _basic_rotate():
    """Rotate video by 45 degrees."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "rotated.mp4"

    s = ffmpeg.input(input_path)
    (
        s.video.filter("rotate", "PI/4")
        .output(s.audio, str(output_path))
        .run(overwrite_output=True)
    )


def _basic_pad_and_rotate():
    """Pad and rotate video."""
    input_path = INPUT_VID_FP
    output_path = OUTPUT_DIR / "padded_and_rotated.mp4"

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
        .output(s.audio, str(output_path))
        .run(overwrite_output=True)
    )


# ---
# Run
# ---

if __name__ == "__main__":
    main()
