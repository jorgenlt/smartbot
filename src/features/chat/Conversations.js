import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId, deleteConversation } from "./chatSlice";
import { format, formatDistance } from "date-fns";
import { capitalizeFirstWord } from "../../common/utils/capitalizeFirstWord";
import { findObject } from "../../common/utils/findObject";
import { colors } from "../../styles/colors";

const Conversations = ({ navigation }) => {
  const { conversations } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const [filterKeyword, setFilterKeyword] = useState("");

  const ids = conversations ? Object.keys(conversations) : [];

  const handleChangeConversation = (id) => {
    dispatch(updateCurrentId(id));
    navigation.navigate("Chat");
  };

  const handleDeleteConversation = (id) => {
    Alert.alert("Delete conversation?", 'Choose "Delete" to confirm.', [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => dispatch(deleteConversation(id)),
      },
    ]);
  };

  const handleClearFilter = () => {
    setFilterKeyword("");
  };

  const filterConversations = (id) => {
    const conversation = conversations[id].messages;
    const keyword = filterKeyword.toLowerCase();

    return conversation.some((message) =>
      message.content.toLowerCase().includes(keyword)
    );
  };

  let conversationElements;

  if (ids) {
    conversationElements = ids.filter(filterConversations).map((id) => {
      // Formatting date
      const date = conversations?.[id]?.created;
      const formatedDate = format(date, "LLLL d, y");
      const timeAgo = formatDistance(date, new Date(), { addSuffix: true });

      // Setting user message and assistant message
      const conversation = conversations[id].messages;
      const lastTwoItems = conversation.slice(-2);
      const userObject = findObject(lastTwoItems, "role", "user");
      const assistantObject = findObject(lastTwoItems, "role", "assistant");
      const userMessage = userObject ? userObject.content : "";
      const assistantMessage = assistantObject ? assistantObject.content : "";

      return (
        <Pressable
          key={id}
          onPress={() => handleChangeConversation(id)}
          onLongPress={() => handleDeleteConversation(id)}
          style={styles.conversation}
        >
          <View style={{ gap: 5 }}>
            <View style={styles.date}>
              <Text style={styles.dateText}>{formatedDate}</Text>
              <Text style={styles.dateText}>
                {capitalizeFirstWord(timeAgo)}
              </Text>
            </View>
            <Text numberOfLines={2}>
              <Text style={{ fontWeight: "bold" }}>You: </Text>
              {userMessage}
            </Text>
            <Text numberOfLines={2}>
              <Text style={{ fontWeight: "bold" }}>Smartbot: </Text>
              {assistantMessage}
            </Text>
          </View>
        </Pressable>
      );
    });
  }

  // Ref for ScrollView
  const scrollRef = useRef();

  return (
    <View style={styles.conversationsWrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current.scrollToEnd({ animated: false })
        }
      >
        <View>{conversationElements}</View>
      </ScrollView>
      <View style={styles.filterWrapper}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter conversations..."
          value={filterKeyword}
          onChangeText={setFilterKeyword}
        />

        {filterKeyword && (
          <View style={styles.clearWrapper}>
            <Pressable
              onPress={handleClearFilter}
              style={styles.pressableClearBtn}
            >
              <Text style={styles.pressableClearBtn.text}>CLEAR</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default Conversations;

const styles = StyleSheet.create({
  conversationsWrapper: {
    width: "100%",
    height: "100%",
  },
  scrollView: {},
  conversation: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
  },
  date: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateText: {
    color: colors.gray,
  },
  filterWrapper: {
    position: "relative",
    shadowColor: "black",
    elevation: 1,
  },
  filterInput: {
    borderRadius: 4,
    padding: 10,
  },
  clearWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: "100%",
    paddingVertical: 10,
    paddingRight: 10,
    width: 80,
  },
  pressableClearBtn: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    text: {
      fontWeight: "bold",
      color: "black",
    },
  },
});
