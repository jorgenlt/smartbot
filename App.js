import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';
import { API_KEY } from './config/env';
import botResponse from './botResponse';
import { ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';



export default function App() {

  const apiKey = API_KEY;

  const [messages, setMessages] = useState([
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
      {
        role: 'user',
        content: 'testsartrsatarstrastrsatrastrsatrtrtrstrastrastarst',
        id: uuid.v4()
      },
  ])
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [loading, setLoading] = useState(false);
  // const [botMessages, setBotMessages] = useState([])
  // const [currentBotMessage, setCurrentBotMessage] = useState([])

  

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

      // fake response
      // setMessages(prevMessages => {
      //   return [
      //     ...prevMessages,
      //     {
      //       role: botResponse.role,
      //       content: botResponse.content,
      //       id: uuid.v4()
      //     }
      //   ]
      // });
    }


  }

  const handleOnChangeText = value => {  
    setCurrentUserMessage(value)
  }

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
        max_tokens: 100
      })
    };

    if(userMessage !== '') {
      setLoading(true);
      fetch('https://api.openai.com/v1/chat/completions', options)
        .then(response => response.json())
        .then(data => {
          // console.log(data.choices[0].message.content);
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

  const scrollRef = useRef();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {loading ? <ActivityIndicator size="large" color="#81D99D" /> : null}
      <View style={{width: '100%', height: '100%'}}>
        <View style={styles.newChatBtn} >
            <Button
              title='+ new chat'
              color='#2C5D6E'
            />
        </View>
        <ScrollView 
          contentContainerStyle={styles.messagesWrapper}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
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
          />
          <Pressable 
            onPress={() => handleSendMessage()}
            android_ripple={{color: 'gray', radius: 15}}
            style={{height: 40, justifyContent: 'center'}}
          >
            <Text style={styles.sendBtn} >
              <Entypo name="paper-plane" size={26} color="white" />
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#033c4f',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  messagesWrapper: {
    backgroundColor: '#033c4f',
    paddingHorizontal: 5,
    // flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center'

  },
  newChatBtn: {
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  history: {
    color: 'gray'
  },
  inputWrapper: {
    marginTop: 10,
    marginHorizontal: 16,
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    marginEnd: 10,
    height: 45,
    // width: '80%',
    borderColor: '#81D99D',
    borderWidth: 1,
    borderRadius: 5,
    color: '#f5f5f5',
    backgroundColor: '#2C5D6E'
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
