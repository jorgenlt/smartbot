import { StyleSheet, Text, ScrollView, View, Pressable, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentId, deleteConversation } from './chatSlice'
import { useRef } from 'react';
import { format, formatDistance } from 'date-fns'
import { capitalizeFirstWord } from '../../common/utils/capitalizeFirstWord'
import { findObject } from '../../common/utils/findObject'
import { colors } from '../../styles/colors'

const Conversations = ({ navigation }) => {
  const { conversations } = useSelector(state => state.chat);

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
  }

  const handleDeleteConversation = id => {
    Alert.alert('Delete conversation?', 'Choose "Delete" to confirm.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete', 
        onPress: () => dispatch(deleteConversation(id))
      },
    ]);
  }

  let conversationElements;

  if (ids) {
    conversationElements = ids.map(id => {
      // Formatting date
      const date = conversations?.[id]?.created;
      const formatedDate = format(date, 'LLLL d, y');
      const timeAgo = formatDistance(date, new Date(), { addSuffix: true });

      // Setting user message and assistant message
      const conversation = conversations[id].messages;
      const lastTwoItems = conversation.slice(-2);
      const userObject = findObject(lastTwoItems, 'role', 'user');
      const assistantObject = findObject(lastTwoItems, 'role', 'assistant');
      const userMessage = userObject ? userObject.content : '';
      const assistantMessage = assistantObject ? assistantObject.content : '';

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
              <Text style={styles.dateText}>{formatedDate}</Text>
              <Text style={styles.dateText}>{capitalizeFirstWord(timeAgo)}</Text>
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