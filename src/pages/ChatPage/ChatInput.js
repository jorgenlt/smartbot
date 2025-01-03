import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import {
  getChatResponseThunk,
  updateMessages,
} from "../../features/chat/chatSlice";
import { turncateString } from "../../common/utils/truncateString";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const ChatInput = ({ navigation }) => {
  const {
    provider: currentProvider,
    name,
    model,
  } = useSelector((state) => state.chat.providers.current);

  const key = useSelector((state) => state.chat.providers[currentProvider].key);

  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  const [prompt, setPrompt] = useState("");

  const dispatch = useDispatch();

  const handleSendPrompt = () => {
    // Dismiss(hide) the keyboard.
    Keyboard.dismiss();

    if (key) {
      if (prompt) {
        dispatch(getChatResponseThunk(prompt));
        setPrompt("");

        dispatch(
          updateMessages({
            content: prompt.trim(),
            role: "user",
          })
        );
      }
    } else {
      impactAsync(ImpactFeedbackStyle.Heavy); // Haptic feedback

      Alert.alert(
        "No key found",
        "Go to settings to choose provider and add key.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Settings",
            onPress: () => navigation.navigate("Settings"),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={`${name} (${turncateString(model, 30)})`}
        placeholderTextColor={colors[theme].gray}
        color={colors[theme].text}
        value={prompt}
        onChangeText={(value) => setPrompt(value)}
        onSubmitEditing={handleSendPrompt}
        multiline={true}
      />
      <View style={styles.sendWrapper}>
        <Pressable
          onPress={handleSendPrompt}
          android_ripple={{ color: colors[theme].sec }}
          style={styles.pressableSendBtn}
          pressRetentionOffset={{ bottom: 15, left: 15, right: 15, top: 15 }}
        >
          <Entypo name="paper-plane" size={22} color={colors[theme].text} />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatInput;

const styling = (theme) =>
  StyleSheet.create({
    inputWrapper: {
      position: "relative",
      margin: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      flex: 1,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 50,
      borderRadius: 50,
      backgroundColor: colors[theme].priLighter,
      minHeight: 50,
    },
    sendWrapper: {
      position: "absolute",
      bottom: 9,
      right: 15,
      borderRadius: 20,
      overflow: "hidden",
    },
    pressableSendBtn: {
      height: 30,
      width: 30,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
    },
    sendBtn: {
      color: colors[theme].white,
    },
    keyInput: {
      marginBottom: 20,
      width: "100%",
      backgroundColor: colors[theme].lightGray,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 2,
    },
  });
