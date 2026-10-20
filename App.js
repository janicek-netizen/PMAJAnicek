import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      
      <View style={styles.inputContainer}>
      <TextInput style={styles.Input} placeholder="Zadaj úlohu"/>
      <Button title="ADD"/></View>
    
      
      <View style={styles.taskContainer}>
      <Text style={styles.text}>UDALOSTI</Text></View>
      
      
      
      
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  
  Input: { 
    borderWidth: 3, 
    width: "80%",
    height: 50,

  },
  inputContainer: { 
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,

  },
  taskContainer: { 
    flex: 3, 
    borderTopWidth: 3, 
    margin: 20, 

  },
  
  text: {
    padding: 20,
    
  }

});