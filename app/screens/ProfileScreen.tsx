import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLocalData, saveLocalData } from "../../hooks/useLocalStorage";

const ProfileScreen = ({ navigation }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    phone: "",
  });

  useEffect(() => {
    loadUserData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadUserData = async () => {
    const user = await getLocalData("currentUser");
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        specialty: user.specialty || "",
        phone: user.phone || "",
      });
    }
  };

  const saveProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert("Erreur", "Le nom et l'email sont obligatoires");
      return;
    }

    const updatedUser = {
      ...currentUser,
      ...formData,
    };

    await saveLocalData("currentUser", updatedUser);

    // Mettre à jour dans la liste des utilisateurs
    const users = (await getLocalData("users")) || [];
    const updatedUsers = users.map((u: any) =>
      u.email === currentUser.email ? updatedUser : u
    );
    await saveLocalData("users", updatedUsers);

    setCurrentUser(updatedUser);
    setIsEditing(false);
    Alert.alert("Succès", "Profil mis à jour avec succès");
  };

  const logout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await saveLocalData("currentUser", null);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }: any) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={rightComponent ? 1 : 0.7}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={24} color="#007BFF" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      ))}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              saveProfile();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Ionicons
            name={isEditing ? "checkmark" : "create-outline"}
            size={24}
            color="#007BFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={50} color="#007BFF" />
              </View>
              {isEditing && (
                <TouchableOpacity style={styles.avatarEditButton}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            {isEditing ? (
              <View style={styles.editFormContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nom complet</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={18} color="#007BFF" />
                    <TextInput
                      style={styles.input}
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                      placeholder="Votre nom"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={18} color="#007BFF" />
                    <TextInput
                      style={styles.input}
                      value={formData.email}
                      onChangeText={(text) =>
                        setFormData({ ...formData, email: text })
                      }
                      placeholder="Votre email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Spécialité</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="medical-outline" size={18} color="#007BFF" />
                    <TextInput
                      style={styles.input}
                      value={formData.specialty}
                      onChangeText={(text) =>
                        setFormData({ ...formData, specialty: text })
                      }
                      placeholder="Votre spécialité"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Téléphone</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={18} color="#007BFF" />
                    <TextInput
                      style={styles.input}
                      value={formData.phone}
                      onChangeText={(text) =>
                        setFormData({ ...formData, phone: text })
                      }
                      placeholder="Votre téléphone"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.profileName}>Dr. {currentUser?.name}</Text>
                <Text style={styles.profileSpecialty}>
                  {currentUser?.specialty || "Médecin"}
                </Text>
                <View style={styles.profileInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{currentUser?.email}</Text>
                  </View>
                  {currentUser?.phone && (
                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={16} color="#666" />
                      <Text style={styles.infoText}>{currentUser.phone}</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Statistics */}
          {!isEditing && (
            <View style={styles.statsContainer}>
              <StatCard
                icon="people"
                value="24"
                label="Patients"
                color="#007BFF"
              />
              <StatCard
                icon="calendar"
                value="12"
                label="RDV ce mois"
                color="#28A745"
              />
              <StatCard
                icon="notifications"
                value="8"
                label="Notifications"
                color="#DC3545"
              />
            </View>
          )}

          {/* Menu Section */}
          {!isEditing && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Paramètres</Text>
                <View style={styles.menuContainer}>
                  <MenuItem
                    icon="notifications-outline"
                    title="Notifications"
                    subtitle="Activer les rappels"
                    rightComponent={
                      <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: "#E8E8E8", true: "#007BFF" }}
                        thumbColor="#fff"
                      />
                    }
                  />
                  <MenuItem
                    icon="moon-outline"
                    title="Mode sombre"
                    subtitle="Thème de l'application"
                    rightComponent={
                      <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: "#E8E8E8", true: "#007BFF" }}
                        thumbColor="#fff"
                      />
                    }
                  />
                  <MenuItem
                    icon="language-outline"
                    title="Langue"
                    subtitle="Français"
                    onPress={() => Alert.alert("Info", "Fonctionnalité à venir")}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Application</Text>
                <View style={styles.menuContainer}>
                  <MenuItem
                    icon="help-circle-outline"
                    title="Aide & Support"
                    onPress={() => Alert.alert("Support", "Contactez-nous à support@docnotif.com")}
                  />
                  <MenuItem
                    icon="document-text-outline"
                    title="Conditions d'utilisation"
                    onPress={() => Alert.alert("Info", "Fonctionnalité à venir")}
                  />
                  <MenuItem
                    icon="shield-checkmark-outline"
                    title="Politique de confidentialité"
                    onPress={() => Alert.alert("Info", "Fonctionnalité à venir")}
                  />
                  <MenuItem
                    icon="information-circle-outline"
                    title="À propos"
                    subtitle="Version 1.0.0"
                    showArrow={false}
                  />
                </View>
              </View>

              {/* Logout Button */}
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={22} color="#DC3545" />
                <Text style={styles.logoutText}>Déconnexion</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#007BFF",
  },
  avatarEditButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  profileSpecialty: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "500",
    marginBottom: 16,
  },
  profileInfo: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
  },
  editFormContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: "#1A1A1A",
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#999",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DC3545",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC3545",
    marginLeft: 8,
  },
});

export default ProfileScreen;