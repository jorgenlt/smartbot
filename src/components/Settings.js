import { StyleSheet, Text, View, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { addConversation, deleteMessages } from '../features/chat/chatSlice'

const Settings = ({ navigation }) => {

  const state = useSelector(state => state.chat);
  const conversations = useSelector(state => state.chat.conversations);

  const dispatch = useDispatch();

  const handleDeleteMessages = () => {
    dispatch(deleteMessages());
  }

  const handleGetState = () => {
    console.log('redux state:', state);
  }

  const handleGetConversations = () => {
    console.log('conversations:', conversations);
  }

  const handleNewConversation = () => {
    dispatch(addConversation());
    navigation.navigate('Chat');
  }

  return (
    <View style={styles} >
      <Text>Settings</Text>
      <Button title='Delete messages' onPress={handleDeleteMessages} />
      <Button title='Get state' onPress={handleGetState} />
      <Button title='Get conversations' onPress={handleGetConversations} />
      <Button title='New conversation' onPress={handleNewConversation} />
    </View>
  )
}

export default Settings;

const styles = StyleSheet.create({
  flex: 1, 
  alignItems: 'center', 
  justifyContent: 'center'
});