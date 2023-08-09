import { Pressable, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors'

export default function NoMessages(props) {
    return (
        <View style={styles.clearChatBtnWrapper} >
            <Pressable
              onPress={props.clearChat}
              style={styles.clearChatBtnPressable}
              android_ripple={{color: colors.sec}}
            >
              <MaterialIcons name="delete" size={24} color={colors.white} />
              <Text style={styles.clearChatBtn}>
                CLEAR CHAT
              </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    clearChatBtnWrapper: {
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 16,
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 4,
        overflow: 'hidden'
      },
      clearChatBtnPressable: {
        backgroundColor: colors.priLighter,
        width: '100%',
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      clearChatBtn: {
        color: colors.white,
        fontWeight: 500,
        marginLeft: 5,
      }
  });
  