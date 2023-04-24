import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';
import { API_KEY } from './config/env';
import botResponse from './botResponse';
import { ActivityIndicator } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import NoMessages from './components/NoMessages'



export default function App() {

  const apiKey = API_KEY;

  const [messages, setMessages] = useState([])
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [loading, setLoading] = useState(false);  

  const handleSendMessage = () => {
    if(currentUserMessage != '') {
      setMessages(prevMessages => {
        return [
          ...prevMessages,
          {
            role: 'user',
            content: currentUserMessage,
            id: uuid.v4()
          }
        ]      
      });

      setUserMessage(currentUserMessage);
      setCurrentUserMessage('');
    }
  }

  const handleOnChangeText = value => {  
    setCurrentUserMessage(value)
  }
  
  const clearChat = () => setMessages([])
  
  const scrollRef = useRef();
  
  const messageElements = messages.map((message) => {
    return (
      <View style={message.role === 'assistant' ? styles.messageWrapperAssistant : styles.messageWrapperUser} key={message.id}>
        {/* <Text style={styles.messageRole} >{message.role}</Text> */}
        <Text style={message.role === 'assistant' ? styles.messageAssistant : styles.messageUser}>
          {message.content}
        </Text>
      </View>
    )
  })

  // API
  useEffect(() => {
    const message = userMessage;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: message}],
        max_tokens: 1000
      })
    };

    if(userMessage !== '') {
      setLoading(true);
      fetch('https://api.openai.com/v1/chat/completions', options)
        .then(response => response.json())
        .then(data => {
          setMessages(prevMessages => {
            return [
              ...prevMessages,
              {
                role: data.choices[0].message.role,
                content: data.choices[0].message.content,
                id: uuid.v4()
              }
            ]
          });

          setLoading(false);
        })
        .catch(error => console.error(error));
    }
  }, [userMessage]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{width: '100%', height: '100%'}}>
        <View style={styles.clearChatBtnWrapper} >
            <Pressable
              onPress={() => clearChat()}
              style={styles.clearChatBtnPressable}
              android_ripple={{color: '#81D99D', radius: 999}}
            >
              <MaterialIcons name="delete" size={24} color="#f5f5f5" />
              <Text style={styles.clearChatBtn}>
                CLEAR CHAT
              </Text>
            </Pressable>
        </View>
        {messages.length === 0 && <NoMessages />}
        <ScrollView 
          contentContainerStyle={styles.messagesWrapper}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
        >
          {messageElements}
        </ScrollView>
        <View style={styles.inputWrapper}>
          <TextInput
          style={styles.input}
          placeholder='Type here...'
          placeholderTextColor='#C0ECCE'
          color='#f5f5f5'
          value={currentUserMessage}
          onChangeText={handleOnChangeText}
          onSubmitEditing={handleSendMessage}
          />
          <Pressable 
            onPress={() => handleSendMessage()}
            android_ripple={{color: '#81D99D', radius: 20}}
            style={styles.pressableSendBtn}
            pressRetentionOffset={{bottom: 15, left: 15, right: 15, top: 15}}
          >
            <Text style={styles.sendBtn} >
              <Entypo name="paper-plane" size={22} color="white" />
            </Text>
          </Pressable>
          <View style={styles.activityIndicator}>
            {loading && <ActivityIndicator size={35} color="#81D99D" />}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#033c4f',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  activityIndicator: {
    position: 'absolute',
    zIndex: 100,
    bottom: 5,
    right: 55
  },
  messagesWrapper: {
    backgroundColor: '#033c4f',
    paddingHorizontal: 5,
  },
  clearChatBtnWrapper: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 4
  },
  clearChatBtnPressable: {
    backgroundColor: '#2C5D6E',
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearChatBtn: {
    color: '#f5f5f5',
    fontWeight: 500,
    marginLeft: 5
  },
  history: {
    color: 'gray'
  },
  inputWrapper: {
    position: 'relative',
    marginTop: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    marginEnd: 10,
    height: 45,
    borderColor: '#81D99D',
    borderWidth: 1,
    borderRadius: 4,
    color: '#f5f5f5',
    backgroundColor: '#2C5D6E'
  },
  pressableSendBtn: {
    height: 40, 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20
  },
  sendBtn: {
    color: '#f5f5f5',
    fontWeight: 500
  },
  messageWrapperUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 10
  },
  messageWrapperAssistant: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10
  },
  messageRole: {
    color: 'gray',
    marginRight: 5,
    fontSize: 10
  },
  messageUser: {
    backgroundColor: '#C0ECCE',
    borderRadius: 5,
    padding: 10,
  },
  messageAssistant: {
    backgroundColor: '#81D99D',
    borderRadius: 5,
    padding: 10,
  }
});
