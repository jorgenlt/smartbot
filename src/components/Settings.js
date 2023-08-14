import { StyleSheet, Text, View, Button, Pressable, Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { addConversation, deleteMessages } from '../features/chat/chatSlice'
import { colors } from '../styles/colors';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

const Settings = ({ navigation }) => {

  const state = useSelector(state => state.chat);
  const conversations = useSelector(state => state.chat.conversations);

  const dispatch = useDispatch();

  const handleDeleteMessages = () => {
    dispatch(deleteMessages());
    navigation.navigate('Chat');
  }

  const handleGetState = () => {
    console.log('redux state:', state);
  }

  const handleGetConversations = () => {
    console.log('conversations:', conversations);
  }

  return (
    <View style={styles} >
      <Pressable
        onPress={handleDeleteMessages}
        android_ripple={{
          color: colors.sec,
          foreground: true,
        }}
        style={styles.pressable}
      >
        <MaterialIcons name="delete" size={40} color={colors.black} />
        <Text style={styles.pressableText}>Delete all messages</Text>
      </Pressable>
      <Pressable
        onPress={() => Linking.openURL('https://github.com/jorgenlt/smartbot')}
        android_ripple={{
          color: colors.sec,
          foreground: true,
        }}
        style={styles.pressable}
      >
        <AntDesign name="github" size={40} color={colors.black} />
        <Text style={styles.pressableText}>Source code</Text>
      </Pressable>
      <Pressable
        onPress={() => Linking.openURL('https://jorgenlt.me')}
        android_ripple={{
          color: colors.sec,
          foreground: true,
        }}
        style={styles.pressable}
      >
        <MaterialIcons name="code" size={40} color={colors.black} />
        <Text style={styles.pressableText}>Other projects</Text>
      </Pressable>

      {/* <View style={{maxWidth: '70%', gap: 10, padding: 20, marginTop: 50, flex: 1, justifyContent: 'flex-end'}}>
        <Button title='console.log state' onPress={handleGetState} />
        <Button title='console.log conversations' onPress={handleGetConversations} />
      </View> */}
    </View>
  )
}

export default Settings;

const styles = StyleSheet.create({
  flex: 1,
  color: colors.black,
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  pressableText: {
    fontSize: 20,
    fontWeight: 600,
    marginLeft: 10,
    fontWeight: 'bold'
  }
});