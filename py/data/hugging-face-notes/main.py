"""Hugging face examples."""

from pathlib import Path
from typing import TypedDict, cast

import pandas as pd
import torch
from diffusers import (
    DiffusionPipeline,  # type: ignore [reportPrivateImportUsage]
    StableDiffusionPipeline,  # type: ignore [reportPrivateImportUsage]
    StableDiffusionUpscalePipeline,  # type: ignore [reportPrivateImportUsage]
)
from PIL import Image
from transformers import (
    BatchEncoding,
    MBart50TokenizerFast,
    MBartForConditionalGeneration,
    SummarizationPipeline,
    TextClassificationPipeline,
    TextGenerationPipeline,
    TranslationPipeline,
    pipeline,
)

# Model caching: https://huggingface.co/docs/datasets/en/cache

# ---
# Constants
# ---

DATA_DIR = Path("data")
INPUT_DIR = DATA_DIR / "input"
OUTPUT_DIR = DATA_DIR / "output"

SKIP_EXPENSIVE_COMPUTE = True

# ---
# Main
# ---


def main():
    """Run HF examples."""
    _setup()

    examples = {
        # # Transfomer
        "text classification basics": _text_classification_basics,
        "text generation basics": _text_generation_basics,
        "translation basics": _translation_basics,
        "translation custom": _translation_custom,
        "summarization basics": _summarization_basics,
        # # Diffuser
        "diffusion basics": _diffusion_basics,
        "diffusion upscale": _diffusion_upscale,
    }

    for title, example_fn in examples.items():
        print_section_title(title)
        example_fn()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print(f"# {string.upper()}")
    print("# ---\n")


def pretty_print_results(results: dict) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        match v:
            case pd.Series():
                print(k, type(v), v.to_list(), sep="\n")
                print()
            case _:
                print(k, type(v), v, sep="\n")
                print()


def get_input_path(filename: str) -> Path:
    """Get path to input file."""
    return INPUT_DIR / filename


def get_output_path(filename: str) -> Path:
    """Get path to output file."""
    return OUTPUT_DIR / filename


# ---
# Examples
# ---


def _setup():
    for d in [DATA_DIR, INPUT_DIR, OUTPUT_DIR]:
        Path.mkdir(d, parents=True, exist_ok=True)

    print("Setup complete")


def _text_classification_basics():
    class Result(TypedDict):
        """A text-classification result."""

        label: str
        score: float

    text_classification_pipeline = cast(
        TextClassificationPipeline,
        pipeline(
            task="text-classification",
            model="distilbert/distilbert-base-uncased-finetuned-sst-2-english",
            revision="714eb0f",
            device="cpu",
        ),
    )
    inputs: list[str] = [
        "Is mayonnaise an instrument?",
        "Patrick, go be stupid somewhere else!",
        "But it looks good on you, Spongebob!",
    ]
    results = cast(
        list[Result],
        text_classification_pipeline(inputs),
    )

    for val, result in zip(inputs, results, strict=True):
        print(val)
        print(result)


def _text_generation_basics():
    class Result(TypedDict):
        """A text-generation result."""

        generated_text: str

    text_gen_pipeline = cast(
        TextGenerationPipeline,
        pipeline(
            task="text-generation",
            model="openai-community/gpt2",
            revision="607a30d",
            device="cpu",
        ),
    )
    values: list[str] = [
        "The square root of a flexnart is a cupful of ",  # boogers
        "The inner machinations of my mind are an ",  # enigma
    ]
    results = cast(
        list[Result],
        text_gen_pipeline(values, do_sample=False),
    )
    for value, result in zip(values, results, strict=True):
        print(value)
        print(result)


def _translation_basics():
    class Result(TypedDict):
        """A translation result."""

        translation_text: str

    translation_pipeline = cast(
        TranslationPipeline,
        pipeline(
            task="translation_en_to_es",
            model="Helsinki-NLP/opus-mt-tc-big-en-es",
            device="cpu",
        ),
    )
    values: list[str] = [
        "No one can know, not even Squidward's house.",
        "Where's the leak, ma'am?",
    ]
    results = cast(
        list[Result],
        translation_pipeline(values),
    )
    for val, result in zip(values, results, strict=True):
        print(val)
        print(result)


