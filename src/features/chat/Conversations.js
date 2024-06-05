import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId, deleteConversation } from "./chatSlice";
import { format, formatDistance } from "date-fns";
import { capitalizeFirstWord } from "../../common/utils/capitalizeFirstWord";
import { colors } from "../../styles/colors";
import { FontAwesome } from "@expo/vector-icons";

const Conversations = ({ navigation }) => {
  const conversations = useSelector((state) => state.chat.conversations);
  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [filterKeywords, setFilterKeywords] = useState("");

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

  const handleToggleFilter = () => {
    setFilterIsOpen(!filterIsOpen);
  };

  const handleClearFilter = () => {
    setFilterKeywords("");
  };

  const getLastMessageDate = (conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.created;
  };

  const filterConversations = (id) => {
    const conversation = conversations[id].messages;
    const keyword = filterKeywords.toLowerCase().trim();

    return conversation.some((message) =>
      message.content.toLowerCase().includes(keyword)
    );
  };

  const ConversationList = () => {
    const conversationElements = useMemo(() => {
      if (!ids) return [];

      const sortedIds = ids.filter(filterConversations).sort((a, b) => {
        const aDate = getLastMessageDate(conversations[a]);
        const bDate = getLastMessageDate(conversations[b]);
        return aDate - bDate; // Sort in ascending order (oldest first)
      });

      return sortedIds.map((id) => {
        // Formatting date
        const date = getLastMessageDate(conversations[id]);
        const formattedDate = format(date, "LLLL d, y");
        const timeAgo = formatDistance(date, new Date(), { addSuffix: true });

        // Setting user message and assistant message
        const conversation = conversations[id].messages;
        const lastTwoItems = conversation.slice(-2);
        const userObject = lastTwoItems.find((item) => item.role === "user");
        const assistantObject = lastTwoItems.find(
          (item) => item.role === "assistant"
        );
        const userMessage = userObject ? userObject.content : "";
        const assistantMessage = assistantObject ? assistantObject.content : "";

        return (
          <Pressable
            key={id}
            onPress={() => handleChangeConversation(id)}
            onLongPress={() => handleDeleteConversation(id)}
            style={styles.conversationPressable}
          >
            <View style={styles.conversationPressable.conversationWrapper}>
              <View style={styles.date}>
                <Text style={styles.dateText}>{formattedDate}</Text>
                <Text style={styles.dateText}>
                  {capitalizeFirstWord(timeAgo)}
                </Text>
              </View>
              <Text
                numberOfLines={2}
                style={styles.conversationPressable.messageWrapper}
              >
                <Text style={styles.conversationPressable.role}>You: </Text>
                {userMessage}
              </Text>
              <Text
                numberOfLines={2}
                style={styles.conversationPressable.messageWrapper}
              >
                <Text style={styles.conversationPressable.role}>
                  Smartbot:{" "}
                </Text>
                {assistantMessage}
              </Text>
            </View>
          </Pressable>
        );
      });
    }, [
      ids,
      conversations,
      handleDeleteConversation,
    ]);

    return <>{conversationElements}</>;
  };

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
        <ConversationList />
      </ScrollView>

      {!filterIsOpen && (
        <Pressable style={styles.searchIcon} onPress={handleToggleFilter}>
          <FontAwesome name="search" size={32} color={colors[theme].icon} />
        </Pressable>
      )}

      {filterIsOpen && (
        <View style={styles.filterWrapper}>
          <TextInput
            style={styles.filterInput}
            placeholder="Filter conversations..."
            value={filterKeywords}
            onChangeText={setFilterKeywords}
          />
          <View style={styles.clearWrapper}>
            <Pressable
              onPress={filterKeywords ? handleClearFilter : handleToggleFilter}
              style={styles.pressableClearBtn}
            >
              <Text style={styles.pressableClearBtn.text}>
                {filterKeywords ? "CLEAR" : "CLOSE"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default Conversations;

const styling = (theme) =>
  StyleSheet.create({
    conversationsWrapper: {
      width: "100%",
      height: "100%",
      backgroundColor: colors[theme].pri,
    },
    scrollView: {},
    conversationPressable: {
      borderBottomColor: colors[theme].lightGray,
      borderBottomWidth: 0.5,
      paddingHorizontal: 20,
      paddingVertical: 20,
      justifyContent: "center",
      conversationWrapper: {
        gap: 5,
      },
      messageWrapper: {
        color: colors[theme].text,
      },
      role: {
        fontWeight: "bold",
        color: colors[theme].text,
      },
    },
    date: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    dateText: {
      color: colors[theme].gray,
    },
    filterWrapper: {
      position: "relative",
      backgroundColor: colors[theme].white,
      borderTopColor: colors[theme].lightGray,
      borderTopWidth: 1,
    },
    searchIcon: {
      position: "absolute",
      bottom: 16,
      right: 16,
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
