import { useState, useEffect, useRef } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import NoMessages from './components/NoMessages';
import Input from './components/Input';
import ClearChat from './components/ClearChat'
import { StatusBar } from 'expo-status-bar';
import uuid from 'react-native-uuid';
import { API_KEY } from './config/env';

export default function App() {

  const apiKey = API_KEY;

  const [messages, setMessages] = useState([])
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [loading, setLoading] = useState(false);  

  const handleSendMessage = () => {
    Keyboard.dismiss();

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
  
  const clearChat = () => {
    setMessages([]);
    setCurrentUserMessage('');
    setUserMessage('');
  }
  
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
        <ClearChat 
          clearChat={() => clearChat()}
        />
        {messages.length === 0 && <NoMessages />}
        <ScrollView 
          contentContainerStyle={styles.messagesWrapper}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
        >
          {messageElements}
        </ScrollView>
        <Input 
          loading={loading}
          currentUserMessage={currentUserMessage}
          handleOnChangeText={handleOnChangeText}
          handleSendMessage={() => handleSendMessage()}
        />
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
  messagesWrapper: {
    backgroundColor: '#033c4f',
    paddingHorizontal: 5,
  },
  history: {
    color: 'gray'
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
