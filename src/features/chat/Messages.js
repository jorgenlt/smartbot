import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView 
} from 'react-native'
import Tooltip from 'rn-tooltip';
import * as Clipboard from 'expo-clipboard';
import uuid from 'react-native-uuid'
import { colors } from '../../styles/colors'

const Messages = () => {
  const id = useSelector(state => state.chat.currentId)?.toString();
  const messages = useSelector(state => state.chat.conversations?.[id]);
  const error = useSelector(state => state.chat.error);

  // Ref for ScrollView
  const scrollRef = useRef();

  // Function to copy text(messages) to clipboard.
  const copyToClipboard = async text => {
      await Clipboard.setStringAsync(text);
  };

  // Creating the message elements to render in the ScrollView.
  let messageElements;
  if (messages) {
    messageElements = messages.map(message => {
      return (
        <View 
          style={message.role === 'assistant' ? styles.messageWrapperAssistant : styles.messageWrapperUser} 
          key={uuid.v4()} 
        >
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
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.messagesWrapper}
      ref={scrollRef}
      onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
    >
      {
        messages && messages.length === 0 ? (
          <View style={styles.noMessagesWrapper}>
            <Text style={styles.noMessages} >Start chatting with Smartbot 👇</Text>
          </View>
        ) : (
          messageElements
        )
      }

      {error && <Text>{error}</Text>}
      
    </ScrollView>
  )
}

export default Messages

const styles = StyleSheet.create({
  messagesWrapper: {
    backgroundColor: colors.pri,
    paddingHorizontal: 5,
    height: '100%',
    width: '100%'
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
  },
  noMessagesWrapper: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMessages: {
    fontSize: 18
  }
})