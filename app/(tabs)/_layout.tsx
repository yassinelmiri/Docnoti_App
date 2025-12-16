import React from "react";
import { View, StyleSheet } from "react-native";

const TabsLayout = ({ children }: any) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
});

export default TabsLayout;
