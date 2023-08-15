import { StyleSheet, Text, ScrollView, View, Pressable, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentId, deleteConversation } from './chatSlice'
import { useRef } from 'react';
import { format, formatDistance, subDays } from 'date-fns'
import { colors } from '../../styles/colors'

const Conversations = ({ navigation }) => {
  const conversations = useSelector(state => state.chat.conversations);

  const dispatch = useDispatch();

  let ids = [];

  if (conversations) {
    for (const key in conversations) {
      if (conversations[key]) {
        ids.push(key);
        console.log(key);
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

  let conversationElements;
  if (ids) {
    conversationElements = ids.map(id => {
      const date = conversations?.[id]?.created;
      const formatedDate = format(date, 'LLLL d, y');
      const timeAgo = formatDistance(date, new Date(), { addSuffix: true });

      const userMessage = conversations[id].messages[0]?.content;
      const assistantMessage = conversations[id].messages[1]?.content;

      return (
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
            <View style={styles.date}>
              <Text style={styles.dateText}>{timeAgo}</Text>
              <Text style={styles.dateText}>{formatedDate}</Text>
            </View>
            <Text numberOfLines={2}>
              <Text style={{fontWeight: 'bold'}}>You: </Text>{userMessage}
            </Text>
            <Text numberOfLines={2}>
              <Text style={{fontWeight: 'bold'}}>Smartbot: </Text>{assistantMessage}
            </Text>
          </View>
        </Pressable>
      )
    })
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
          {conversationElements}
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
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  dateText: {
    color: colors.gray
  }
});