// ImagePickerComponent.js
import React, { memo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { colors } from '../../Utils/Colors';

const MAX_SIZE = 1024 * 1024; // 1 MB in bytes

const ImagePickerComponent = memo(({ label, fieldName, value, setFieldValue, error, handleImageView, disabled,width,height }) => {
  const [loader, setLoader] = useState(disabled);
  useEffect(()=>{
    setLoader(disabled);
  },[disabled]);

  const handleMediaPicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: width ? width : 300,
        height: height ? height : 400,
        cropping: true,
        multiple: false,
      });
      let imageSize = (image.size / 1048576).toFixed(1);

      let finalImage = image;

      if (imageSize > 1) {
        finalImage = await compressImage(image);
        setFieldValue(fieldName, {
          uri: finalImage.uri,
          type: finalImage.mime,
          name: finalImage.filename || `image_${Date.now()}.jpg`,
        });
      } else {
        setFieldValue(fieldName, {
          uri: image.path,
          type: image.mime,
          name: image.filename || `image_${Date.now()}.jpg`,
        });
      }

      // Set the image in Formik state

    } catch (err) {
      if (err.code === 'E_PICKER_CANCELLED') {
        // User cancelled the picker, no action needed
      } else {
        console.error('Image Picker Error:', err); // Handle other errors
      }
    }
  };

  const compressImage = async (image) => {
    let quality = 100; // Start with 100% quality
    let compressedImage = image;
    let lastCompressedImage = image;
    let closestImageSize = Infinity;

    try {
      do {
        compressedImage = await ImageResizer.createResizedImage(
          image.path,
          800, // Desired width
          800, // Desired height
          'JPEG',
          quality,
          0
        );

        // Get the size of the compressed image
        const newImageSize = compressedImage.size / 1048576;

        // If the new size is between 0.95 MB and 1 MB, use this image
        if (newImageSize <= 1 && newImageSize >= 0.95) {
          return {
            uri: compressedImage.uri,
            mime: 'image/jpeg',
            filename: compressedImage.name,
            size: compressedImage.size,
          };
        }

        // Keep track of the closest image size to 1 MB
        if (newImageSize < closestImageSize && newImageSize < 1) {
          lastCompressedImage = compressedImage;
          closestImageSize = newImageSize;
        }

        // Reduce quality to further compress the image if necessary
        quality -= 5;
      } while (compressedImage.size > 1048576 && quality > 10); // Continue until size <= 1MB or quality is too low

      // Return the last successfully compressed image that is closest to 1 MB
      return {
        uri: lastCompressedImage.uri,
        mime: 'image/jpeg',
        filename: lastCompressedImage.name,
        size: lastCompressedImage.size,
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      return {
        uri: image.path,
        mime: 'image/jpeg',
        filename: `image_${Date.now()}.jpg`,
        size: image.size,
      };
    }
  };



  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.labelView}>{label}</Text>
        <TouchableOpacity style={styles.inputView} onPress={handleMediaPicker} disabled={disabled}>
          <Text style={styles.imageText}>
            {value ? value.name : 'Select an image'}
          </Text>

          {value ? (
            <TouchableOpacity style={styles.iconContainer} onPress={() => handleImageView(value.uri)}>
               <MaterialCommunityIcons name="file-image" size={20} color={colors.green} />
            </TouchableOpacity>
          ) : (
            <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="black" style={styles.icon} />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View>
          <Text style={styles.errorTxt}>
            {error}
          </Text>
        </View>
      )}
    </>
  );
});

export default ImagePickerComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 0.5,
    // borderColor: error ? colors.red : colors.grey,
    vordercolor: colors.grey,
    marginBottom: 7,
    backgroundColor: "#d9d9d9",
  },
  labelView: {
    width: '30%',
    color: colors.black,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    backgroundColor: colors.white,
    height: '100%',
  },
  imageText: {
    width: '85%',
    paddingLeft: 20,
    color: colors.black,
    fontSize: 10,
  },
  iconContainer: {
    width: '15%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '15%',
  },
  errorTxt: {
    color: colors.red,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '500',
  }
});