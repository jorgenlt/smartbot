import { StyleSheet, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { addConversation } from "./chatSlice";

const Chat = ({ navigation }) => {
  const currentId = useSelector((state) => state.chat.currentId);
  const theme = useSelector((state) => state.chat.theme);

  const styles = styling(theme)
  
  console.log(theme)

  const dispatch = useDispatch();

  useFocusEffect(() => {
    if (!currentId) {
      dispatch(addConversation());
    }
  });


  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: "100%" }}>
        <Messages />
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
