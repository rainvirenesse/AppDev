import { StyleSheet, Text, TextInput, TextInputProps, View, TextStyle, ViewStyle } from 'react-native';

const CustomTextInput = ({
  placeholder = '',
  label = '',
  labelStyle = {},
  value = '',
  onChangeText = () => {},
  containerStyle = {},
  textStyle = {},
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  }: {
  placeholder?: string;
  label?: string;
  labelStyle?: TextStyle;
  value?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4A8B0"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.input, textStyle]}
        />
      </View>
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C0203A',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    fontSize: 14,
    color: '#2A0A10',
    padding: 0,
    margin: 0,
  },
});