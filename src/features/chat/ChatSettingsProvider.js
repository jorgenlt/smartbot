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
import { addKey, deleteKey, setProvider } from "./chatSlice";
import { MaterialIcons } from "@expo/vector-icons";
import Setting from "../../components/Setting";
import { turncateString } from "../../common/utils/turncateString";

const ChatSettingsProvider = ({ route }) => {
  const { name, provider } = route.params;

  const key =
    useSelector((state) => state.chat.providers[provider].key) || "Add key";

  const model =
    useSelector((state) => state.chat.providers[provider].model) ||
    "No model chosen";

  const models = useSelector((state) => state.chat.providers[provider].models);

  const { provider: currentProvider, model: currentModel } = useSelector(
    (state) => state.chat.providers.current
  );

  const isCurrent = currentProvider === provider;

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

  const handleSetProvider = () => {
    if (!isCurrent) {
      dispatch(setProvider({ provider }));
      Alert.alert("", `${name} set as provider`);
    }
  };

  return (
    <View style={styles.settingsWrapper}>
      <Setting
        onPress={handleSetProvider}
        name={
          isCurrent
            ? `${name} is your current provider`
            : `Set ${name} as provider`
        }
      />

      <Setting
        onPress={() => setKeyModalVisible(true)}
        name="Key"
        settingValue={turncateString(key, 20)}
      />
      <Setting
        onPress={() => setModelModalVisible(true)}
        name="Model"
        settingValue={isCurrent && currentModel ? currentModel : model}
      />

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
