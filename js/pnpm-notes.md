# PNPM

```sh
# Install pnpm (posix)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Install all dependencies
pnpm install
# Install a dependency
pnpm add <package>
# Install a devDependency
pnpm add -D <package>
# Install a specific version
pnpm add <package>@<semver>

# Run a command
pnpm <command>

# Update deps (adheres to ranges in package.json)
pnpm up
# Update deps (to latest)
pnpm up --latest
# Update a dep
pnpm up <package>@<version>

# Remove a dependency
pnpm remove <package>

# Link/unlink
# TODO

# Import a lockfile (converts npm/yarn lockfile to pnpm-lock.yaml)
pnpm import
```
