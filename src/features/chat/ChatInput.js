import { Text, View, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import colors from '../../styles/colors'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChatResponseThunk, updateMessages } from './chatSlice'

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const status = useSelector(state => state.chat.status);

  const dispatch = useDispatch();

  const handleSendMessage = () => {
    if (message) {
      console.log('handleSendMessage dispatch()');

      dispatch(updateMessages({content: message, role: 'user'}));

      dispatch(getChatResponseThunk(message));
      setMessage('');
    }
  }


  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder='Message Smartbot...'
        placeholderTextColor={colors.text}
        color={colors.text}
        value={message}
        onChangeText={value => setMessage(value)}
        onSubmitEditing={() => console.log(message)}
      />
      <View style={styles.sendWrapper}>
        <Pressable 
        onPress={handleSendMessage}
        android_ripple={{color: colors.sec,}}
        style={styles.pressableSendBtn}
        pressRetentionOffset={{bottom: 15, left: 15, right: 15, top: 15}}
        >
          <Text style={styles.sendBtn} >
            <Entypo 
              name="paper-plane" 
              size={22} 
              color={colors.text} 
            />
          </Text>
        </Pressable>
      </View>
      <View style={styles.activityIndicator}>
        {(status === 'loading') && <ActivityIndicator size={35} color={colors.text} />}
      </View>
    </View>
  )
}

export default ChatInput;
  
const styles = StyleSheet.create({
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
    borderRadius: 4,
    backgroundColor: colors.priLighter
  },
  sendWrapper: {
    borderRadius: 20,
    overflow: 'hidden'
  },
  pressableSendBtn: {
    height: 40, 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20
  },
  sendBtn: {
    color: colors.white,
  },
  activityIndicator: {
    position: 'absolute',
    zIndex: 100,
    bottom: 5,
    right: 55
  }
});
  