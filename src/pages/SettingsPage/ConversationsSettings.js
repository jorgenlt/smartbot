import { StyleSheet, View, Alert } from "react-native";
import Setting from "./Setting";
import Header from "../../components/headers/Header";
import {
  toggleLargeText,
  deleteConversations,
} from "../../features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import { useMemo } from "react";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const ConversationsSettings = () => {
  const theme = useSelector((state) => state.chat.theme);
  const largeText = useSelector((state) => state.chat.largeText);
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
    console.log("handleExportConversations");
  };

  const handleImportConversations = () => {
    console.log("handleImportConversations");
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
