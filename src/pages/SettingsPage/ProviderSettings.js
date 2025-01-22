import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Button,
  Alert,
} from "react-native";
import { colors } from "../../styles/colors";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo } from "react";
import {
  addKey,
  deleteKey,
  setProvider,
  setModel,
} from "../../features/chat/chatSlice";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import Setting from "./Setting";
import Header from "../../components/headers/Header";
import { turncateString } from "../../common/utils/truncateString";
import RadioGroup from "react-native-radio-buttons-group";
import CancelButton from "../../components/buttons/CancelButton";

const ProviderSettings = ({ route }) => {
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

  const styles = useMemo(() => styling(theme), [theme]);

  // Modals state
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const [isKeyFocused, setKeyFocused] = useState(false);
  const [modelModalVisible, setModelModalVisible] = useState(false);

  // API key state
  const [apiKey, setApiKey] = useState(providerData.key || "");

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
      impactAsync(ImpactFeedbackStyle.Heavy);
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
        color: colors.light.text,
      };
    });
  }, []);

  const handleSetModel = () => {
    dispatch(setModel({ provider, model: selectedModel }));
    setModelModalVisible(false);
  };

  return (
    <>
      <Header title={`${name} Settings`} backButton={true} />
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
          <View style={styles.modal.centeredView}>
            <View style={styles.modal.modalView}>
              <Text style={styles.modal.modalText}>Edit key</Text>
              <TextInput
                style={styles.modal.keyInput}
                onChangeText={setApiKey}
                value={apiKey}
                multiline={false}
                placeholder="Paste key"
                inputMode="none"
                borderRadius={4}
                borderWidth={1}
                borderColor={isKeyFocused ? "black" : "gray"}
                onFocus={() => setKeyFocused(true)}
                onBlur={() => setKeyFocused(false)}
              />
              <View style={styles.modal.modalButtonsWrapper}>
                <CancelButton onPress={() => setKeyModalVisible(false)} />
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
          <View style={styles.modal.centeredView}>
            <View style={styles.modal.modalView}>
              <Text style={styles.modal.modalText}>Choose model</Text>

              <RadioGroup
                radioButtons={radioButtons}
                onPress={setSelectedModel}
                selectedId={selectedModel}
                containerStyle={{ alignItems: "flex-start" }}
                labelStyle={{ color: colors.light.text }}
              />
              <View style={styles.modal.modalButtonsWrapper}>
                <CancelButton onPress={() => setModelModalVisible(false)} />
                <Button title="save" onPress={handleSetModel} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default ProviderSettings;

const styling = (theme) =>
  StyleSheet.create({
    settingsWrapper: {
      flex: 1,
      backgroundColor: colors[theme].pri,
    },
    modal: {
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
      },
      modalView: {
        margin: 0,
        backgroundColor: colors.light.modalBg,
        borderRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: "90%",
        alignItems: "center",
        shadowColor: colors.light.text,
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
        color: colors.light.text,
        fontWeight: "bold",
      },
      keyInput: {
        minWidth: "80%",
        backgroundColor: colors.light.whiteDarker,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 2,
      },
      modalButtonsWrapper: {
        flexDirection: "row",
        marginTop: 20,
        gap: 20,
      },
    },
  });
