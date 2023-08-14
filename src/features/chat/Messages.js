import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Pressable,
  Share,
  Alert
} from 'react-native'
import Tooltip from 'rn-tooltip';
import * as Clipboard from 'expo-clipboard';
import uuid from 'react-native-uuid'
import { colors, chat, base } from '../../styles/colors'
import { Flow } from 'react-native-animated-spinkit'

const Messages = () => {
  const id = useSelector(state => state.chat.currentId)?.toString();
  const messages = useSelector(state => state.chat.conversations?.[id]);
  const error = useSelector(state => state.chat.error);
  const status = useSelector(state => state.chat.status);

  
  // Function to copy text(messages) to clipboard.
  const handleCopyToClipboard = async text => {
    await Clipboard.setStringAsync(text);
    Alert.alert('', 'Copied to Clipboard.')
  };

  // Share message
  const handleShare = async message => {
    try {
      const result = await Share.share({
        message:
          message,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
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
          <Pressable 
            style={message.role === 'assistant' ? styles.messageAssistant : styles.messageUser}
            onLongPress={() => handleShare(message.content)}
            onPress={() => handleCopyToClipboard(message.content)}
          >
            {/* <Tooltip 
              popover={<Text style={{ color: colors.white }} >Copied to clipboard</Text>} 
              onOpen={() => copyToClipboard(message.content)}
              withOverlay={false}
              backgroundColor='#121416'
              > */}
              <Text>
                {message.content}
              </Text>
            {/* </Tooltip> */}
          </Pressable>
        </View>
      )
    });
  }
  
  // Ref for ScrollView
  const scrollRef = useRef();

  return (
    <>
      {
        messages && messages.length === 0 ? (
          <View style={styles.noMessagesWrapper}>
            <Text style={styles.noMessages} >Start chatting with Smartbot 👇</Text>
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.messagesWrapper}
            ref={scrollRef}
            onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
            showsHorizontalScrollIndicator={false}
            >
              {messageElements}

              {
                status === 'loading' && 
                <View style={styles.messageWrapperAssistant}>
                  <View style={styles.flowLoader}>
                    <Flow size={30} color='#202020'  />
                  </View>
                </View>
              }
          </ScrollView>
          )
        }
      {error && <Text>{error}</Text>}
    </>
  )
}

export default Messages

const styles = StyleSheet.create({
  messagesWrapper: {
    paddingHorizontal: 5,
    paddingBottom: 20,
    width: '100%'
  },
  messageWrapperUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%'
  },
  messageWrapperAssistant: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  messageUser: {
    backgroundColor: chat.messageUserBg,
    color: colors.text,
    borderRadius: 20,
    borderTopRightRadius: 2,
    padding: 10,
    maxWidth: '90%',
  },
  messageAssistant: {
    backgroundColor: chat.messageAssistantBg,
    color: colors.text,
    borderRadius: 20,
    borderTopLeftRadius: 2,
    padding: 10,
    maxWidth: '90%'
  },
  noMessagesWrapper: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMessages: {
    fontSize: 18
  },
  flowLoader: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: base.loaderBg,
    color: base.loader,
    borderRadius: 20,
    borderTopLeftRadius: 2,
  }
})