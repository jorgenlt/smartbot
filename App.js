import { useState, useEffect, useRef } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tooltip from 'rn-tooltip';
import * as SplashScreen from 'expo-splash-screen';
import NoMessages from './components/NoMessages';
import Input from './components/Input';
import ClearChat from './components/ClearChat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import uuid from 'react-native-uuid';
import { API_KEY} from '@env';
import * as Clipboard from 'expo-clipboard';
import { colors } from './styles/colors'

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
    }, 500);
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
      const updatedMessages = [
            ...messages,
            {
              role: 'user',
              content: currentUserMessage,
            }
          ]
  
      setMessages(updatedMessages);
      storeMessages(updatedMessages);
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

  const copyToClipboard = async text => {
    if (text) {
      await Clipboard.setStringAsync(text);
    }
  };
  
  
  const messageElements = messages.map((message) => {
    return (
      <View style={message.role === 'assistant' ? styles.messageWrapperAssistant : styles.messageWrapperUser} key={uuid.v4()} >
        <Tooltip 
          popover={<Text style={{ color: colors.white }} >Copied to clipboard</Text>} 
          onOpen={() => copyToClipboard(message.content)}
          withOverlay={false}
          backgroundColor='#121416'
        >
          <Text style={message.role === 'assistant' ? styles.messageAssistant : styles.messageUser} >
            {message.content}
          </Text>
        </Tooltip>
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
          model: "gpt-4",
          messages: requestMessages,
          max_tokens: 5000
        })
      };

      setLoading(true);

      fetch('https://api.openai.com/v1/chat/completions', options)
        .then(response => response.json())
        .then(data => {
          setMessages(prevMessages => {
            console.log(data);
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
    backgroundColor: colors.pri,
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  messagesWrapper: {
    backgroundColor: colors.pri,
    paddingHorizontal: 5,
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
  messageUser: {
    backgroundColor: colors.messageUser,
    color: colors.text,
    borderRadius: 20,
    borderTopRightRadius: 2,
    padding: 10,
  },
  messageAssistant: {
    backgroundColor: colors.messageAssistant,
    color: colors.text,
    borderRadius: 20,
    borderTopLeftRadius: 2,
    padding: 10,
  }
});
