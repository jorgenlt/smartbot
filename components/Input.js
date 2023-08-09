import { Text, View, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../styles/colors'


export default function Input(props) {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
      style={styles.input}
      placeholder='Message Smartbot...'
      placeholderTextColor={colors.text}
      color={colors.text}
      value={props.currentUserMessage}
      onChangeText={props.handleOnChangeText}
      onSubmitEditing={props.handleSendMessage}
      />
      <View style={styles.sendWrapper}>
        <Pressable 
        onPress={props.handleSendMessage}
        android_ripple={{color: colors.sec,}}
        style={styles.pressableSendBtn}
        pressRetentionOffset={{bottom: 15, left: 15, right: 15, top: 15}}
        >
          <Text style={styles.sendBtn} >
            <Entypo name="paper-plane" size={22} color={colors.text} />
          </Text>
        </Pressable>
      </View>
      <View style={styles.activityIndicator}>
        {props.loading && <ActivityIndicator size={35} color={colors.text} />}
      </View>
    </View>
  )
}
  
const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    marginTop: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    marginEnd: 10,
    height: 45,
    borderRadius: 4,
    backgroundColor: colors.priLighter
  },
  sendWrapper: {
    borderRadius: 20,
    overflow: 'hidden'
  },
  pressableSendBtn: {
    height: 40, 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20
  },
  sendBtn: {
    color: colors.white,
    fontWeight: 500
  },
  activityIndicator: {
    position: 'absolute',
    zIndex: 100,
    bottom: 5,
    right: 55
  }
});
  