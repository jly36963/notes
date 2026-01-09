# Scala Notes

- [getting started](https://docs.scala-lang.org/getting-started/install-scala.html)
- [vscode plugin](https://scalameta.org/metals/docs/editors/vscode/)
- [scalafmt](https://scalameta.org/scalafmt/)

## Setup

```sh
# Install
brew install coursier && coursier setup
```

## Tools

- [zio](https://zio.dev/)
- [spark](https://github.com/apache/spark)
  - [spark](https://spark.apache.org/docs/latest/quick-start.html)
  - [spark mllib](https://spark.apache.org/mllib/)
- [circe](https://circe.github.io/circe/)

## Cleanup

- After moving directory, running project will generate build files in old location
  - remove `.bsp` directory, which points to the old location
