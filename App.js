import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}} >Open up App.js to start sartworking on your app!</Text>
      <StatusBar style="auto" />
      <View>
        <View style={styles.inputWrapper}>
          <TextInput
          style={styles.input}
          />
          <Button 
            title='send'
            color='transparent'
            style={styles.sendBtn} 
            onPress={() => console.log('send message')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#121416',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    marginStart: 5,
    marginEnd: 5,
    height: 40,
    // width: '80%',
    borderColor: '#d2d4da',
    borderWidth: 1,
    borderRadius: 20,
    color: '#f5f5f5',
  },
  sendBtn: {
  }
});
