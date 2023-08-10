import { Text } from 'react-native';
import { useSelector } from 'react-redux'

const Test = () => {
  const testString = useSelector(state => state.chat.test)
  const apiUrl = process.env.EXPO_PUBLIC_API_KEY;
  return (
    <>
      <Text>{testString[0]}</Text>
      <Text>{apiUrl}</Text>
    </>
  )
}

export default Test