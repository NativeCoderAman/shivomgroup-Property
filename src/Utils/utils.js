import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {Alert, BackHandler} from 'react-native';

export const handleBackPress = (navigation, currentRoute) => {
  if (
    !currentRoute ||
    currentRoute === 'dashboard' ||
    currentRoute === 'TabNavigation'
  ) {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        {text: 'No', onPress: () => null, style: 'cancel'},
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ],
      {cancelable: false},
    );
    return true;
  } else if (
    ['sales', 'Expenses', 'Registration', 'Actions'].includes(currentRoute)
  ) {
    navigation.navigate('dashboard');
    return true;
  } else if (currentRoute === 'Registartion_View') {
    navigation.reset({
      index: 0,
      routes: [{name: 'Registration'}],
    });
  }
  {
    navigation.goBack();
    return true;
  }
};

export const useBackHandler = currentRoute => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress(navigation, currentRoute);
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation, currentRoute]),
  );
};

export const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});
