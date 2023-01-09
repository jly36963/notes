# Ruby

## Installation

### Runtime

- install rvm
  - https://rvm.io/rvm/install
- install ruby version
  - https://rvm.io/rubies/installing

```bash
# Install RVM
curl -sSL https://get.rvm.io | bash

# Check `~/.zshrc` to verify PATH append
# Re-open terminal (or `source`)

# Install ruby version
rvm install 3.2
```

### Bundler

```bash
gem install bundler
```

## Start new project

```bash
bundle init
```

## IDE

### Intellisense

```bash
gem install solargraph
```

### Formatting

- https://github.com/ruby-formatter/rufo
  - less config
- https://github.com/rubocop/rubocop
  - more popular

```bash
# Install rubocop
gem install rubocop
# Install rufo
gem install rufo
```

### Type checking

- https://sorbet.org/

Add the following to Gemfile

```
gem "sorbet", :group => :development
gem "sorbet-runtime"
```

```bash
# Sorbet requires watchman
brew install watchman
# Install sorbet
bundle install
# Initialize sorbet in project
srb init
# Check types
srb tc
```

### Vscode

install plugins:

- ruby (shopify)
- sorbet (typing support)
- solargraph (intellisense)
- rubocop

```json
{
  "sorbet.enabled": true, // does not support multi-root workspaces
  "[ruby]": {
    "editor.defaultFormatter": "misogi.ruby-rubocop",
    "editor.formatOnSave": true,
    "editor.formatOnType": true,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.semanticHighlighting.enabled": true
  }
}
```
