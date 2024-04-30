import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Button,
  Alert,
} from "react-native";
import { colors } from "../../styles/colors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addKey, deleteKey } from "./chatSlice";
import { MaterialIcons } from "@expo/vector-icons";

const ChatSettingsProvider = ({ route }) => {
  const { name, provider } = route.params;

  const keys = useSelector((state) => state.chat.keys);

  const key = keys[provider] ? keys[provider] : "Add key";

  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const [modelModalVisible, setModelModalVisible] = useState(false);

  const [apiKey, setApiKey] = useState("");

  const dispatch = useDispatch();

  const handleAddKey = () => {
    if (apiKey) {
      setKeyModalVisible(false);
      dispatch(addKey({ provider, apiKey }));
    }
  };

  const handleDeleteKey = () => {
    Alert.alert(`Delete ${name} API key?`, 'Choose "Delete" to confirm.', [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          dispatch(deleteKey({ provider }));
          Alert.alert("", `${name} API key deleted.`);
          setKeyModalVisible(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.settingsWrapper}>
      <View style={styles.setting}>
        <Text style={styles.header}>{name}</Text>
      </View>
      <Pressable
        style={styles.setting}
        // style={styles.pressable}
        onPress={() => setKeyModalVisible(true)}
        android_ripple={{
          color: colors.sec,
          foreground: true,
        }}
      >
        <View>
          <Text style={styles.settingDescription}>Key</Text>
        </View>
        <View style={styles.settingValue}>
          <Text style={styles.settingValue.text} numberOfLines={1}>
            {key}
          </Text>
        </View>
      </Pressable>
      <Pressable
        // style={styles.pressable}
        style={styles.setting}
        onPress={() => setModelModalVisible(true)}
        android_ripple={{
          color: colors.sec,
          foreground: true,
        }}
      >
        <View>
          <Text style={styles.settingDescription}>Model</Text>
        </View>
        <View style={styles.settingValue}>
          <Text style={styles.settingValue.text} numberOfLines={1}>
            Choose model
          </Text>
        </View>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={keyModalVisible}
        onRequestClose={() => {
          setKeyModalVisible(!keyModalVisible);
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
            <View style={styles.modalButtonsWrapper}>
              <Button title="delete" onPress={handleDeleteKey} />
              <Button title="save" onPress={handleAddKey} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modelModalVisible}
        onRequestClose={() => {
          setModelModalVisible(!modelModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose model</Text>

            <View style={styles.modalButtonsWrapper}>
              <Button title="save" onPress={() => console.log("pressed")} />
            </View>
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingDescription: {
    fontSize: 20,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingValue: {
    fontSize: 14,
    maxWidth: "70%",
    text: {
      color: colors.gray,
    },
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
  modalButtonsWrapper: {
    flexDirection: "row",
    gap: 10,
  },
});
