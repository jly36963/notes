# Prettier

- Docs: https://prettier.io/docs/en/
- Vscode extension: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

## Example config

.prettierrc.cjs

```cjs
// Extend gts
module.exports = {
  ...require("gts/.prettierrc.json"),
};
```
