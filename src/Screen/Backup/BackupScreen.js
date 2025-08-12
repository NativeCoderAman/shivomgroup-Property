import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { colors } from '../../Utils/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { getBackupAsyncThunkApi } from '../../Service/slices/backupSlice';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';

const BackupScreen = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state?.root?.auth?.userData);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadAlertVisible, setDownloadAlertVisible] = useState(false);
  const downloadTimeoutRef = useRef(null);

  const handleInputChange = text => {
    setShowError(false);
    setPassword(text.trim());
  };

  const handleSubmit = async () => {
    if (!password) {
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const data = { password };
      const res = await dispatch(getBackupAsyncThunkApi({ token, data }));

      if (res.payload?.status) {
        // Download the file using the URL in the response
        const fileUrl = res.payload?.file_url; // Adjust key to match your API response
        if (fileUrl) {
          startDownload(fileUrl);
        } else {
          console.warn('File URL is missing in the response.');
        }
      } else {
        Alert.alert('Failed', 'Invalid password.');
      }
    } catch (error) {
      console.error('Backup error:', error);
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

  const startDownload = fileUrl => {
    const { config, fs } = RNFetchBlob;
    const downloadDir = fs.dirs.DownloadDir; // Directory for downloads on Android
    const fileName = `backup_${Date.now()}.sql`;
    const filePath = `${downloadDir}/${fileName}`;
  
    // Show alert that download is starting in the background
    Alert.alert('Downloading...', 'The download has started in the background.');
  
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'Downloading backup file',
      },
    })
      .fetch('GET', fileUrl)
      .progress((received, total) => {
        const progress = (received / total) * 100;
        const percentage = Math.round(progress);
  
      })
      .then(res => {
        // After download completes
        Alert.alert('Download Completed', `File saved to ${res.path()}`);
      })
      .catch(err => {
        console.error('Download error:', err);
        Alert.alert('Download Failed', 'An error occurred while downloading the file.');
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setPassword('');
      setShowPassword(true);
      setShowError(false);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backup your data</Text>
      <Text style={styles.subtitle}>Please verify your password</Text>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputView}>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={colors.darkgrey}
          value={password}
          onChangeText={handleInputChange}
          secureTextEntry={showPassword}
          maxLength={20}
          style={styles.inputBox}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color={colors.black}
          />
        </Pressable>
      </View>

      {showError && (
        <Text style={styles.error}>Error: Password should not be empty.</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.white} size="large" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </Pressable>

      {/* {downloadAlertVisible && (
        <View style={styles.downloadAlert}>
          <Text style={styles.downloadText}>
            Downloading... {Math.round(downloadProgress)}%
          </Text>
        </View>
      )} */}
    </View>
  );
};

export default BackupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '10%',
    paddingVertical: 50,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 50,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: colors.darkgrey,
    paddingVertical: 15,
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  label: {
    color: colors.black,
    fontSize: 15,
    marginBottom: 5,
    fontWeight: '500',
  },
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.AppDefaultColor,
    overflow: 'hidden',
    paddingRight: 10,
  },
  inputBox: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '500',
    color: colors.black
  },
  error: {
    color: colors.red,
    fontWeight: '500',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: colors.AppDefaultColor,
    height: 45,
    borderRadius: 5,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  downloadAlert: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  downloadText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
