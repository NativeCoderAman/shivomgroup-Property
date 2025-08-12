import React, { useState, useEffect } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const ComingSoonModal = ({ children, onClose }) => {
  // State to disable pointer events for immediate background interaction
  const [pointerDisabled, setPointerDisabled] = useState(false);

  // Use animated values for modal scale and backdrop opacity.
  const scaleValue = new Animated.Value(0);
  const backdropOpacity = new Animated.Value(1);

  useEffect(() => {
    // Animate modal open: scale in and ensure backdrop is visible.
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 1, // instant, if needed
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    // Disable pointer events on backdrop immediately so the background works.
    setPointerDisabled(true);

    // Animate the backdrop to disappear, and animate the modal container scaling down.
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 100, // fade out the backdrop quickly
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  return (
    <Modal
      transparent
      visible
      animationType="none"
      onRequestClose={onClose}>
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        // Use the local pointerDisabled state to set pointerEvents immediately
        pointerEvents={pointerDisabled ? 'none' : 'auto'}>
        <Pressable style={styles.backdropPressable} onPress={handleClose}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
            <Icon name="hourglass-half" size={50} color="#FF5722" style={styles.iconStyle} />
            <Text style={styles.modalText}>
              {children || "It's on the way, coming soon!"}
            </Text>
            <Pressable style={styles.okButton} onPress={handleClose}>
              <Text style={styles.okButtonText}>OK</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconStyle: {
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  okButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ComingSoonModal;
