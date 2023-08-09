import { Pressable, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NoMessages(props) {
    return (
        <View style={styles.clearChatBtnWrapper} >
            <Pressable
              onPress={props.clearChat}
              style={styles.clearChatBtnPressable}
              android_ripple={{color: '#81D99D', radius: 160}}
            >
              <MaterialIcons name="delete" size={24} color="#f5f5f5" />
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
      },
      clearChatBtnPressable: {
        backgroundColor: '#2C5D6E',
        width: '100%',
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
      },
      clearChatBtn: {
        color: '#f5f5f5',
        fontWeight: 500,
        marginLeft: 5,
      }
  });
  