import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Button, FlatList } from 'react-native';
import TaskItem from './src/components/TaskItem';

export default function App() {
  const [text, setText] = useState("UDALOSTI .:::::");
  const [taskList, setTaskList] = useState([]);

  function handleInputText(text){
    setText(text);
  }
  function handleAddItem() {
    setTaskList([...taskList, {title: text, done: false}]);

  }
  console.log(taskList);
  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <TextInput onChangeText={handleInputText} style={styles.input} placeholder='Zadaj Úlohu ...'/>
      <Button onPress={handleAddItem} title="ADD"/>
      </View>

    <FlatList
        data={taskList}
        renderItem={({item}) => <TaskItem item={item}/>}
        keyExtractor={(item) => item.id}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: { 
    flex: 1, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingHorizontal: 10,

  },
  taskContainer: {flex: 3, borderTopWidth: 3, margin: 20, 
  },
  text: {padding: 20},
  input: {borderWidth: 3, width: "80%", borderRadius: 8}
});
TaskItem.js
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