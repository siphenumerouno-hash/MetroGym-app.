import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MetroGym</Text>
      <Text style={styles.subtitle}>Gym Journal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#FFD700",
    fontSize: 32,
    fontWeight: "bold"
  },
  subtitle: {
    color: "#FFD700",
    marginTop: 10
  }
});
