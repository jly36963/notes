// ------------
// react native paper
// ------------

// npm i --save react-native-paper react-native-vector-icons

// ------------
// remove unnecessary components
// ------------

module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
};

// ------------
// provider for RNP
// ------------

// provides theme to all components in the framework

// theme -- https://github.com/callstack/react-native-paper/blob/master/src/styles/DefaultTheme.tsx

import * as React from "react";
import { AppRegistry } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { name as appName } from "./app.json";
import App from "./src/App";

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);

// ------------
// override theme
// ------------

import * as React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import App from "./src/App";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    accent: "yellow",
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

// ------------
// extend theme
// ------------

import * as React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import App from "./src/App";

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    myOwnColor: "#BADA55",
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

// ------------
// use theme in component
// ------------

// HOC

import * as React from "react";
import { withTheme } from "react-native-paper";

function MyComponent(props) {
  const { colors } = props.theme;
  return <Text style={{ color: colors.primary }}>Yo!</Text>;
}

export default withTheme(MyComponent);

// hook

import * as React from "react";
import { useTheme } from "react-native-paper";

function MyComponent(props) {
  const { colors } = useTheme();
  return <Text style={{ color: colors.primary }}>Yo!</Text>;
}

export default MyComponent;

// ------------
// icons
// ------------

// RNVI
<Button icon="camera">Press me</Button>;

// source (remote)
<Button
  icon={{ uri: "https://avatars0.githubusercontent.com/u/17571969?v=3&s=400" }}
>
  Press me
</Button>;

// source (local)
<Button icon={require("../assets/chameleon.jpg")}>Press me</Button>;

// ------------
// fonts
// ------------

// https://callstack.github.io/react-native-paper/fonts.html

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------
