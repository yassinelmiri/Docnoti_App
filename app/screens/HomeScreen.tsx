import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLocalData } from "../../hooks/useLocalStorage";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [patients, setPatients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingNotifications: 0,
  });
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadData = async () => {
    const user = await getLocalData("currentUser");
    const allPatients = (await getLocalData("patients")) || [];
    
    setCurrentUser(user);
    setPatients(allPatients);
    
    // Calculer les statistiques
    const today = new Date().toDateString();
    const todayPatients = allPatients.filter(
      (p: any) => new Date(p.appointmentDate).toDateString() === today
    );

    setStats({
      totalPatients: allPatients.length,
      todayAppointments: todayPatients.length,
      pendingNotifications: allPatients.filter((p: any) => !p.notified).length,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const quickActions = [
    {
      id: 1,
      title: "Liste des patients",
      icon: "people",
      color: "#007BFF",
      bgColor: "#E3F2FD",
      route: "PatientList",
    },
    {
      id: 2,
      title: "Import/Export",
      icon: "swap-horizontal",
      color: "#28A745",
      bgColor: "#E8F5E9",
      route: "ImportExport",
    },
    {
      id: 3,
      title: "Mon profil",
      icon: "person",
      color: "#FFC107",
      bgColor: "#FFF8E1",
      route: "Profile",
    },
    {
      id: 4,
      title: "Notifications",
      icon: "notifications",
      color: "#DC3545",
      bgColor: "#FFEBEE",
      route: "PatientList",
    },
  ];

  const StatCard = ({ title, value, icon, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const QuickActionCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => navigation.navigate(item.route)}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: item.bgColor }]}>
        <Ionicons name={item.icon} size={28} color={item.color} />
      </View>
      <Text style={styles.actionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>Dr. {currentUser?.name || "Utilisateur"}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle" size={40} color="#007BFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
          {/* Statistiques */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Total patients"
                value={stats.totalPatients}
                icon="people"
                color="#007BFF"
              />
              <StatCard
                title="RDV aujourd'hui"
                value={stats.todayAppointments}
                icon="calendar"
                color="#28A745"
              />
              <StatCard
                title="Notifications"
                value={stats.pendingNotifications}
                icon="notifications"
                color="#DC3545"
              />
            </View>
          </View>

          {/* Actions rapides */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((item) => (
                <QuickActionCard key={item.id} item={item} />
              ))}
            </View>
          </View>

          {/* Patients récents */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Patients récents</Text>
              <TouchableOpacity onPress={() => navigation.navigate("PatientList")}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            {patients.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={60} color="#CCC" />
                <Text style={styles.emptyStateText}>Aucun patient enregistré</Text>
                <TouchableOpacity
                  style={styles.addPatientButton}
                  onPress={() => navigation.navigate("PatientList")}
                >
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.addPatientText}>Ajouter un patient</Text>
                </TouchableOpacity>
              </View>
            ) : (
              patients.slice(0, 3).map((patient: any, index) => (
                <View key={index} style={styles.patientCard}>
                  <View style={styles.patientAvatar}>
                    <Ionicons name="person" size={24} color="#007BFF" />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetail}>
                      {patient.phone || "Pas de téléphone"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </View>
              ))
            )}
          </View>

          {/* Carte d'information */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle" size={24} color="#007BFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Astuce du jour</Text>
              <Text style={styles.infoText}>
                Utilisez la fonctionnalité d'import/export pour sauvegarder vos données
                régulièrement
              </Text>
            </View>
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 4,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statContent: {
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 56) / 2,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    marginBottom: 20,
  },
  addPatientButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addPatientText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  patientDetail: {
    fontSize: 14,
    color: "#666",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F0F7FF",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007BFF",
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#007BFF",
    lineHeight: 20,
  },
});

export default HomeScreen;