import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import TimerCircle from "../../components/TimerCircle";
import Navbar from "../../components/Navbar";
import DarkModeToggle from "../../components/DarkModeToggle";
import { COLORS } from "../../constants/colors";
import { getLocalData } from "../../hooks/useLocalStorage";

const HomeTab = ({ navigation }: any) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessageToPatients = async () => {
    const patients = await getLocalData("patients") || [];
    alert(`Message envoyé à ${patients.length} patients !`);
  };

  return (
    <ScrollView style={{ backgroundColor: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight, flex: 1 }}>
      <Navbar currentPage="Home" navigate={navigation.navigate} />
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <View style={styles.container}>
        <Text style={[styles.timeText, { color: darkMode ? COLORS.textDark : COLORS.textLight }]}>
          {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </Text>
        <TimerCircle />
        <Button title="Send Message to All Patients" onPress={sendMessageToPatients} color={COLORS.primary} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  timeText: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default HomeTab;
