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
import { useState, useMemo } from "react";
import { addKey, deleteKey, setProvider, setModel } from "./chatSlice";
import { MaterialIcons } from "@expo/vector-icons";
import Setting from "../../components/Setting";
import { turncateString } from "../../common/utils/turncateString";
import RadioGroup from "react-native-radio-buttons-group";

const ChatSettingsProvider = ({ route }) => {
  const { name, provider } = route.params;

  // Getting data from state
  const theme = useSelector((state) => state.chat.theme);
  const currentProvider = useSelector(
    (state) => state.chat.providers.current.provider
  );
  const providerData = useSelector((state) => state.chat.providers[provider]);

  const { models, model: chosenModel } = providerData;

  const key = providerData.key || "Add key";

  const isCurrent = currentProvider === provider;

  const styles = styling(theme);

  // Modals state
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const [modelModalVisible, setModelModalVisible] = useState(false);

  // API key state
  const [apiKey, setApiKey] = useState("");

  // Select model state
  const [selectedModel, setSelectedModel] = useState(chosenModel);

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

  const radioButtons = useMemo(() => {
    return models.map((model) => {
      return {
        id: model,
        label: model,
        value: model,
        size: 16,
      };
    });
  }, []);

  const handleSetModel = () => {
    dispatch(setModel({ provider, model: selectedModel }));
    setModelModalVisible(false);
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
        settingValue={chosenModel}
      />

      {/* Modals */}
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

            <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedModel}
              selectedId={selectedModel}
              containerStyle={{ alignItems: "flex-start" }}
            />
            <View style={styles.modalButtonsWrapper}>
              <Button title="save" onPress={handleSetModel} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatSettingsProvider;

const styling = (theme) =>
  StyleSheet.create({
    settingsWrapper: {
      flex: 1,
      backgroundColor: colors[theme].pri,
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
      width: "100%",
      backgroundColor: colors[theme].lightGray,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 2,
    },
    modalButtonsWrapper: {
      flexDirection: "row",
      marginTop: 20,
      gap: 10,
    },
  });
