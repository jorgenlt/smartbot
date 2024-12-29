import { useRef, useState, useEffect, useMemo, use } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Share,
  Alert,
  Modal,
  Button,
} from "react-native";
import CancelButton from "../../components/buttons/CancelButton";
import * as Clipboard from "expo-clipboard";
import { formatDate } from "../../common/utils/formatDate";
import { colors, chat } from "../../styles/colors";
import { Flow } from "react-native-animated-spinkit";

const Conversation = () => {
  const { currentId, conversations, error, status, theme } = useSelector(
    (state) => state.chat
  );

  const styles = useMemo(() => styling(theme), [theme]);

  const conversation = conversations[currentId]?.messages;

  // State for share modal and selected message
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  // Function to copy text(messages) to clipboard.
  const handleCopyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("", "Copied to Clipboard.");
  };

  // Share message
  const handleShare = async (message) => {
    try {
      const result = await Share.share({
        message: message,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // Handle long press to show modal
  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setShareModalVisible(true);
  };

  // Function to share entire conversation
  const shareConversation = async (conversation) => {
    const fullConversation = conversation
      .map((msg) => msg.content)
      .join("\n\n");
    await handleShare(fullConversation);
    setShareModalVisible(false);
  };

  // Function to share selected message
  const shareSelectedMessage = async (selectedMessage) => {
    await handleShare(selectedMessage);
    setShareModalVisible(false);
  };

  // Creating the message elements to render in the ScrollView.
  let messageElements;

  if (conversation) {
    messageElements = conversation.map((message, i) => {
      const { created, content, role } = message;

      // Formatted dates
      const formattedCreated = formatDate(created);
      const formattedPrevMsgCreated = conversation[i - 1]?.created
        ? formatDate(conversation[i - 1].created)
        : null;

      return (
        <View key={i}>
          {/* If message is created on a different date than the prev message, 
          show the created date */}
          {formattedCreated !== formattedPrevMsgCreated && (
            <View style={styles.date}>
              <Text style={styles.dateText}>{formattedCreated}</Text>
            </View>
          )}
          <View
            style={
              role === "assistant"
                ? styles.messageWrapperAssistant
                : styles.messageWrapperUser
            }
          >
            <Pressable
              style={
                role === "assistant"
                  ? styles.messageAssistant
                  : styles.messageUser
              }
              onLongPress={() => handleLongPress(content)}
              onPress={() => handleCopyToClipboard(content)}
            >
              <Text>{content}</Text>
            </Pressable>
          </View>
        </View>
      );
    });
  }

  // Ref for ScrollView
  const scrollRef = useRef();

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.conversationWrapper}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current.scrollToEnd({ animated: false })
        }
        showsHorizontalScrollIndicator={false}
      >
        {messageElements}

        {status === "loading" && (
          <View style={styles.messageWrapperAssistant}>
            <View style={styles.flowLoader}>
              <Flow size={30} color="#202020" />
            </View>
          </View>
        )}
      </ScrollView>
      {error && <Text>{error}</Text>}

      {/* Modal for share feature */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => {
          setShareModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>What do you want to share?</Text>
            <View style={styles.modalButtonsWrapper}>
              <Button
                title="message"
                onPress={() => shareSelectedMessage(selectedMessage)}
              />
              <Button
                title="conversation"
                onPress={() => shareConversation(conversation)}
              />
              <CancelButton onPress={() => setShareModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Conversation;

const styling = (theme) =>
  StyleSheet.create({
    conversationWrapper: {
      paddingHorizontal: 10,
      width: "100%",
    },
    messageWrapperUser: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginVertical: 5,
    },
    messageWrapperAssistant: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginVertical: 5,
    },
    messageUser: {
      backgroundColor: chat.messageUserBg,
      color: colors[theme].text,
      borderRadius: 20,
      borderTopRightRadius: 2,
      padding: 10,
      maxWidth: "90%",
    },
    messageAssistant: {
      backgroundColor: chat.messageAssistantBg,
      color: colors[theme].text,
      borderRadius: 20,
      borderTopLeftRadius: 2,
      padding: 10,
      maxWidth: "90%",
    },
    flowLoader: {
      padding: 15,
      alignItems: "center",
      backgroundColor: chat.messageAssistantBg,
      color: colors[theme].loader,
      borderRadius: 20,
      borderTopLeftRadius: 2,
    },
    date: {
      width: "100%",
      alignItems: "center",
      marginTop: 10,
    },
    dateText: {
      color: colors[theme].gray,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0,
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
  });
