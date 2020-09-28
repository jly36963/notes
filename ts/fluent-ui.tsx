// -------------
// fluent ui
// -------------

// install
// npm i --save @fluentui/react

// SSR (next.js)
// https://github.com/microsoft/fluentui/wiki/Server-side-rendering-and-browserless-testing

// fabric docs
// https://docs.microsoft.com/en-us/javascript/api/office-ui-fabric-react?view=office-ui-fabric-react-latest

// customize font
// https://github.com/microsoft/fluentui/wiki/Customizing-fonts

// -------------
// component styling
// -------------

// https://github.com/microsoft/fluentui/wiki/Component-Styling

// -------------
// the fabric component
// -------------

// https://github.com/microsoft/fluentui/wiki/The-Fabric-Component

import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import * as React from "react";
import MyComponent from "./my-component";

export const App = () => {
  return (
    <Fabric>
      <MyComponent />
    </Fabric>
  );
};

// -------------
// apply fabric theme
// -------------

// Customizer -- HOC

import { Customizer } from "office-ui-fabric-react";
import { FluentCustomizations } from "@uifabric/fluent-theme";

const MyApp = () => {
  return (
    <Customizer {...FluentCustomizations}>
      <Stack>
        <div>Hello!</div>
      </Stack>
    </Customizer>
  );
};

export default MyApp;

// loadTheme

import { loadTheme } from "office-ui-fabric-react";

loadTheme({
  palette: {
    themePrimary: "#0078d4",
    themeLighterAlt: "#eff6fc",
    themeLighter: "#deecf9",
    themeLight: "#c7e0f4",
    themeTertiary: "#71afe5",
    themeSecondary: "#2b88d8",
    themeDarkAlt: "#106ebe",
    themeDark: "#005a9e",
    themeDarker: "#004578",
    neutralLighterAlt: "#f8f8f8",
    neutralLighter: "#f4f4f4",
    neutralLight: "#eaeaea",
    neutralQuaternaryAlt: "#dadada",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c8c8",
    neutralTertiary: "#c2c2c2",
    neutralSecondary: "#858585",
    neutralPrimaryAlt: "#4b4b4b",
    neutralPrimary: "#333333",
    neutralDark: "#272727",
    black: "#1d1d1d",
    white: "#ffffff",
  },
});

// customize one fabric control instance (where do I import interfaces from)

import {
  Stack,
  PrimaryButton,
  TextField,
} from "office-ui-fabric-react/lib/Stack";

const MyControl = () => {
  const buttonStyles = {
    root: { backgroundColor: "maroon" },
    rootHovered: { background: "green" },
  };

  const textFieldStyles = (
    props: ITextFieldStyleProps
  ): Partial<ITextFieldStyles> => ({
    ...(props.focused && {
      field: {
        backgroundColor: "#c7e0f4",
      },
    }),
  });

  return (
    <Stack>
      <Stack.Item>
        <TextField
          placeholder="What needs to be done?"
          styles={textFieldStyles}
        />
      </Stack.Item>
      <PrimaryButton styles={buttonStyles}>Add</PrimaryButton>
    </Stack>
  );
};

export default MyControl;

// css-in-js (mergestyles)

import { mergeStyles } from "@uifabric/merge-styles"; // also `office-ui-fabric-react`

const MyDiv = () => {
  const blueBackgroundClassName = mergeStyles({
    backgroundColor: "green",
  });
  const className = mergeStyles(blueBackgroundClassName, {
    padding: 50, // px is assumed if no units are given
    selectors: {
      ":hover": {
        backgroundColor: "red",
      },
    },
  });

  return (
    <div className={className}>I am a green div that turns red on hover!</div>
  );
};
