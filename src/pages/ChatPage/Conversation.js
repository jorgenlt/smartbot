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
import { formatDate } from "../../common/utils/formatDate";
import { colors, chat } from "../../styles/colors";
import { Flow } from "react-native-animated-spinkit";

const Conversation = () => {
  const [typingSound, setTypingSound] = useState();

  const { currentId, conversations, error, status, theme } = useSelector(
    (state) => state.chat
  );

  const styles = useMemo(() => styling(theme), [theme]);

  const conversation = conversations[currentId]?.messages;

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
              onLongPress={() => handleShare(content)}
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
  });
