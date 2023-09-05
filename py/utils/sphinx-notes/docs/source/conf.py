# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Sphinx notes'
copyright = '2023, jly'
author = 'jly'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    # 'sphinx.ext.autodoc',  # Include documentation from docstrings
    'autoapi.extension',  # Alternative to autodoc (static analysis)
    'sphinx.ext.autosectionlabel',  # Allow reference sections using its title
    'sphinx.ext.autosummary',  # Generate autodoc summaries
    'sphinx.ext.viewcode',  # Add links to highlighted source code
    'myst_parser',  # Support for Markdown
    # 'sphinx.ext.napoleon',  # Support for NumPy and Google style docstrings
]

templates_path = ['_templates']
exclude_patterns = ['_old_rst/*.rst']
autoapi_dirs = ['../../src/']

# TODO
# html_sidebars = {}

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'pydata_sphinx_theme'  # 'furo'  # 'alabaster'
html_static_path = ['_static']

language = 'en'  # 'pt'
