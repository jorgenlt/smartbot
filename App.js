import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';
import { API_KEY } from './config/env';



export default function App() {
  // const API_KEY = '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';
  const apiKey = API_KEY;

  const [userMessages, setUserMessages] = useState([])
  const [currentUserMessage, setCurrentUserMessage] = useState('')

  const handleSendMessage = () => {
    if(currentUserMessage != '') {
      setUserMessages(prevUserMessages => {
        return [
          ...prevUserMessages,
          {
            user: 'user',
            message: currentUserMessage,
            id: uuid.v4()
          }
        ]      
      })
      setCurrentUserMessage('')
    }
  }

  const handleOnChangeText = value => {  
    setCurrentUserMessage(value)
  }

  const userMessageElements = userMessages.map((userMessage) => {
    return (
      <View style={styles.userMessageWrapper} key={userMessage.id}>
        <Text style={styles.userMessageUser} >{userMessage.user}</Text>
        <Text style={styles.userMessage}>
          {userMessage.message}
        </Text>
      </View>
    )
  })

  useEffect(() => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Hello!"}],
        max_tokens: 100
      })
    };

    fetch('https://api.openai.com/v1/chat/completions', options)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }, []);

  console.log(userMessages);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <Button 
          title='+ new chat'
          color='gray'
        />
        <Text style={styles.history}>
          History:
        </Text>
      </View>
      <View>
        <View>
          {userMessageElements}
        </View>
        <Text style={{color: 'gray'}} >{`api key: ${apiKey}`}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
          style={styles.input}
          placeholder='Type here...'
          placeholderTextColor='gray'
          color='#f5f5f5'
          value={currentUserMessage}
          onChangeText={handleOnChangeText}
          />
          <Pressable 
            onPress={() => handleSendMessage()}
            android_ripple={{color: 'gray', radius: 15}}
            style={{height: 40, justifyContent: 'center'}}
          >
            <Text style={styles.sendBtn} >Send</Text>
          </Pressable>
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
  history: {
    color: 'gray'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    marginEnd: 10,
    height: 40,
    // width: '80%',
    borderColor: '#d2d4da',
    borderWidth: 1,
    borderRadius: 5,
    color: '#f5f5f5',
  },
  sendBtn: {
    color: '#f5f5f5'
  },
  userMessageWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 10
  },
  userMessageUser: {
    color: 'gray',
    marginRight: 5,
    fontSize: 10
  },
  userMessage: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
  }
});
