import React from "react";
import { View, Switch, Text, StyleSheet } from "react-native";

type Props = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeToggle = ({ darkMode, toggleDarkMode }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: darkMode ? "#FFF" : "#000" }}>Dark Mode</Text>
      <Switch value={darkMode} onValueChange={toggleDarkMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 10 },
});

export default DarkModeToggle;
