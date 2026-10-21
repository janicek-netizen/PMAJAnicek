import { Text, StyleSheet, Pressable } from "react-native";

export default function TaskItem({ title }) {
  return (
    <Pressable
      onPress={handleDoneItem}
      style={TaskItem.done ? styles.taskContainerDone : styles.taskContainer}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: "red",
    margin: 4,
    padding: 10,
    borderRadius: 8,
  },
  taskContainerDone: {
    backgroundColor: "green",
    margin: 4,
    padding: 10,
    borderRadius: 8,
  },
});