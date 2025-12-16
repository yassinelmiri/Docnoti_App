import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

const GlobalModal = ({ visible, message, onClose }: Props) => {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>
          <Button title="Close" onPress={onClose} color="#007BFF" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modal: { width: 300, padding: 20, backgroundColor: "#FFF", borderRadius: 10, alignItems: "center" },
  message: { marginBottom: 20, fontSize: 16, textAlign: "center" },
});

export default GlobalModal;
