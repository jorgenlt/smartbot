import { StyleSheet, View, Alert } from "react-native";
import Setting from "./Setting";
import Header from '../../components/headers/Header'
import { resetProviders } from "../../features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import { useMemo } from "react";

const ChatSettings = ({ navigation }) => {
  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  const handleResetProviders = () => {
    Alert.alert(
      "Reset to default providers settings?",
      "Saved keys will not be deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => {
            dispatch(resetProviders());
            Alert.alert("", "Provider settings was set to default");
          },
        },
      ]
    );
  };

  return (
    <>
    <Header title={"Change provider/model"} />
    <View style={styles.settingsWrapper}>
      <Setting
        onPress={() => navigation.navigate("OpenAI")}
        name="OpenAI"
        submenu={true}
        />
      <Setting
        onPress={() => navigation.navigate("Anthropic")}
        name="Anthropic"
        submenu={true}
        />
      <Setting
        onPress={() => navigation.navigate("Mistral")}
        name="Mistral"
        submenu={true}
        />
      <Setting onPress={handleResetProviders} name="Reset to default" />
    </View>
        </>
  );
};

export default ChatSettings;

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
