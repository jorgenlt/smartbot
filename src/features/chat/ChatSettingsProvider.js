import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Button,
} from "react-native";
import { colors } from "../../styles/colors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addKey } from "./chatSlice";
import { MaterialIcons } from "@expo/vector-icons";

const ChatSettingsProvider = ({ route }) => {
  const { name, provider } = route.params;

  const keys = useSelector((state) => state.chat.keys);

  const key = keys[provider] ? keys[provider] : "Add key";

  const [modalVisible, setModalVisible] = useState(false);

  const [apiKey, setApiKey] = useState("");

  const dispatch = useDispatch();

  const handleAddKey = () => {
    if (apiKey) {
      setModalVisible(false);
      dispatch(addKey({ provider, apiKey }));
    }
  };

  return (
    <View style={styles.settingsWrapper}>
      <View style={styles.pressable}>
        <Text style={styles.pressableText}>{name}</Text>
      </View>
      <Pressable
        style={styles.pressable}
        onPress={() => setModalVisible(true)}
        android_ripple={{
          color: colors.sec,
          foreground: true,
        }}
      >
        <Text style={styles.text} numberOfLines={1}>
          {key}
        </Text>
        <MaterialIcons name="edit" size={24} color="black" />
      </Pressable>

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
            <Text style={styles.modalText}>Edit key</Text>
            <TextInput
              style={styles.keyInput}
              onChangeText={setApiKey}
              value={apiKey}
              placeholder="Paste key"
              inputMode="none"
            />
            <Button title="save" onPress={handleAddKey} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatSettingsProvider;

const styles = StyleSheet.create({
  settingsWrapper: {
    flex: 1,
  },
  pressable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  pressableText: {
    fontSize: 20,
    fontWeight: 600,
    marginLeft: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
    marginLeft: 10,
    fontWeight: "normal",
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
