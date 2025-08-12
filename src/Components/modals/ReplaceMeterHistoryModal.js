import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import reverseDateFormat from '../../Utils/dateFormat';

const ReplaceMeterHistoryModal = ({ visible, onClose, data }) => {
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

  // Render each data item as a modern styled card
  const renderCard = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Record {index + 1}</Text>
      </View>
      <View style={styles.cardRow}>
        <Icon name="date-range" size={16} color="#777" style={styles.icon} />
        <Text style={styles.cardLabel}>Date:</Text>
        <Text style={styles.cardValue}>{reverseDateFormat(item?.date)}</Text>
      </View>
      <View style={styles.cardRow}>
        <Icon name="meeting-room" size={16} color="#777" style={styles.icon} />
        <Text style={styles.cardLabel}>Room No:</Text>
        <Text style={styles.cardValue}>{item?.roomno}</Text>
      </View>
      <View style={styles.cardRow}>
        <Icon name="history" size={16} color="#777" style={styles.icon} />
        <Text style={styles.cardLabel}>Old Reading:</Text>
        <Text style={styles.cardValue}>{item?.old_meter_reading}</Text>
      </View>
      <View style={styles.cardRow}>
        <Icon name="update" size={16} color="#777" style={styles.icon} />
        <Text style={styles.cardLabel}>New Reading:</Text>
        <Text style={styles.cardValue}>{item?.new_meter_reading}</Text>
      </View>
      <View style={styles.cardRow}>
        <Icon name="assessment" size={16} color="#777" style={styles.icon} />
        <Text style={styles.cardLabel}>Total Reading:</Text>
        <Text style={styles.cardValue}>{item?.total_old_reading}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none" // We'll animate manually
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              {/* Close Icon */}
              <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
              {/* Modal Title */}
              <Text style={styles.headerTitle}>Replace Meter History</Text>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  modalContainer: {
    width: '90%',
    maxHeight: '80%', // Fixed modal height with scrollable content
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  listContent: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
    flex: 1,
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default ReplaceMeterHistoryModal;
