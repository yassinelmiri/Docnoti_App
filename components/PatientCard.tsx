import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  patient: any;
  onEdit: () => void;
  onDelete: () => void;
};

const PatientCard = ({ patient, onEdit, onDelete }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{patient.name}</Text>
      <Text>Email: {patient.email}</Text>
      <Text>Phone: {patient.phone}</Text>
      <Text>Appointment: {patient.appointmentTime}</Text>
      <View style={styles.buttons}>
        <Button title="Edit" onPress={onEdit} />
        <Button title="Delete" onPress={onDelete} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: COLORS.secondary,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: COLORS.primary },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});

export default PatientCard;
