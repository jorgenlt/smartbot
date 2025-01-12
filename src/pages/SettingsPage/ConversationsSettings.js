import { StyleSheet, View, Alert } from "react-native";
import Setting from "./Setting";
import Header from "../../components/headers/Header";
// import { resetProviders } from "../../features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import { useMemo } from "react";
// import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const ProvidersSettings = ({ navigation }) => {
  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  const dispatch = useDispatch();

  return (
    <>
      <Header title={"Conversations Settings"} backButton={true} />
      <View style={styles.settingsWrapper}>
        <Setting
          // onPress={() => navigation.navigate("OpenAI")}
          onPress={() => console.log("setting pressed")}
          name="setting"
          submenu={false}
        />
      </View>
    </>
  );
};

export default ProvidersSettings;

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
