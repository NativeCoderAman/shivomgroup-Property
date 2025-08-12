import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '../../Utils/Colors';

const RemarkUpdateModal = ({ visible, selectedValue, onClose, handleRemarkSubmit }) => {
  // Local state to track the current selection (using the is_requested property).
  const [currentValue, setCurrentValue] = useState(selectedValue?.is_requested);

  // Update local state when the selectedValue prop changes.
  useEffect(() => {
    setCurrentValue(selectedValue?.is_requested);
  }, [selectedValue]);

  // Animated values for opacity and scale.
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // Animate the modal when the visible prop changes.
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

  // When an option is selected, call the remark submit callback and close the modal.
  const handleSelect = (value) => {
    handleRemarkSubmit(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none" // Using custom animation, so disable the default.
      onRequestClose={onClose} // Support for Android hardware back button.
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContainer,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Text style={styles.title}>Remark Update</Text>
              <View style={styles.optionsContainer}>
                <Option
                  label="Requested"
                  value={1}
                  selectedValue={currentValue}
                  onPress={handleSelect}
                />
                <Option
                  label="Accepted"
                  value={2}
                  selectedValue={currentValue}
                  onPress={handleSelect}
                />
                <Option
                  label="Rejected"
                  value={3}
                  selectedValue={currentValue}
                  onPress={handleSelect}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const Option = ({ label, value, selectedValue, onPress }) => {
  const isSelected = value === selectedValue;
  return (
    <TouchableOpacity
      style={[styles.option, isSelected && styles.selectedOption]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.optionText, isSelected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker semi-transparent backdrop.
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.AppDefaultColor,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: `${colors.AppDefaultColor}20`,
  },
  selectedOption: {
    backgroundColor: colors.AppDefaultColor,
    borderColor: colors.AppDefaultColor,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontWeight: '700',
    color: colors.white,
  },
});

export default RemarkUpdateModal;
