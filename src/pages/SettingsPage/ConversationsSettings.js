import { StyleSheet, View, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Setting from "./Setting";
import Header from "../../components/headers/Header";
import {
  toggleLargeText,
  deleteConversations,
  importConversations,
} from "../../features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import { useMemo } from "react";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { exportConversations } from "./exportConversations";
import { readAsStringAsync } from "expo-file-system";

const ConversationsSettings = () => {
  const theme = useSelector((state) => state.chat.theme);
  const largeText = useSelector((state) => state.chat.largeText);
  const conversations = useSelector((state) => state.chat.conversations);

  const isLargeText = Boolean(largeText);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  const handleToggleLargeText = () => {
    dispatch(toggleLargeText());
  };

  const handleDeleteConversations = () => {
    impactAsync(ImpactFeedbackStyle.Heavy);

    Alert.alert("Delete all conversations?", 'Choose "Delete" to confirm.', [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          dispatch(deleteConversations());
          Alert.alert("", "All conversations deleted.");
        },
      },
    ]);
  };

  const handleExportConversations = () => {
    exportConversations(conversations);
  };

  const handleImportConversations = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      const { uri } = document.assets[0];

      const fileContent = await readAsStringAsync(uri);
      const conversationsObject = JSON.parse(fileContent);

      // Check if uploaded file is valid
      const firstValue = Object.values(conversationsObject)[0];
      const isValid = ["created", "messages"].every((key) =>
        firstValue.hasOwnProperty(key)
      );

      // Throw error if not valid
      if (!isValid) {
        throw new Error("Conversations object is not valid.");
      }

      dispatch(importConversations(conversationsObject));
      Alert.alert("Conversations imported successfully.");
    } catch (error) {
      console.error("Error importing conversations:", error);
      Alert.alert("Error", "Failed to import conversations.");
    }
  };

  return (
    <>
      <Header title={"Conversations"} backButton={true} />
      <View style={styles.settingsWrapper}>
        <Setting
          name="Large text"
          switchButton={true}
          onSwitchButtonPress={handleToggleLargeText}
          switchValue={isLargeText}
        />
        <Setting
          onPress={handleDeleteConversations}
          name="Delete all conversations"
        />
        <Setting
          onPress={handleExportConversations}
          name="Export conversations"
        />
        <Setting
          onPress={handleImportConversations}
          name="Import conversations"
        />
      </View>
    </>
  );
};

export default ConversationsSettings;

const styling = (theme) =>
  StyleSheet.create({
    settingsWrapper: {
      flex: 1,
      backgroundColor: colors[theme].pri,
    },
    pressable: {
      flexDirection: "row",
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
  });
