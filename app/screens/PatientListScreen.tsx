import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLocalData, saveLocalData } from "../../hooks/useLocalStorage";
import DateTimePicker from "@react-native-community/datetimepicker";

const PatientListScreen = ({ navigation }: any) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    appointmentDate: new Date(),
    appointmentTime: new Date(),
    notes: "",
  });

  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    const data = (await getLocalData("patients")) || [];
    setPatients(data);
    setFilteredPatients(data);
  };

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((patient: any) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone?.includes(searchQuery)
    );
    setFilteredPatients(filtered);
  };

  const openModal = (patient?: any) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        phone: patient.phone || "",
        appointmentDate: new Date(patient.appointmentDate),
        appointmentTime: new Date(patient.appointmentDate),
        notes: patient.notes || "",
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: "",
        phone: "",
        appointmentDate: new Date(),
        appointmentTime: new Date(),
        notes: "",
      });
    }
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const savePatient = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le nom du patient");
      return;
    }

    const appointmentDateTime = new Date(formData.appointmentDate);
    appointmentDateTime.setHours(formData.appointmentTime.getHours());
    appointmentDateTime.setMinutes(formData.appointmentTime.getMinutes());

    const patientData = {
      id: editingPatient?.id || Date.now().toString(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      appointmentDate: appointmentDateTime.toISOString(),
      notes: formData.notes.trim(),
      notified: editingPatient?.notified || false,
      createdAt: editingPatient?.createdAt || new Date().toISOString(),
    };

    let updatedPatients;
    if (editingPatient) {
      updatedPatients = patients.map((p: any) =>
        p.id === editingPatient.id ? patientData : p
      );
    } else {
      updatedPatients = [...patients, patientData];
    }

    await saveLocalData("patients", updatedPatients);
    setPatients(updatedPatients);
    closeModal();
  };

  const deletePatient = (patientId: string) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce patient ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const updatedPatients = patients.filter((p: any) => p.id !== patientId);
            await saveLocalData("patients", updatedPatients);
            setPatients(updatedPatients);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const PatientCard = ({ patient }: any) => (
    <View style={styles.patientCard}>
      <View style={styles.patientHeader}>
        <View style={styles.patientAvatar}>
          <Ionicons name="person" size={28} color="#007BFF" />
        </View>
        <View style={styles.patientMainInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <View style={styles.patientDetailRow}>
            <Ionicons name="call-outline" size={14} color="#666" />
            <Text style={styles.patientDetailText}>
              {patient.phone || "Pas de téléphone"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            Alert.alert("Actions", "Choisissez une action", [
              { text: "Annuler", style: "cancel" },
              { text: "Modifier", onPress: () => openModal(patient) },
              {
                text: "Supprimer",
                style: "destructive",
                onPress: () => deletePatient(patient.id),
              },
            ]);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.appointmentInfo}>
        <View style={styles.appointmentItem}>
          <Ionicons name="calendar-outline" size={16} color="#007BFF" />
          <Text style={styles.appointmentText}>{formatDate(patient.appointmentDate)}</Text>
        </View>
        <View style={styles.appointmentItem}>
          <Ionicons name="time-outline" size={16} color="#007BFF" />
          <Text style={styles.appointmentText}>{formatTime(patient.appointmentDate)}</Text>
        </View>
      </View>

      {patient.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={14} color="#999" />
          <Text style={styles.notesText} numberOfLines={2}>
            {patient.notes}
          </Text>
        </View>
      )}
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
        <Text style={styles.headerTitle}>Mes Patients</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un patient..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Patient List */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPatients.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={80} color="#CCC" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? "Aucun résultat" : "Aucun patient"}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "Essayez une autre recherche"
                : "Ajoutez votre premier patient"}
            </Text>
          </View>
        ) : (
          filteredPatients.map((patient: any) => (
            <PatientCard key={patient.id} patient={patient} />
          ))
        )}
      </ScrollView>

      {/* Modal Formulaire */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPatient ? "Modifier le patient" : "Nouveau patient"}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Nom */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom complet *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#007BFF" />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Entrez le nom"
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                  />
                </View>
              </View>

              {/* Téléphone */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#007BFF" />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Entrez le numéro"
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData({ ...formData, phone: text })
                    }
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Date */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date du rendez-vous</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#007BFF" />
                  <Text style={styles.dateText}>
                    {formatDate(formData.appointmentDate.toISOString())}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Heure */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Heure du rendez-vous</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#007BFF" />
                  <Text style={styles.dateText}>
                    {formatTime(formData.appointmentTime.toISOString())}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Notes */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Notes</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <TextInput
                    style={[styles.modalInput, styles.textArea]}
                    placeholder="Ajoutez des notes..."
                    value={formData.notes}
                    onChangeText={(text) =>
                      setFormData({ ...formData, notes: text })
                    }
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              {/* Boutons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={savePatient}
                >
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.appointmentDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setFormData({ ...formData, appointmentDate: date });
            }}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={formData.appointmentTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, time) => {
              setShowTimePicker(false);
              if (time) setFormData({ ...formData, appointmentTime: time });
            }}
          />
        )}
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: "#1A1A1A",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  patientMainInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  patientDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientDetailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  moreButton: {
    padding: 8,
  },
  appointmentInfo: {
    flexDirection: "row",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 16,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 8,
    fontWeight: "500",
  },
  notesContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#CCC",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
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
  modalInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#1A1A1A",
    marginLeft: 12,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  dateText: {
    fontSize: 15,
    color: "#1A1A1A",
    marginLeft: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default PatientListScreen;