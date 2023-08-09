import { Text, View, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';


export default function Input(props) {
    return (
        <View style={styles.inputWrapper}>
          <TextInput
          style={styles.input}
          placeholder='Type here...'
          placeholderTextColor='#C0ECCE'
          color='#f5f5f5'
          value={props.currentUserMessage}
          onChangeText={props.handleOnChangeText}
          onSubmitEditing={props.handleSendMessage}
          />
          <Pressable 
            onPress={props.handleSendMessage}
            android_ripple={{color: '#81D99D', radius: 20}}
            style={styles.pressableSendBtn}
            pressRetentionOffset={{bottom: 15, left: 15, right: 15, top: 15}}
          >
            <Text style={styles.sendBtn} >
              <Entypo name="paper-plane" size={22} color="white" />
            </Text>
          </Pressable>
          <View style={styles.activityIndicator}>
            {props.loading && <ActivityIndicator size={35} color="#81D99D" />}
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
        borderColor: '#81D99D',
        borderWidth: 1,
        borderRadius: 4,
        color: '#f5f5f5',
        backgroundColor: '#2C5D6E'
      },
      pressableSendBtn: {
        height: 40, 
        width: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 20
      },
      sendBtn: {
        color: '#f5f5f5',
        fontWeight: 500
      },
      activityIndicator: {
        position: 'absolute',
        zIndex: 100,
        bottom: 5,
        right: 55
      }
});
  