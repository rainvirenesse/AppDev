import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CustomButton = ({
  containerStyle = {},
  label = '',
  textStyle = {},
  onPress = () => {},
  loading = false,
  disabled = false,
}) => {
  const { width } = Dimensions.get('window');
  const isDisabled = loading || disabled;
// const CustomButton = ({ label, onPress }) => {
  return (
    // <View>
    //   <TouchableOpacity
    //     onPress={onPress}
    //     style={{
    //       margin: 10,
    //       backgroundColor: 'blue',
    //       borderRadius: 10,
    //     }}
    //   >
    //     <View style={{ padding: 10 }}>
    //       <Text
    //         style={{
    //           color: 'white',
    //           fontSize: 15,
    //         }}
    //       >
    //         {label}
    //       </Text>
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={{
          opacity: isDisabled ? 0.7 : 1,
        }}
      >
        <View style={{ padding: width * 0.014, alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="small" color="#099232" />
          ) : (
            <Text style={textStyle}>{label}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;