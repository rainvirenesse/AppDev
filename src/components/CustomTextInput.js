// // import { Text, View } from 'react-native';
// import { Dimensions, Text, View } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';

// const CustomTextInput = ({
//   placeholder,
//   label,
//   labelStyle,
//   value,
//   containerStyle,
//   textStyle,
// }) => {
//   const { width, height } = Dimensions.get('window');

//   return (
//     <View style={containerStyle}>
//       <Text style={labelStyle}>{label}</Text>
//       <TextInput
//         placeholder={placeholder}
//         onChangeText={value}
//         style={[
//           textStyle,
//           {
//             // width: '80%',
//             width: width * 0.5,
//             borderBottomWidth: 1,
//           },
//         ]}
//       />
//     </View>
//   );
// };

// export default CustomTextInput;

import { StyleSheet, Text, TextInput, View } from 'react-native';

const CustomTextInput = ({
  placeholder,
  label,
  labelStyle,
  value,
  containerStyle,
  textStyle,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#C4A8B0"
          onChangeText={value}
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