import { useRef, useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import * as Clipboard from "expo-clipboard";
import { format } from "date-fns";
import uuid from "react-native-uuid";
import { colors, chat, base } from "../../styles/colors";
import { Flow } from "react-native-animated-spinkit";

const Messages = () => {
  const [typingSound, setTypingSound] = useState();

  const { currentId, conversations, error, status, theme } = useSelector(
    (state) => state.chat
  );

  const styles = useMemo(() => styling(theme), [theme]);

  const messages = conversations[currentId]?.messages;

  const date = conversations[currentId]?.created;

  let formatedDate;
  if (date) {
    formatedDate = format(date, "LLLL d, y");
  }

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

  // Creating the message elements to render in the ScrollView.
  let messageElements;

  if (messages) {
    messageElements = messages.map((message) => {
      return (
        <View
          style={
            message.role === "assistant"
              ? styles.messageWrapperAssistant
              : styles.messageWrapperUser
          }
          key={uuid.v4()}
        >
          <Pressable
            style={
              message.role === "assistant"
                ? styles.messageAssistant
                : styles.messageUser
            }
            onLongPress={() => handleShare(message.content)}
            onPress={() => handleCopyToClipboard(message.content)}
          >
            <Text>{message.content}</Text>
          </Pressable>
        </View>
      );
    });
  }

  // Ref for ScrollView
  const scrollRef = useRef();

  // Sound effects
  // Load sound when component mounts
  useEffect(() => {
    async function loadTypingSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/typing.mp3")
      );
      setTypingSound(sound);
    }

    loadTypingSound();

    // Cleanup
    return typingSound
      ? () => {
          typingSound.unloadAsync();
        }
      : undefined;
  }, []);

  // Function to play sound
  const playTypingSound = async () => {
    if (typingSound) {
      await typingSound.replayAsync();
    }
  };

  // Play typing sound when status is 'loading'
  useEffect(() => {
    if (status === "loading") {
      playTypingSound();
    } else if (typingSound && status === "idle") {
      // Stop typing sound
      typingSound.stopAsync();
    }
  }, [status]);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.messagesWrapper}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current.scrollToEnd({ animated: false })
        }
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.date}>
          <Text style={styles.dateText}>{formatedDate}</Text>
        </View>

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
    </>
  );
};

export default Messages;

const styling = (theme) =>
  StyleSheet.create({
    messagesWrapper: {
      paddingHorizontal: 5,
      paddingBottom: 20,
      width: "100%",
    },
    messageWrapperUser: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginVertical: 10,
      width: "100%",
    },
    messageWrapperAssistant: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginVertical: 10,
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
    noMessagesWrapper: {
      height: "100%",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    noMessages: {
      fontSize: 18,
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
  });
