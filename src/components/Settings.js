import { StyleSheet, Text, View, Pressable, Linking, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { deleteConversations } from '../features/chat/chatSlice'
import { colors } from '../styles/colors'
import { MaterialIcons, AntDesign } from '@expo/vector-icons'

// URLs
const GITHUB_URL = 'https://github.com/jorgenlt/smartbot';
const PROJECTS_URL = 'https://jorgenlt.me';

const Settings = () => {
  const dispatch = useDispatch();

  const handleDeleteConversations = () => {
    Alert.alert('Delete all conversations?', 'Choose "Delete" to confirm.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete', 
        onPress: () => {
          dispatch(deleteConversations());
          Alert.alert('', 'All conversations deleted.');
        }
      },
    ]);
  }

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
        text='Delete all conversations'
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