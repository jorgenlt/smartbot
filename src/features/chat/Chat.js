import { StyleSheet, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";
import { addConversation } from "./chatSlice";
import { useMemo } from "react";

const Chat = ({ navigation }) => {
  const currentId = useSelector((state) => state.chat.currentId);
  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  useFocusEffect(() => {
    if (!currentId) {
      dispatch(addConversation());
    }
  });

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: "100%" }}>
        <Conversation />
        <ChatInput navigation={navigation} />
      </View>
    </View>
  );
};

export default Chat;

const styling = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].pri,
      paddingVertical: 0,
      paddingHorizontal: 5,
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
