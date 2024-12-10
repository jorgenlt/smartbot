import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  Modal,
  Button,
} from "react-native";
import { useState, useMemo } from "react";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatResponseThunk,
  updateMessages,
} from "../../features/chat/chatSlice";
import { turncateString } from "../../common/utils/truncateString";
import CancelButton from "../../components/buttons/CancelButton";

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
  const [modalVisible, setModalVisible] = useState(false);

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
      setModalVisible(true);
    }
  };

  const handleKeyError = () => {
    setModalVisible(false);
    navigation.navigate("Settings");
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              No key found. Go to settings to choose provider and add key.
            </Text>
            <View style={styles.modalButtonsWrapper}>
              <CancelButton onPress={() => setModalVisible(false)} />
              <Button title="settings" onPress={handleKeyError} />
            </View>
          </View>
        </View>
      </Modal>
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
      borderRadius: 20,
      backgroundColor: colors[theme].priLighter,
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
    keyInput: {
      marginBottom: 20,
      width: "100%",
      backgroundColor: colors[theme].lightGray,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 2,
    },
  });
