# Kotlin

- [basic syntax](https://kotlinlang.org/docs/basic-syntax.html)

## CLI

```sh
# install
brew update
brew install kotlin

# install linter (3rd party)
brew install ktlint

# Format
ktlint --format

# Compile
kotlinc <input-file> -include-runtime -d <output-file>
# Run
java -jar <output-file>
# Run script (.kts)
kotlin --script  <script-file>
```
