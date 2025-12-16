import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Import des écrans
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import PatientListScreen from "../screens/PatientListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ImportExportScreen from "../screens/ImportExportScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#F8F9FA" },
        }}
      >
        {/* Écrans d'authentification */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            animation: "slide_from_right",
          }}
        />

        {/* Écrans principaux */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="PatientList"
          component={PatientListScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="ImportExport"
          component={ImportExportScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;