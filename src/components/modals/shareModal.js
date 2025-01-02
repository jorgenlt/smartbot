import { useMemo } from "react";
import { StyleSheet, Text, View, Modal, Button } from "react-native";
import CancelButton from "../../components/buttons/CancelButton";
import { colors } from "../../styles/colors";

const shareModal = () => {
  const styles = useMemo(() => styling(theme), [theme]);

  return (
    <>
      {/* Modal for share feature */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => {
          setShareModalVisible(false);
        }}
      >
        <View style={styles.modal.centeredView}>
          <View style={styles.modal.modalView}>
            <Text style={styles.modal.modalText}>
              What do you want to share?
            </Text>
            <View style={styles.modal.modalButtonsWrapper}>
              <Button
                title="message"
                onPress={() => "shareSelectedMessage(selectedMessage)"}
              />
              <Button
                title="conversation"
                onPress={() => "shareConversation(conversation)"}
              />
              <CancelButton onPress={() => "setShareModalVisible(false)"} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default shareModal;

const styling = (theme) =>
  StyleSheet.create({
    modal: {
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        paddingHorizontal: 10,
      },
      modalView: {
        margin: 0,
        backgroundColor: colors[theme].modalBg,
        borderRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: "90%",
        alignItems: "center",
        shadowColor: colors[theme].text,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: colors[theme].text,
      },
      modalButtonsWrapper: {
        flexDirection: "row",
        marginTop: 20,
        gap: 20,
      },
    },
  });
