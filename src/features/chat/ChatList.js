import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentId } from './chatSlice'
import { useRef } from 'react';

const ChatList = ({ navigation }) => {
  const conversations = useSelector(state => state.chat.conversations);
  const dispatch = useDispatch();
  let ids = [];

  if (conversations) {
    for (const key in conversations) {
      if (conversations[key]) {
        ids.push(key);
        console.log(ids);
      }
    }
  }

      // return (
      //   <View>
      //     <Text>{conversations[key][0]}</Text>
      //   </View>
      // )
  
  const handleChangeConversation = id => {
    dispatch(updateCurrentId(id));
    navigation.navigate('Chat');
  }

  // Ref for ScrollView
  const scrollRef = useRef();

  return (
    <View style={{width: '100%', height: '100%'}}>
      <ScrollView 
        contentContainerStyle={styles}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
      >
        <Text>Chat List</Text>
        {ids.map(id => <Text key={id} onPress={() => handleChangeConversation(id)} >{id}: {conversations[id][0]?.content ? conversations[id][0].content : 'no messages yet'}</Text>)}
      </ScrollView>
    </View>
  )
}

export default ChatList;

const styles = StyleSheet.create({
  alignItems: 'center', 
  justifyContent: 'center',
  justifyContent: 'flex-end',
  paddingVertical: 20,
  paddingHorizontal: 5,
  alignItems: 'center'
});