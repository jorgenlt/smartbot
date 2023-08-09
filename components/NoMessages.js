import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../styles/colors'

export default function NoMessages() {
    return (
        <View style={styles.noMessagesWrapper}>
            <Text style={styles.noMessages}>Ask Smartbot a question! 👇</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    noMessagesWrapper: {
      position: 'absolute',
      top: '50%',
      width: '100%',
      zIndex: 99,
      justifyContent: 'center',
      alignItems: 'center'
    },
    noMessages: {
      color: colors.text,
      fontSize: 16
    }
  });
  