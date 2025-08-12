import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const ComingSoonCard = () => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = new Animated.Value(1);
  
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.card, 
        { 
          transform: [{ scale: scaleValue }],
        }
      ]}>
        <LinearGradient
          colors={['#ffc107', '#ffab00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Ribbon Badge */}
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>NEW</Text>
          </View>
          
          {/* Special Offer Label */}
          {/* <Text style={styles.offerLabel}>Special Offer</Text> */}
          
          {/* Icon with adjusted spacing */}
          <View style={styles.iconContainer}>
            <Icon name="time-outline" size={48} color="#FFF" />
          </View>
          
          {/* Main Title with adjusted spacing */}
          <Text style={styles.title}>Coming Soon</Text>
          
          {/* Description with adjusted line spacing */}
          <Text style={styles.description}>
            Exciting new features launching soon!{'\n'}Stay tuned for exclusive deals.
          </Text>
          
          {/* Countdown Timer with adjusted spacing */}
          <View style={styles.countdownContainer}>
            <View style={styles.countdownItem}>
              <Text style={styles.countdownNumber}>07</Text>
              <Text style={styles.countdownLabel}>Days</Text>
            </View>
            <View style={[styles.countdownItem, styles.countdownMiddle]}>
              <Text style={styles.countdownNumber}>12</Text>
              <Text style={styles.countdownLabel}>Hours</Text>
            </View>
            <View style={styles.countdownItem}>
              <Text style={styles.countdownNumber}>45</Text>
              <Text style={styles.countdownLabel}>Mins</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 290,
    height: 260, 
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    marginHorizontal: 8, // Added side margin
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 24,
    position: 'relative',
  },
  ribbon: {
    position: 'absolute',
    top: 16,
    right: -28,
    backgroundColor: '#808080',
    paddingVertical: 3,
    paddingHorizontal: 30,
    transform: [{ rotate: '45deg' }],
  },
  ribbonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  offerLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    // marginBottom: 12, // Increased from 8
    overflow: 'hidden',
  },
  iconContainer: {
    // marginVertical: 10, // Adjusted spacing
    // padding: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 22, // Increased line height
    marginBottom: 18, // Increased from 16
    paddingHorizontal: 20,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6, // Reduced from 8
  },
  countdownItem: {
    alignItems: 'center',
    marginHorizontal: 6, // Reduced from 12
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: 56,
  },
  countdownMiddle: {
    marginHorizontal: 8, // Different spacing for middle item
  },
  countdownNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  countdownLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2, // Reduced from 4
    letterSpacing: 0.3,
  },
});

export default ComingSoonCard;