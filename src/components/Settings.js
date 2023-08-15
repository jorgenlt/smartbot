import { StyleSheet, Text, View, Button, Pressable, Linking, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { deleteConversations } from '../features/chat/chatSlice'
import { colors } from '../styles/colors';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

const GITHUB_URL = 'https://github.com/jorgenlt/smartbot';
const PROJECTS_URL = 'https://jorgenlt.me';

const Settings = () => {

  // const state = useSelector(state => state.chat);
  // const conversations = useSelector(state => state.chat.conversations);

  const dispatch = useDispatch();

  const handleDeleteConversations = () => {
    Alert.alert('Delete all conversations?', 'Choose "Delete" to confirm.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => {
        dispatch(deleteConversations());
        Alert.alert('', 'All conversations deleted.');
      }},
    ]);
  }

  // const handleGetState = () => {
  //   console.log('redux state:', state);
  // }

  // const handleGetConversations = () => {
  //   console.log('conversations:', conversations);
  // }

  const PressableSetting = ({onPress, iconName, text, IconComponent}) => (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: colors.sec,
        foreground: true,
      }}
      style={styles.pressable}
    >
      <IconComponent name={iconName} size={40} color={colors.black} />
      <Text style={styles.pressableText}>{text}</Text>
    </Pressable>
  );

  return (
    <View style={styles.settingsWrapper} >

      <PressableSetting 
        onPress={handleDeleteConversations}
        iconName='delete'
        text='Delete all messages'
        IconComponent={MaterialIcons}
      />
      <PressableSetting 
        onPress={() => Linking.openURL(GITHUB_URL)}
        iconName='github'
        text='Source code'
        IconComponent={AntDesign}
      />
      <PressableSetting 
        onPress={() => Linking.openURL(PROJECTS_URL)}
        iconName='code'
        text='Other projects'
        IconComponent={MaterialIcons}
      />

      {/* <View style={{maxWidth: '70%', gap: 10, padding: 20, marginTop: 50, flex: 1, justifyContent: 'flex-end'}}>
        <Button title='console.log state' onPress={handleGetState} />
        <Button title='console.log conversations' onPress={handleGetConversations} />
      </View> */}

    </View>
  )
}

export default Settings;

const styles = StyleSheet.create({
  settingsWrapper: {
    flex: 1,
  },
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