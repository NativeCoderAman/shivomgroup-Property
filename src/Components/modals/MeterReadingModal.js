import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../Utils/Colors';

const MeterReadingModal = ({ visible, onClose, data ,handleMoreInfo}) => {
  // Animated values for opacity and scale
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // Animate the modal when visibility changes
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  // Function triggered when more info is pressed
  const handleInfoPress = () => {
    onClose();
    handleMoreInfo();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose} // Closes modal on Android back press
    >
      {/* Backdrop: Tapping outside closes the modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          {/* Prevent backdrop close when interacting with content */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              {/* Close icon inside the modal */}
              <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Records</Text>
              <View style={styles.readingsColumn}>
                <View style={styles.readingRow}>
                  <Icon
                    name="calendar-today"
                    size={22}
                    color={colors.black}
                    style={styles.readingIcon}
                  />
                  <View style={styles.readingTextContainer}>
                    <Text style={styles.label}>Change Date</Text>
                    <Text style={styles.value}>{data?.date}</Text>
                  </View>
                </View>
                <View style={styles.readingRow}>
                  <Icon
                    name="history"
                    size={22}
                    color="#4caf50"
                    style={styles.readingIcon}
                  />
                  <View style={styles.readingTextContainer}>
                    <Text style={styles.label}>Total Old Reading</Text>
                    <Text style={styles.value}>{data?.total_old_reading}</Text>
                  </View>
                </View>
                <View style={styles.readingRow}>
                  <Icon
                    name="update"
                    size={22}
                    color="#2196f3"
                    style={styles.readingIcon}
                  />
                  <View style={styles.readingTextContainer}>
                    <Text style={styles.label}>New Reading</Text>
                    <Text style={styles.value}>{data?.new_inserted_reading}</Text>
                  </View>
                </View>
                <View style={[styles.readingRow, { borderBottomWidth: 0 }]}>
                  <Icon
                    name="assessment"
                    size={22}
                    color="#ff9800"
                    style={styles.readingIcon}
                  />
                  <View style={styles.readingTextContainer}>
                    <Text style={styles.label}>Total</Text>
                    <Text style={styles.value}>{data?.total_reading}</Text>
                  </View>
                </View>
              </View>
              {/* More info button at bottom right */}
              <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
                <Text style={styles.infoText}>More info</Text>
                <Icon name="info-outline" size={20} color={colors.AppDefaultColor} />
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  readingsColumn: {
    flexDirection: 'column',
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingBottom: 8,
  },
  readingIcon: {
    marginRight: 12,
  },
  readingTextContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  // Added styles for "More info" button
  infoButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
});

export default MeterReadingModal;
