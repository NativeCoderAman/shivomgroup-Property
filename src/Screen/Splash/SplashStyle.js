import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../Utils/Colors';
import {fontSize, radious} from '../../Utils/Size';
const {width, height} = Dimensions.get('screen');
export const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    textAlign: 'center',
    marginTop: height / 2.2,
    fontSize: fontSize.Splash,
    fontWeight: '600',
    color: colors.white,
  },
  modalcontaner: {
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: radious.radiousfive,
  },
  modaltxt: {
    color: colors.black,
    fontSize: fontSize.lable,
    paddingVertical: '5%',
    textAlign: 'center',
    paddingHorizontal: '5%',
  },
});
