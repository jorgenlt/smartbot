import { useState, useEffect, useRef } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import NoMessages from './components/NoMessages';
import Input from './components/Input';
import ClearChat from './components/ClearChat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import uuid from 'react-native-uuid';
import { API_KEY} from '@env';

// Show splash screen
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [messages, setMessages] = useState([])
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [loading, setLoading] = useState(false);

  // Hide splash screen after 1.5s.
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
  }, []);

  // Async Storage
  // # store
  const storeMessages = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('messages', jsonValue)
    } catch (e) {
      console.log('Messages was not stored');
    }
  }

  // # get from storage
  useEffect(() => {
    const getMessages = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('messages');
        if(jsonValue.length !== 0) {
          setMessages(JSON.parse(jsonValue))
        }
      } catch(e) {
        console.log('No messages was loaded from storage.');
      }
    };
    getMessages();
  }, [])

  // # clear async storage
  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('messages')
    } catch(e) {
      console.log('AsyncStorage could not remove the stored key.');
    }
    console.log('Async storage cleared.')
  }

  const handleOnChangeText = value => {  
    setCurrentUserMessage(value)
  }

  const handleSendMessage = () => {
    Keyboard.dismiss();

    if(currentUserMessage != '') {
      setMessages(prevMessages => {
        return [
          ...prevMessages,
          {
            role: 'user',
            content: currentUserMessage,
          }
        ]      
      });

      storeMessages(messages);
      setUserMessage(currentUserMessage);
      setCurrentUserMessage('');
    }
  }
  
  const clearChat = () => {
    removeValue();
    setMessages([]);
    setCurrentUserMessage('');
    setUserMessage('');
  }
  
  const scrollRef = useRef();
  
  const messageElements = messages.map((message) => {
    return (
      <View style={message.role === 'assistant' ? styles.messageWrapperAssistant : styles.messageWrapperUser} key={uuid.v4()}>
        <Text style={message.role === 'assistant' ? styles.messageAssistant : styles.messageUser}>
          {message.content}
        </Text>
      </View>
    )
  });

  // API call
  useEffect(() => {
    if(userMessage !== '') {
      // get the last 10 messages as context (chat history)
      let contextMessages;
  
      if(messages.length > 10) {
        contextMessages = messages.slice(-10);
      } else {
        contextMessages = messages;
      };

      const requestMessages = [
        ...contextMessages,
        {
          role: "user", 
          content: userMessage
        }
      ];
  
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: requestMessages,
          max_tokens: 1000
        })
      };

      setLoading(true);

      fetch('https://api.openai.com/v1/chat/completions', options)
        .then(response => response.json())
        .then(data => {
          setMessages(prevMessages => {
            const responseMessage = data.choices[0].message;
            const newMessages = [
              ...prevMessages,
              {
                role: responseMessage.role,
                content: responseMessage.content,
              }
            ];
            
            // storing message in async storage
            storeMessages(newMessages);

            // setting the messages state
            return newMessages;
          });

          // stopping loading animation
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
