import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const TimerCircle = () => {
  const [time, setTime] = useState(30 * 60); // 30 min en secondes
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(time)}</Text>
      <View style={styles.buttons}>
        <Button title="+1 min" onPress={() => setTime(time + 60)} />
        <Button title="-1 min" onPress={() => setTime(time - 60)} />
        <Button title={running ? "Pause" : "Start"} onPress={() => setRunning(!running)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", margin: 20 },
  time: { fontSize: 32, fontWeight: "bold", marginBottom: 10 },
  buttons: { flexDirection: "row", gap: 10 },
});

export default TimerCircle;
