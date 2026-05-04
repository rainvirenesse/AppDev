import { StyleSheet, View } from 'react-native';
import CustomButton from './CustomButton';

const BRAND = '#35051d';
const GOLD  = '#C9A96E';

const CustomCom = ({ label, onPress, loading }) => {
  return (
    <View style={styles.wrapper}>
      <CustomButton
        label={label}
        onPress={onPress}
        loading={loading}
        containerStyle={styles.btnDynamic}
        textStyle={styles.btnDynamicText}
      />

       </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  btnDynamic: {
    backgroundColor: GOLD,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnDynamicText: {
    color: BRAND,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  btnStatic: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  btnStaticText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default CustomCom;