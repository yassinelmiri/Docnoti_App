import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLocalData, saveLocalData } from "../../hooks/useLocalStorage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const ImportExportScreen = ({ navigation }: any) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const exportData = async () => {
    setIsExporting(true);
    
    try {
      const patients = (await getLocalData("patients")) || [];
      const users = (await getLocalData("users")) || [];
      
      const exportData = {
        patients,
        users: users.map((u: any) => ({ ...u, password: undefined })), // Sécurité
        exportDate: new Date().toISOString(),
        version: "1.0.0",
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `doc_notification_backup_${Date.now()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      await Share.share({
        message: "Sauvegarde DOC Notification",
        url: fileUri,
        title: "Exporter les données",
      });

      Alert.alert("Succès", "Données exportées avec succès");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'exporter les données");
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setIsImporting(true);

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const importedData = JSON.parse(fileContent);

      if (!importedData.patients && !importedData.users) {
        throw new Error("Format de fichier invalide");
      }

      Alert.alert(
        "Confirmer l'importation",
        `Importer ${importedData.patients?.length || 0} patients et ${importedData.users?.length || 0} utilisateurs ?`,
        [
          { text: "Annuler", style: "cancel", onPress: () => setIsImporting(false) },
          {
            text: "Importer",
            onPress: async () => {
              try {
                if (importedData.patients) {
                  await saveLocalData("patients", importedData.patients);
                }
                if (importedData.users) {
                  await saveLocalData("users", importedData.users);
                }
                Alert.alert("Succès", "Données importées avec succès");
              } catch (error) {
                Alert.alert("Erreur", "Impossible d'importer les données");
              } finally {
                setIsImporting(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erreur", "Fichier invalide ou corrompu");
      setIsImporting(false);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "⚠️ Attention",
      "Cette action supprimera TOUTES vos données de manière irréversible. Voulez-vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer tout",
          style: "destructive",
          onPress: async () => {
            await saveLocalData("patients", []);
            Alert.alert("Succès", "Toutes les données ont été supprimées");
          },
        },
      ]
    );
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const ActionCard = ({ 
    icon, 
    title, 
    description, 
    color, 
    onPress, 
    loading = false 
  }: any) => (
    <TouchableOpacity
      style={[styles.actionCard, { borderLeftColor: color }]}
      onPress={() => {
        animateButton();
        onPress();
      }}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      {loading ? (
        <View style={styles.loadingIndicator}>
          <Ionicons name="hourglass-outline" size={24} color={color} />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  const InfoCard = ({ icon, title, description, color }: any) => (
    <View style={styles.infoCard}>
      <View style={[styles.infoIconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDescription}>{description}</Text>
      </View>
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
        <Text style={styles.headerTitle}>Import / Export</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Ionicons name="cloud-outline" size={40} color="#fff" />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Sauvegarde de données</Text>
              <Text style={styles.bannerText}>
                Gardez vos données en sécurité en les exportant régulièrement
              </Text>
            </View>
          </View>

          {/* Actions principales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>

            <ActionCard
              icon="cloud-upload-outline"
              title="Exporter les données"
              description="Sauvegarder tous vos patients et paramètres"
              color="#007BFF"
              onPress={exportData}
              loading={isExporting}
            />

            <ActionCard
              icon="cloud-download-outline"
              title="Importer les données"
              description="Restaurer à partir d'une sauvegarde"
              color="#28A745"
              onPress={importData}
              loading={isImporting}
            />

            <ActionCard
              icon="trash-outline"
              title="Effacer toutes les données"
              description="Supprimer définitivement tous les patients"
              color="#DC3545"
              onPress={clearAllData}
            />
          </View>

          {/* Informations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>

            <InfoCard
              icon="shield-checkmark-outline"
              title="Sécurité"
              description="Vos données sont stockées localement et ne sont jamais envoyées à des serveurs externes"
              color="#007BFF"
            />

            <InfoCard
              icon="document-text-outline"
              title="Format de fichier"
              description="Les sauvegardes sont exportées au format JSON pour une compatibilité maximale"
              color="#FFC107"
            />

            <InfoCard
              icon="time-outline"
              title="Fréquence recommandée"
              description="Il est conseillé d'exporter vos données au moins une fois par semaine"
              color="#28A745"
            />
          </View>

          {/* Guide d'utilisation */}
          <View style={styles.guideContainer}>
            <Text style={styles.guideTitle}>Comment ça marche ?</Text>

            <View style={styles.guideStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Exporter</Text>
                <Text style={styles.stepDescription}>
                  Appuyez sur "Exporter" pour créer une sauvegarde de vos données
                </Text>
              </View>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Partager</Text>
                <Text style={styles.stepDescription}>
                  Envoyez le fichier par email, cloud ou autre moyen de stockage
                </Text>
              </View>
            </View>

            <View style={styles.guideStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Restaurer</Text>
                <Text style={styles.stepDescription}>
                  Utilisez "Importer" pour restaurer vos données quand nécessaire
                </Text>
              </View>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={24} color="#DC3545" />
            <Text style={styles.warningText}>
              Gardez vos sauvegardes en lieu sûr. La suppression des données est
              irréversible sans sauvegarde.
            </Text>
          </View>
        </View>
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
  content: {
    padding: 20,
  },
  banner: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    lineHeight: 20,
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
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
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
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  loadingIndicator: {
    padding: 8,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  guideContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  guideStep: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FFF3F3",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#DC3545",
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#DC3545",
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default ImportExportScreen;