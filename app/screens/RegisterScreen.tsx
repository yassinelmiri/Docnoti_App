import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { saveLocalData, getLocalData } from "../../hooks/useLocalStorage";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const register = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Veuillez entrer un email valide");
      return;
    }

    if (password.length < 4) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 4 caractères");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const users = (await getLocalData("users")) || [];
      const userExists = users.find((u: any) => u.email === email);

      if (userExists) {
        setIsLoading(false);
        Alert.alert("Erreur", "Un compte avec cet email existe déjà");
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        specialty: specialty || "Non spécifié",
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await saveLocalData("users", users);

      setIsLoading(false);
      Alert.alert(
        "Succès",
        "Votre compte a été créé avec succès !",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#007BFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez DOC Notification</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            {/* Nom */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="person-outline" size={20} color="#007BFF" />
              </View>
              <TextInput
                placeholder="Nom complet *"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="mail-outline" size={20} color="#007BFF" />
              </View>
              <TextInput
                placeholder="Email *"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Spécialité */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="medical-outline" size={20} color="#007BFF" />
              </View>
              <TextInput
                placeholder="Spécialité (optionnel)"
                placeholderTextColor="#999"
                style={styles.input}
                value={specialty}
                onChangeText={setSpecialty}
                autoCapitalize="words"
              />
            </View>

            {/* Mot de passe */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#007BFF" />
              </View>
              <TextInput
                placeholder="Mot de passe *"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Confirmer mot de passe */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#007BFF" />
              </View>
              <TextInput
                placeholder="Confirmer le mot de passe *"
                placeholderTextColor="#999"
                secureTextEntry={!isConfirmPasswordVisible}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color="#007BFF" />
              <Text style={styles.infoText}>
                Le mot de passe doit contenir au moins 4 caractères
              </Text>
            </View>

            {/* Bouton d'inscription */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={register}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <Text style={styles.registerButtonText}>Création du compte...</Text>
              ) : (
                <>
                  <Text style={styles.registerButtonText}>S'inscrire</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Lien de connexion */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingRight: 12,
  },
  inputIconContainer: {
    width: 44,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#1A1A1A",
  },
  eyeIcon: {
    padding: 8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#007BFF",
  },
  registerButton: {
    backgroundColor: "#007BFF",
    borderRadius: 12,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;