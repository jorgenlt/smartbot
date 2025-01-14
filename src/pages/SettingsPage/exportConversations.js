import { documentDirectory, writeAsStringAsync } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";

export const exportConversations = async (conversations) => {
  try {
    // Convert conversations object to a JSON string
    const conversationsJson = JSON.stringify(conversations, null, 2);

    // Define the file path
    const fileUri = `${documentDirectory}conversations-${Date.now()}.json`;

    // Write the JSON string to a file
    await writeAsStringAsync(fileUri, conversationsJson);

    // Check if sharing is available on the device and share the file
    if (await isAvailableAsync()) {
      await shareAsync(fileUri);
    } else {
      alert("Sharing is not available on this device");
    }
  } catch (error) {
    console.error("Error exporting conversations:", error);
  }
};
