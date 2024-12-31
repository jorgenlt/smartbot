import { Text, StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { colors } from "../../styles/colors";

const Header = ({ title }) => {
  const theme = useSelector((state) => state.chat.theme);
  const styles = useMemo(() => styling(theme), [theme]);

  return (
    <View style={styles.container}>
      <View>
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
    text: {
      color: colors[theme].white,
      fontSize: 20,
      fontWeight: "500",
    },
  });
