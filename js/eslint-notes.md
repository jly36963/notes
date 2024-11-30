# Eslint

- Docs: https://eslint.org/docs/latest/
- Vscode extension: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

## Example config (Extends gts)

.eslintrc.json

```json
{
  "extends": "./node_modules/gts/",
  "overrides": [
    {
      "files": ["**/*.ts", "**/*.tsx"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```
