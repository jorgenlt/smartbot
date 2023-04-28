# SmartBot - Powered by ChatGPT
## A native Android app created with React Native on the Expo framework.

### How to build and run app
* Run `npm install`
* Create a .env in the root folder and add your ChatGPT API key like this: `API_KEY=YOUR API KEY HERE`
* Run `eas secret:push --scope project --env-file .env` to add the API key to the Expo EAS
* Test the app with `npx expo start`
* Install and log in to Expo: `npm install -g eas-cli` then `eas login`
* Bulid .apk by running `eas build -p android --profile preview`

</br>

<img src="https://user-images.githubusercontent.com/108831121/235083888-31d6536b-86a8-414f-9e74-6cb1fb936726.jpg" alt="SmartBot Screenshot" width="400"/>
