import { View, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import { addConversation } from './chatSlice'
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'

const NewChat = ({ navigation }) => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(addConversation());
      navigation.navigate('Chat');
    }, [dispatch, navigation]),
  );
  
  return (
    <View>
    </View>
  )
}

export default NewChat