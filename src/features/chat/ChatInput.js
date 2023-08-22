import { 
  Text, 
  View, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  Keyboard
} from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../../styles/colors'
import { useDispatch } from 'react-redux';
import { getChatResponseThunk, updateMessages } from './chatSlice'

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [sound, setSound] = useState();

  const dispatch = useDispatch();
  
  // Load sound when component mounts
  useEffect(() => {
    async function loadSound() {
      console.log('Loading click Sound');
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/click.mp3')
      );
      setSound(sound);
    }

    loadSound();

    // Cleanup
    return sound ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync(); 
    } : undefined;
  }, []);

  // Play sound
  const playSound = async () => {
    console.log('Playing click Sound');
    if (sound) {
      await sound.replayAsync();
    }
  };

  const handleSendMessage = () => {
    playSound();
    if (message) {
      // Dismiss(hide) the keyboard.
      Keyboard.dismiss();

      dispatch(getChatResponseThunk(message));
      setMessage('');

      dispatch(updateMessages({
        content: message, 
        role: 'user',
      }));

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
        onSubmitEditing={handleSendMessage}
        multiline={true}
      />
      <View style={styles.sendWrapper}>
        <Pressable 
          onPress={handleSendMessage}
          android_ripple={{color: colors.sec,}}
          style={styles.pressableSendBtn}
          pressRetentionOffset={{bottom: 15, left: 15, right: 15, top: 15}}
        >
          <Entypo 
            name="paper-plane" 
            size={22} 
            color={colors.text} 
          />
        </Pressable>
      </View>
    </View>
  )
}

export default ChatInput;
  
const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 40,
    borderRadius: 4,
    backgroundColor: colors.priLighter
  },
  sendWrapper: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 20,
    overflow: 'hidden'
  },
  pressableSendBtn: {
    height: 30, 
    width: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20
  },
  sendBtn: {
    color: colors.white,
  }
});
  