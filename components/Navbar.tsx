import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  currentPage: string;
  navigate: (page: string) => void;
};

const Navbar = ({ currentPage, navigate }: Props) => {
  return (
    <View style={styles.container}>
      {["Home", "Patients", "Files"].map((page) => (
        <TouchableOpacity key={page} onPress={() => navigate(page)}>
          <Text style={[styles.text, currentPage === page && styles.active]}>{page}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.secondary,
    fontSize: 16,
  },
  active: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Navbar;
