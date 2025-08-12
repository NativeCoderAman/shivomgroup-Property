import { 
  Alert, 
  ToastAndroid 
} from "react-native";

const alertMessage = (msg) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
};
export default alertMessage;