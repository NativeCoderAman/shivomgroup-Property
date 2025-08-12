import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../Utils/Colors';

const NotificationCard = ({currentVersion, newVersion}) => {
  if (!newVersion || newVersion === currentVersion) return null; // Only show when a new version is available

  const handleUpdatePress = () => {
    Linking.openURL('https://mysmartpg.com/product/');
  };

  return (
    <View style={styles.container}>
      <Icon
        name="system-update"
        size={28}
        color={colors.white}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Update Available!</Text>
        <Text style={styles.message}>
          A new version ({newVersion}) is available with improvements and new
          features. Update now for a better experience!
        </Text>
      </View>
      <TouchableOpacity onPress={handleUpdatePress} style={styles.updateButton}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.orange,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
    elevation: 3, // Adds a slight shadow effect
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  message: {
    fontSize: 11,
    color: colors.white,
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  updateText: {
    fontWeight: 'bold',
    color: colors.orange,
  },
});

export default NotificationCard;
