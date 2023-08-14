import { StyleSheet, Text, ScrollView, View, Pressable, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentId, deleteConversation } from './chatSlice'
import { useRef } from 'react';
import { colors } from '../../styles/colors'

const Conversations = ({ navigation }) => {
  const conversations = useSelector(state => state.chat.conversations);

  const dispatch = useDispatch();

  let ids = [];

  if (conversations) {
    for (const key in conversations) {
      if (conversations[key]) {
        ids.push(key);
      }
    }
  }
  
  const handleChangeConversation = id => {
    dispatch(updateCurrentId(id));
    navigation.navigate('Chat');
    console.log('ids:', ids);
  }

  const handleDeleteConversation = id => {
    Alert.alert('Delete conversation?', 'Choose "Delete" to confirm.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => dispatch(deleteConversation(id))},
    ]);
  }

  // Ref for ScrollView
  const scrollRef = useRef();

  return (
    <View style={{width: '100%', height: '100%'}}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
      >
        <View>
          {
            ids.map(id =>
              conversations[id][0]?.content.length > 0 &&
              <Pressable
                key={id}
                onPress={() => handleChangeConversation(id)}
                onLongPress={() => handleDeleteConversation(id)}
                android_ripple={{
                  color: colors.sec,
                  foreground: true,
                }}
                style={styles.conversation}
              >
                <View style={{gap: 5}}>
                  <Text numberOfLines={2}>
                    <Text style={{fontWeight: 'bold'}}>You: </Text>{conversations[id][0]?.content}
                  </Text>
                  <Text numberOfLines={2}>
                    <Text style={{fontWeight: 'bold'}}>Smartbot: </Text>{conversations[id][1]?.content}
                  </Text>
                </View>
              </Pressable>
            )
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default Conversations;

const styles = StyleSheet.create({
  scrollView: {
  },
  conversation: {
    // backgroundColor: colors.lightGray,
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  }
});