import Toast from 'react-native-toast-message';


export const showToast = (type: any, text1: any, text2: any, position: any) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    position: position,
  });
};