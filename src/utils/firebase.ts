import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

GoogleSignin.configure({
  webClientId: '860169035588-pnui8nmbvno853fn3pnk1419f2rfbepo.apps.googleusercontent.com', // ✅ already correct
});

export const _signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    console.log('✅ Play services OK');

    const response = await GoogleSignin.signIn();
    console.log('✅ Full response:', JSON.stringify(response, null, 2)); // ← check this

    if (isSuccessResponse(response)) {
      console.log('✅ idToken:', response.data.idToken);
      console.log('✅ email:', response.data.user.email);
      return { userInfo: response.data };
    } else {
      console.log('❌ Not success response:', JSON.stringify(response, null, 2));
      return { userInfo: null };
    }
  } catch (error) {
    console.log('❌ Full error:', JSON.stringify(error, null, 2)); // ← check this
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          Alert.alert('Sign-in already in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert('Play Services Not Available');
          break;
        default:
          Alert.alert(`Error code: ${error.code}`); // ← this will show the actual error
      }
    } else {
      console.log('❌ Unknown error:', error); // ← uncomment this
    }
  }
};