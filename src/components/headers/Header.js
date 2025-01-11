import { Text, StyleSheet, View, Pressable } from "react-native";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = ({ title, backButton }) => {
  const theme = useSelector((state) => state.chat.theme);
  const styles = useMemo(() => styling(theme), [theme]);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        {backButton && (
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        )}
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;

const styling = (theme) =>
  StyleSheet.create({
    container: {
      height: 80,
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: colors[theme].black,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      color: colors[theme].white,
      fontSize: 20,
      fontWeight: "500",
    },
    backButton: {
      paddingRight: 10,
    },
  });
