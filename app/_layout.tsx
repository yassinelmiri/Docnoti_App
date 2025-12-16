import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";


const RootLayout = ({ children }: any) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(() => {
    const checkLogin = async () => {

      setUserLoggedIn(false); 
    };
    checkLogin();
  }, []);

  if (!userLoggedIn) {
    return <RegisterScreen />;
  }

  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
});

export default RootLayout;