def _translation_custom():
    model_name = "Narrativa/mbart-large-50-finetuned-opus-en-pt-translation"
    tokenizer = cast(
        MBart50TokenizerFast, MBart50TokenizerFast.from_pretrained(model_name)
    )
    tokenizer.src_lang = "en_XX"
    model = cast(
        MBartForConditionalGeneration,
        MBartForConditionalGeneration.from_pretrained(model_name),
    )

    def translate(text: str) -> str:
        batch_encoding = cast(BatchEncoding, tokenizer(text, return_tensors="pt"))
        input_ids = cast(torch.Tensor, batch_encoding.input_ids)
        attention_mask = cast(torch.Tensor, batch_encoding.attention_mask)
        result = cast(
            torch.Tensor,
            model.generate(
                input_ids,
                attention_mask=attention_mask,
            ),
        )
        return tokenizer.decode(result[0], skip_special_tokens=True)

    values: list[str] = [
        "No one can know, not even Squidward's house.",
        "Squidward, your ceiling is talking to me!",
    ]
    results = [translate(v) for v in values]
    for value, result in zip(values, results, strict=True):
        print(value)
        print(result)


def _summarization_basics():
    class Result(TypedDict):
        """A summarization result."""

        summary_text: str

    summarization_pipeline = cast(
        SummarizationPipeline,
        pipeline(
            task="summarization",
            model="sshleifer/distilbart-cnn-12-6",
            revision="a4f8f3e",
            device="cpu",
        ),
    )

    def summarize(text: str) -> str:
        word_count = len(text.split())
        min_length = word_count // 4
        max_length = word_count // 2

        results = cast(
            list[Result],
            summarization_pipeline(
                text,
                min_length=min_length,
                max_length=max_length,
            ),
        )
        return results[0]["summary_text"]

    illusion_text = (
        "In order to survive, we cling to all we know and understand. "
        "And label it reality. "
        "But knowledge and understanding are ambiguous. "
        "That reality could be an illusion. "
        "All humans live with the wrong assumptions."
        "\n\n"
        "Each of us lives, dependent, and "
        "bound by our individual knowledge and our awareness. "
        "All that is what we call 'reality'. "
        "However, both knowledge and awareness are equivocal. "
        "One's reality might be another's illusion. "
        "We all live inside our own fantasies."
    )

    values: list[str] = [illusion_text]
    results = [summarize(v) for v in values]
    for val, result in zip(values, results, strict=True):
        print(val)
        print(result)


def _diffusion_basics():
    if SKIP_EXPENSIVE_COMPUTE:
        print("...")
        return

    model_name = "stable-diffusion-v1-5/stable-diffusion-v1-5"
    diffusion_pipeline = cast(
        StableDiffusionPipeline,
        DiffusionPipeline.from_pretrained(model_name, use_safetensors=True),
    )

    values: list[str] = ["A starfish in Picasso style."]

    def get_image(text: str):
        result = diffusion_pipeline(text)
        return result

    results = [get_image(v) for v in values]

    for val, result in zip(values, results, strict=True):
        print(val)
        print(type(result))


def _diffusion_upscale():
    if SKIP_EXPENSIVE_COMPUTE:
        print("...")
        return

    model_name = "stabilityai/stable-diffusion-x4-upscaler"
    model_revision = "fp16"
    upscale_pipeline = cast(
        StableDiffusionUpscalePipeline,
        StableDiffusionUpscalePipeline.from_pretrained(
            model_name,
            variant=model_revision,
            torch_dtype=torch.float32,
        ),
    )

    def upscale_image(
        prompt: str,
        input_fp: Path,
        output_fp: Path,
    ):
        img = Image.open(str(input_fp)).convert("RGB")
        img_upscaled = upscale_pipeline(prompt=prompt, image=img).images[0]  # type: ignore
        img_upscaled.save(output_fp)

    input_fp = Path(get_input_path("polaris.jpg"))
    output_fp = Path(get_output_path("polaris.jpg"))
    upscale_image("A cool colored pattern", input_fp, output_fp)


# ---
# Run
# ---

main()

# ---
# Notes (pydantic)
# ---

# from pydantic import BaseModel, StrictStr, TypeAdapter


# class Result(BaseModel):
#     """A text-classification result."""

#     label: StrictStr
#     score: float

# results_type_adapter = TypeAdapter(list[Result])

# pipe = pipeline(
#     task="text-classification",
#     model="distilbert/distilbert-base-uncased-finetuned-sst-2-english",
#     revision="714eb0f",
#     device="cpu",
# )
# inputs: list[str] = [
#     "Is mayonnaise an instrument?",
#     "Patrick, go be stupid somewhere else!",
#     "But it looks good on you, Spongebob!",
# ]

# results = results_type_adapter.validate_python(pipe(inputs))
