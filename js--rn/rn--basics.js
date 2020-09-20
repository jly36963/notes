// ------------
// react native
// ------------

// initialization
// npx react-native init MyApp

// start (port 8081)
// npx react-native start

// ------------
// hello world
// ------------

// use react native components, not html
//

import React from "react";
import { Text, View } from "react-native";

const HelloWorldApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello, world!</Text>
    </View>
  );
};
export default HelloWorldApp;

// ------------
// props, stylesheet
// ------------

import React from "react";
import { Text, View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
  },
});

const Greeting = (props) => {
  return (
    <View style={styles.center}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
};

const LotsOfGreetings = () => {
  return (
    <View style={[styles.center, { top: 50 }]}>
      <Greeting name="Rexxar" />
      <Greeting name="Jaina" />
      <Greeting name="Valeera" />
    </View>
  );
};

// ------------
// state (hooks), onPress
// ------------

import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <View styles={styles.container}>
      <Text>Count: {count}</Text>
      <Button onPress={() => setCount(count + 1)} title="+" />
      <Button onPress={() => setCount(count - 1)} title="-" />
      <Button onPress={() => setCount(0)} title="Reset" />
    </View>
  );
};

// ------------
// components
// ------------

// View (div) -- non scrolling, supports flexbox, touch handling, accessibility
// Text (p) -- display, style, nest strings of text. handle touch events
// Image (img) -- display images
// ScrollView (div) -- generic scrolling container. can contain components/views
// TextInput (input) -- text input

// ------------
// text input
// ------------

// style -- styles object
// placeholder -- hint text when empty
// onChange -- onChange that uses native event handler as parameter
// onChangeText -- simplified onChange that uses text as parameter
// defaultValue -- initial value (useful when not using controlled input)
// keybaardType -- default, number-pad, decimal-pad, numeric, email-address, phone-pad
// textContentType -- semantic meaning ( https://reactnative.dev/docs/textinput#textcontenttype )
// value -- set value using state (controlled input)

import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
});

const App = () => {
  // state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  // handler
  const handleTextChange = (name, text) => {
    setFormData({ ...formData, [name]: text });
  };
  // jsx
  return (
    <View>
      <TextInput
        style={{ height: 40 }}
        placeholder="John"
        onChangeText={(text) => handleTextChange("firstName", text)}
        value={formData.firstName}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Doe"
        onChangeText={(text) => handleTextChange("lastName", text)}
        value={formData.lastName}
      />
      <Text>Name</Text>
    </View>
  );
};

export default App;

// ------------
// list (FlatList)
// ------------

const FlatListBasics = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: "Devin" },
          { key: "Dan" },
          { key: "Dominic" },
          { key: "Jackson" },
          { key: "James" },
          { key: "Joel" },
          { key: "John" },
          { key: "Jillian" },
          { key: "Jimmy" },
          { key: "Julie" },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

export default FlatListBasics;

// ------------
// list (SectionList)
// ------------

import React from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const SectionListBasics = () => {
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          { title: "D", data: ["Devin", "Dan", "Dominic"] },
          {
            title: "J",
            data: [
              "Jackson",
              "James",
              "Jillian",
              "Jimmy",
              "Joel",
              "John",
              "Julie",
            ],
          },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
};

export default SectionListBasics;

// ------------
// specify platform
// ------------

// ios, android

import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  height: Platform.OS === "ios" ? 200 : 100,
});

// ------------
// networking
// ------------

import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://reactnative.dev/movies.json")
      .then((response) => response.json())
      .then((json) => setData(json.movies))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>
              {item.title}, {item.releaseYear}
            </Text>
          )}
        />
      )}
    </View>
  );
};

// ------------
// security
// ------------

// keep sensitive data on the server (secrets, tokens, etc)

// for non-sensitive data, use Async Storage
// https://react-native-community.github.io/async-storage/

// don't put sensitive data in deep links (universal links)

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
