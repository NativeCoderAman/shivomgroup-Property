import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {horizontalScale} from '../../Utils/Metrics';

const StarRatigs = ({rating, onStarPress, size}) => {
  const totalStars = 5;
  return (
    <View style={styles.StarRow}>
      {[...Array(totalStars)].map((_, index) => (
        <TouchableOpacity key={index} onPress={() => onStarPress(index + 1)}>
          <Icon
            name={index < rating ? 'star' : 'star-o'}
            size={size ? size : 25}
            color={index < rating ? 'gold' : 'gray'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRatigs;

const styles = StyleSheet.create({
  StarRow: {
    flexDirection: 'row',
    gap: horizontalScale(5),
  },
});
