import { StyleSheet, Text, ScrollView, View, Pressable } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentId } from './chatSlice'
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
        console.log('conversations[key]:', conversations[key]);
      }
    }
  }
  
  const handleChangeConversation = id => {
    dispatch(updateCurrentId(id));
    navigation.navigate('Chat');
    console.log('ids:', ids);
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
              <Pressable
                key={id}
                onPress={() => handleChangeConversation(id)}
                android_ripple={{
                  color: colors.sec,
                  foreground: true,
                }}
                style={styles.conversation}
              >
                <Text numberOfLines={2} >
                  You: {conversations[id][0]?.content}
                  {"\n"}
                  Smartbot: {conversations[id][1]?.content}
                </Text>
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
    // alignItems: 'center', 
    // justifyContent: 'center',
    // justifyContent: 'flex-end',
    // marginTop: 10,
    // paddingHorizontal: 5,
    // paddingVertical: 10,
    // marginVertical: 20,
    height: '100%',
  },
  conversation: {
    // backgroundColor: colors.chatListConversatioins,
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 20,
    justifyContent: 'center',
    // borderRadius: 10
  }
});