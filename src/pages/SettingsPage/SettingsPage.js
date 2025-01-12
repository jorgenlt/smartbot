import { StyleSheet, View, Linking, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import {
  deleteConversations,
  toggleTheme,
  toggleLargeText,
} from "../../features/chat/chatSlice";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Setting from "./Setting";
import Header from "../../components/headers/Header";
import { colors } from "../../styles/colors";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

// URLs
const GITHUB_URL = "https://github.com/jorgenlt/smartbot";
const PROJECTS_URL = "https://jorgenlt.no";

const SettingsPage = ({ navigation }) => {
  const theme = useSelector((state) => state.chat.theme);
  const largeText = useSelector((state) => state.chat.largeText);

  const isDarkMode = theme === "dark";

  const isLargeText = Boolean(largeText);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

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

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleToggleLargeText = () => {
    dispatch(toggleLargeText());
  };

  return (
    <>
      <Header title={"Settings"} />
      <View style={styles.settingsWrapper}>
        <Setting
          onPress={() => navigation.navigate("ProvidersSettings")}
          iconName="rebase-edit"
          name="Change provider/model"
          IconComponent={MaterialIcons}
          submenu={true}
        />
        <Setting
          onPress={() => console.log("Conversations settings")}
          iconName="text-snippet"
          name="Conversations"
          IconComponent={MaterialIcons}
          submenu={true}
        />
        <Setting
          onPress={handleDeleteConversations}
          iconName="delete"
          name="Delete all conversations"
          IconComponent={MaterialIcons}
          submenu={false}
        />
        <Setting
          onPress={() => Linking.openURL(GITHUB_URL)}
          iconName="github"
          name="Source code"
          IconComponent={AntDesign}
          submenu={false}
        />
        <Setting
          onPress={() => Linking.openURL(PROJECTS_URL)}
          iconName="code"
          name="Other projects"
          IconComponent={MaterialIcons}
          submenu={false}
        />
        <Setting
          iconName="text-increase"
          name="Large text"
          IconComponent={MaterialIcons}
          submenu={false}
          switchButton={true}
          onSwitchButtonPress={handleToggleLargeText}
          switchValue={isLargeText}
        />
        <Setting
          iconName="dark-mode"
          name="Dark mode"
          IconComponent={MaterialIcons}
          submenu={false}
          switchButton={true}
          onSwitchButtonPress={handleToggleTheme}
          switchValue={isDarkMode}
        />
      </View>
    </>
  );
};

export default SettingsPage;

const styling = (theme) =>
  StyleSheet.create({
    settingsWrapper: {
      flex: 1,
      backgroundColor: colors[theme].pri,
    },
  });
