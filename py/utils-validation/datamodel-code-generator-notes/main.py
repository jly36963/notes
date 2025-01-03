"""Convert graphql schema to pydantic models."""

# ruff: noqa: E501

import json
import os
from pathlib import Path
from typing import TypeVar

from datamodel_code_generator import DataModelType, InputFileType, generate
from graphql import (
    DefinitionNode,
    DirectiveDefinitionNode,
    DocumentNode,
    EnumTypeDefinitionNode,
    GraphQLSchema,
    ScalarTypeDefinitionNode,
    ast_to_dict,
    build_ast_schema,
    concat_ast,
    parse,
    print_schema,
    validate_schema,
)

# ---
# Constants
# ---

MAX_RECURSION_DEPTH = 8

# ---
# Constants (directories/files)
# ---

DATA_DIR = Path("data")

INPUT_DIR = DATA_DIR / "input"
GRAPHQL_DIR = INPUT_DIR / "graphql"

OUTPUT_DIR = DATA_DIR / "output"
MERGED_SCHEMA_FP = OUTPUT_DIR / "schema.gql"
MERGED_SCHEMA_FP2 = OUTPUT_DIR / "schema.json"
MODELS_FP = OUTPUT_DIR / "models.py"

# ---
# Main
# ---


def main():
    """Get graphql files, read/parse/merge, create gql schema, generate models."""
    setup()
    graphql_filepaths = get_gql_files(GRAPHQL_DIR)
    schema = merge_gql_files(graphql_filepaths)
    if schema is None:
        raise RuntimeError("No schema")
    schema_str = print_schema(schema)
    write_to_file(MERGED_SCHEMA_FP, schema_str)
    generate_models(schema_str)


# ---
# Utils
# ---

T = TypeVar("T")


def pick(dict_: dict, keys: list) -> dict:
    """Pick keys from a dict."""
    return {k: dict_[k] for k in keys if k in dict_}


def first(input_list: list[T]) -> T | None:
    """Return the first item in a list, returns None if empty."""
    if len(input_list) == 0:
        return None
    return input_list[0]


def read_file(fp: Path) -> str:
    """Read a file (completely) to string."""
    with Path.open(fp) as f:
        return f.read()


def write_to_file(fp: Path, contents: str):
    """Write a string to file."""
    with Path.open(fp, mode="w", encoding="utf-8") as f:
        f.write(contents)


def pipe(value, *funcs):
    """Unary piping."""
    for func in funcs:
        value = func(value)
    return value


# ---
# Steps
# ---


def setup():
    """Make sure directories exist."""
    for d in [DATA_DIR, INPUT_DIR, OUTPUT_DIR, GRAPHQL_DIR]:
        Path.mkdir(Path(d), parents=True, exist_ok=True)


def get_gql_files(root_dir: Path) -> list[Path]:
    """Recursively search a directory for graphql files."""

    def recursively_get_gql_files(
        current_path: Path,
        current_depth: int,
    ) -> list[Path]:
        """Inner recursive function."""
        results: list[Path] = []

        if current_depth > MAX_RECURSION_DEPTH:
            raise RuntimeError("Recursion limit exceeded")

        for item_fn in sorted(os.listdir(current_path)):
            item_path = Path(current_path) / item_fn
            # Dir
            if item_path.is_dir():
                # Recurse deeper
                current_results = recursively_get_gql_files(
                    item_path,
                    current_depth + 1,
                )
                results.extend(current_results)
            # File
            if item_fn.endswith((".gql", ".graphql")):
                # Append current
                results.append(item_path)
        return results

    return recursively_get_gql_files(root_dir, 0)


def merge_gql_files(filepaths: list[Path]) -> GraphQLSchema | None:
    """Read in multiple graphql SDL (schema) files, parse, merge AST, return schema."""
    # Read each gql schema file and parse to DocumentNode
    document_nodes: list[DocumentNode] = []
    for fp in filepaths:
        contents = read_file(fp)
        document_node = parse(contents)
        document_nodes.append(document_node)
    if not document_nodes:
        return None

    # Might have similar/repeat definitions
    joined_document_node = concat_ast(document_nodes)
    write_to_file(
        MERGED_SCHEMA_FP2,
        json.dumps(ast_to_dict(joined_document_node), indent=2),
    )
    # Merge the similar/repeat definitions
    joined_document_node = merge_similar_definitions(joined_document_node)
    joined_document_node = strip_field_comments(joined_document_node)
    # Build schema from AST
    schema = build_ast_schema(
        joined_document_node,
        assume_valid=True,
        assume_valid_sdl=True,
    )
    errors = validate_schema(schema)
    if errors:
        msg = f"Errors during schema validation: {errors}"
        raise RuntimeError(msg)
    return schema


def merge_similar_definitions(document_node: DocumentNode) -> DocumentNode:
    """Merge similar definitions to prevent separate Query/Mutation/etc from overwriting."""
    # DefinitionNode: kind, description, name, directives, interfaces, fields
    def_map: dict[str, DefinitionNode] = {}
    for curr_def in document_node.definitions:
        key = f"{curr_def.name.kind}:{curr_def.name.value}"  # type: ignore
        if key in def_map:
            existing = def_map[key]
            existing.directives = existing.directives + curr_def.directives  # type: ignore
            existing.interfaces = existing.interfaces + curr_def.interfaces  # type: ignore
            existing.fields = existing.fields + curr_def.fields  # type: ignore
            def_map[key] = existing
        else:
            def_map[key] = curr_def

    document_node.definitions = tuple(def_map.values())
    return document_node


def strip_field_comments(document_node: DocumentNode) -> DocumentNode:
    """Remove field comments (to make types simpler)."""
    for curr_def in document_node.definitions:
        if isinstance(
            curr_def,
            ScalarTypeDefinitionNode | DirectiveDefinitionNode | EnumTypeDefinitionNode,
        ):
            # Skip node if no 'field' attr
            continue
        fields: list = curr_def.fields  # type: ignore
        for field in fields:
            if field.description:
                field.description = None
    return document_node


def generate_models(gql_schema: str) -> None:
    """Convert a graphql schema string into pydantic v1 models."""
    # datamodel-codegen --input schema.graphql --input-file-type graphql --output model.py
    generate(
        gql_schema,
        input_file_type=InputFileType.GraphQL,
        output=Path(MODELS_FP),
        output_model_type=DataModelType.PydanticBaseModel,
    )


# ---
# Run
# ---

main()

# ---
# Notes
# ---

# Graphql utils:

# build_schema: creates GraphQLSchema
# extend_schema: adds DocumentNode to GraphQLSchema
# parse: creates DocumentNode
# print_schema: GraphQLSchema -> str
# validate_schema: parses GraphQLSchema, returns parsing errors
