# Reason

## Installation

```sh
# Install opam (package manager)
brew install opam
# Set up
opam init -y
# Add to path
eval $(opam env)
# Create switch
opam switch create . 5.1.0 --deps-only
# Install reason
opam install reason
# Install dune (build system)
opam install dune
# Install language server
opam install ocaml-lsp-server
```

Use the `vscode-ocaml-platform` plugin for VSCode.

## Notes
