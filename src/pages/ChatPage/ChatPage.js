import { StyleSheet, View, Alert, Share } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";
import ChatHeader from "../../components/headers/ChatHeader";
import { addConversation } from "../../features/chat/chatSlice";
import { capitalize } from "../../common/utils/capitalize";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const ChatPage = ({ navigation }) => {
  const currentId = useSelector((state) => state.chat.currentId);
  const conversations = useSelector((state) => state.chat.conversations);
  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  const conversation = conversations[currentId]?.messages;

  // Function to share content
  const handleShare = async (content) => {
    try {
      const result = await Share.share({
        message: content,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // Function to share entire conversation
  const shareConversation = async () => {
    impactAsync(ImpactFeedbackStyle.Light);
    const fullConversation = conversation
      .map((msg) => `${capitalize(msg.role)}: ${msg.content}`)
      .join("\n\n");
    await handleShare(fullConversation);
  };

  useFocusEffect(() => {
    if (!currentId) {
      dispatch(addConversation());
    }
  });

  return (
    <>
      <ChatHeader shareConversation={shareConversation} />
      <View style={styles.container}>
        <View style={{ width: "100%", height: "100%" }}>
          <Conversation />
          <ChatInput navigation={navigation} />
        </View>
      </View>
    </>
  );
};

export default ChatPage;

const styling = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].pri,
      alignItems: "center",
    },
    messagesWrapper: {
      backgroundColor: colors[theme].pri,
      paddingHorizontal: 5,
    },
    messageWrapperUser: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginVertical: 10,
    },
    messageWrapperAssistant: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginVertical: 10,
    },
    messageUser: {
      backgroundColor: colors[theme].messageUser,
      color: colors[theme].text,
      borderRadius: 20,
      borderTopRightRadius: 2,
      padding: 10,
    },
    messageAssistant: {
      backgroundColor: colors[theme].messageAssistant,
      color: colors[theme].text,
      borderRadius: 20,
      borderTopLeftRadius: 2,
      padding: 10,
    },
  });
