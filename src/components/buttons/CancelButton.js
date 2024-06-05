import { Text, StyleSheet, Pressable } from "react-native";

const CancelButton = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "rgba(210, 230, 255, 0.8)" : "transparent",
        },
        styles.cancelButton,
      ]}
    >
      <Text style={styles.cancelButton.text}>CANCEL</Text>
    </Pressable>
  );
};

export default CancelButton;

const styles = StyleSheet.create({
  cancelButton: {
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 3,
    text: {
      fontWeight: "bold",
      color: "#2196F3",
    },
  },
});
