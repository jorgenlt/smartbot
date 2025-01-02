import { StyleSheet, View, Modal, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";
import ChatHeader from "../../components/headers/ChatHeader";
import CancelButton from '../../components/buttons/CancelButton'
import { addConversation } from "../../features/chat/chatSlice";
import { useMemo } from "react";

const ChatPage = ({ navigation }) => {
  const currentId = useSelector((state) => state.chat.currentId);
  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  // State for share modal and selected message
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleShare = () => {
    setShareModalVisible(true)
  }

  useFocusEffect(() => {
    if (!currentId) {
      dispatch(addConversation());
    }
  });

  return (
    <>
      <ChatHeader handleShare={handleShare} />
      <View style={styles.container}>
        <View style={{ width: "100%", height: "100%" }}>
          <Conversation />
          <ChatInput navigation={navigation} />
        </View>
      </View>

      {/* Modal for share feature */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => {
          setShareModalVisible(false);
        }}
      >
        <View style={styles.modal.centeredView}>
          <View style={styles.modal.modalView}>
            <Text style={styles.modal.modalText}>
              What do you want to share?
            </Text>
            <View style={styles.modal.modalButtonsWrapper}>
              <Button
                title="message"
                onPress={() => console.log("shareSelectedMessage(selectedMessage)")}
              />
              <Button
                title="conversation"
                onPress={() => console.log("shareConversation(conversation)")}
              />
              <CancelButton onPress={() => setShareModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
    modal: {
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        paddingHorizontal: 10,
      },
      modalView: {
        margin: 0,
        backgroundColor: colors[theme].modalBg,
        borderRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: "90%",
        alignItems: "center",
        shadowColor: colors[theme].text,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: colors[theme].text,
      },
      modalButtonsWrapper: {
        flexDirection: "row",
        marginTop: 20,
        gap: 20,
      },
    },
  });
