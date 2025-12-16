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
  Dimensions,
} from "react-native";
import { getLocalData, saveLocalData } from "../../hooks/useLocalStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const router = useRouter();

  useEffect(() => {
    // Créer un compte par défaut si nécessaire
    initDefaultAccount();

    // Animations d'entrée
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

  const initDefaultAccount = async () => {
    const users = (await getLocalData("users")) || [];
    const defaultExists = users.find(
      (u: any) => u.email === "doctor@gmail.com"
    );

    if (!defaultExists) {
      const defaultUser = {
        email: "doctor@gmail.com",
        password: "0000",
        name: "Dr. Défaut",
        specialty: "Médecine générale",
      };
      users.push(defaultUser);
      await saveLocalData("users", users);
    }
  };

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const users = (await getLocalData("users")) || [];
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      setIsLoading(false);

      if (user) {
        await saveLocalData("currentUser", user);
        router.replace("/screens/HomeScreen"); 
      } else {
        Alert.alert("Erreur de connexion", "Email ou mot de passe incorrect", [
          { text: "OK" },
        ]);
      }
    }, 800);
  };

  const fillDefaultCredentials = () => {
    setEmail("doctor@gmail.com");
    setPassword("0000");
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
          {/* Header avec icône */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="medical" size={50} color="#fff" />
            </View>
            <Text style={styles.title}>DOC Notification</Text>
            <Text style={styles.subtitle}>Connexion</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            {/* Champ Email */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="mail-outline" size={20} color="#007BFF" />
              </View>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#007BFF"
                />
              </View>
              <TextInput
                placeholder="Mot de passe"
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

            {/* Bouton de connexion */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={login}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Connexion...</Text>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Lien mot de passe oublié */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Bouton compte par défaut */}
            <TouchableOpacity
              style={styles.defaultButton}
              onPress={fillDefaultCredentials}
              activeOpacity={0.7}
            >
              <Ionicons name="flash-outline" size={18} color="#007BFF" />
              <Text style={styles.defaultButtonText}>
                Utiliser le compte par défaut
              </Text>
            </TouchableOpacity>

            {/* Inscription */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Pas encore de compte ? </Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/RegisterScreen")}
              >
                <Text style={styles.registerLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Compte par défaut: doctor@gmail.com / 0000
            </Text>
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
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 16,
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
  loginButton: {
    backgroundColor: "#007BFF",
    borderRadius: 12,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 13,
    fontWeight: "500",
  },
  defaultButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  defaultButtonText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
});

export default LoginScreen;
