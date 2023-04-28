# SmartBot - Powered by ChatGPT
## A native Android app created with React Native on the Expo framework.

## Building and Running the App
Follow the steps below to build and run the SmartBot app:

1. Install the app dependencies by running `npm install`.
2. Create a .env file in the root folder and add your ChatGPT API key in the following format: `API_KEY=YOUR API KEY HERE`.
3. Install and log on to Expo by running `npm install -g eas-cli` and then `eas login`.
4. Push the API key to the Expo EAS by running `eas secret:push --scope project --env-file .env`.
5. Test the app using `npx expo start`.
6. Build the .apk file by running `eas build -p android --profile preview`.

</br>

<img src="https://user-images.githubusercontent.com/108831121/235083888-31d6536b-86a8-414f-9e74-6cb1fb936726.jpg" alt="SmartBot Screenshot" width="400"/>
