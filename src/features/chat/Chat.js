import { StyleSheet, Text, View, Button } from 'react-native'
import { useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux'
import { colors } from '../../styles/colors'
import ChatInput from './ChatInput'
import Messages from './Messages'

import fetchChatCompletion from '../../api/api'

export default function Chat({ route }) {
  const [messages, setMessages] = useState([])
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [loading, setLoading] = useState(false);

  const status = useSelector(state => state.chat.status);
  const error = useSelector(state => state.chat.error);

  // useEffect(() => {
  //   fetchChatCompletion([], 'hey');
  // }, [])
  
  return (
    <View style={styles.container}>
      <View style={{width: '100%', height: '100%'}}>
        {/* <Button 
          title='go to details'
          onPress={() => navigation.navigate('Details')}
        /> */}
        <Messages />
        <ChatInput />
      </View>
    </View>
    )
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