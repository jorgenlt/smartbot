import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { addConversation } from './chatSlice'
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'

const NewConversation = ({ navigation }) => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(addConversation());
      navigation.navigate('ChatPage');
    }, [dispatch, navigation]),
  );
  
  return (
    <View>
    </View>
  )
}

export default NewConversation