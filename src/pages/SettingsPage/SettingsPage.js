import { StyleSheet, View, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { toggleTheme } from "../../features/chat/chatSlice";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Setting from "./Setting";
import Header from "../../components/headers/Header";
import { colors } from "../../styles/colors";

// URLs
const GITHUB_URL = "https://github.com/jorgenlt/smartbot";
const PROJECTS_URL = "https://jorgenlt.no";

const SettingsPage = ({ navigation }) => {
  const theme = useSelector((state) => state.chat.theme);
  const isDarkMode = theme === "dark";

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <Header title={"Settings"} />
      <View style={styles.settingsWrapper}>
        <Setting
          onPress={() => navigation.navigate("ProvidersSettings")}
          iconName="rebase-edit"
          name="Providers"
          IconComponent={MaterialIcons}
          submenu={true}
        />
        <Setting
          onPress={() => navigation.navigate("ConversationsSettings")}
          iconName="text-snippet"
          name="Conversations"
          IconComponent={MaterialIcons}
          submenu={true}
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
