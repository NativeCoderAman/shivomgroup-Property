import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

export const PickImage = (setImageUrl,width,height) => {
  ImagePicker.openPicker({
    width: width ? width : 400,
    height: height ? height : 300,
    cropping: true,
    multiple: false,
  })
    .then(async (image) => {
      const imageName = image.filename || image.path.split('/').pop();
      const fileSizeInKB = image.size / 1024;

      // Check if the image size is greater than 1024 KB (1 MB)
      if (fileSizeInKB > 1024) {
        try {
          const compressedImage = await ImageResizer.createResizedImage(
            image.path,
            width,  // New width
            height,  // New height
            'jpg', // Format
            80,    // Quality percentage (adjust as needed)
            0,     // Rotation
            undefined,
            Platform.OS === 'ios' ? undefined : false
          );

          setImageUrl(compressedImage.uri);  // Use the compressed image
        } catch (error) {
          Alert.alert('Error compressing image');
        }
      } else {
        setImageUrl(image.path);  // Use the original image if it's small enough
      }
    })
    .catch((e) => {
      if (e.message !== 'User cancelled image selection') {
        Alert.alert('Something went wrong');
      } else {
      }
    });
};
export const RemoveImage = (imagepath, setPath) => {
  ImagePicker.cleanSingle(imagepath)
    .then(() => {
      setPath('');
    })
    .catch(e => {
      Alert.alert(e);
    });
};
