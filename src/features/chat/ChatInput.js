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
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { useDispatch, useSelector } from "react-redux";
import { getChatResponseThunk, updateMessages } from "./chatSlice";
import { turncateString } from "../../common/utils/turncateString";

const ChatInput = ({ navigation }) => {
  const {
    provider: currentProvider,
    name,
    model,
  } = useSelector((state) => state.chat.providers.current);
  const key = useSelector((state) => state.chat.providers[currentProvider].key);

  const [message, setMessage] = useState("");
  const [clickSound, setClickSound] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  // Sound effects
  // Load sound when component mounts
  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/click.mp3")
      );
      setClickSound(sound);
    }

    loadSound();

    // Cleanup
    return clickSound
      ? () => {
          clickSound.unloadAsync();
        }
      : undefined;
  }, []);

  // Play sound
  const playClickSound = async () => {
    if (clickSound) {
      await clickSound.replayAsync();
    }
  };

  const handleSendMessage = () => {
    // Dismiss(hide) the keyboard.
    Keyboard.dismiss();

    if (key) {
      playClickSound();
      if (message) {
        dispatch(getChatResponseThunk(message));
        setMessage("");

        dispatch(
          updateMessages({
            content: message,
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
        placeholderTextColor={colors.gray}
        color={colors.text}
        value={message}
        onChangeText={(value) => setMessage(value)}
        onSubmitEditing={handleSendMessage}
        multiline={true}
      />
      <View style={styles.sendWrapper}>
        <Pressable
          onPress={handleSendMessage}
          android_ripple={{ color: colors.sec }}
          style={styles.pressableSendBtn}
          pressRetentionOffset={{ bottom: 15, left: 15, right: 15, top: 15 }}
        >
          <Entypo name="paper-plane" size={22} color={colors.text} />
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
            <Button title="settings" onPress={handleKeyError} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 40,
    borderRadius: 4,
    backgroundColor: colors.priLighter,
  },
  sendWrapper: {
    position: "absolute",
    bottom: 8,
    right: 8,
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
    color: colors.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  keyInput: {
    marginBottom: 20,
    width: "100%",
    backgroundColor: colors.lightGray,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
  },
});
