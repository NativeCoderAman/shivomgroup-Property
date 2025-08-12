import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, { useCallback} from 'react';
import {colors} from '../Utils/Colors';
import {horizontalScale, moderateScale, verticalScale} from '../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Render_Stats = ({value, setValue, data, icon}) => {
  const handlePress = useCallback(
    item => {
      setValue(item);
    },
    [setValue],
  );

  const StatsCard = ({title, count, icon}) => {
    return (
      <View
        style={[
          styles.statsCard,
          {
            borderColor:
              value === title ? colors.AppDefaultColor : colors.white,
          },
        ]}>
        <View style={styles.cicle}>
          <Text style={styles.stats_count}>{count}</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            paddingTop: verticalScale(10),
          }}>
          <Icon name={icon ? icon : 'bed'} color={colors.black} size={30} />
        </View>
        <View>
          <Text no style={styles.stats_title}>
            {title}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.stats_setion}>
      {data ? (
        data.map((item, i) => (
          <Pressable key={i} onPress={() => handlePress(item.title)}>
            <StatsCard title={item.title} count={item.value} icon={icon} />
          </Pressable>
        ))
      ) : null}
    </ScrollView>
  );
};
export default Render_Stats;

const styles = StyleSheet.create({
  stats_setion: {
    flexDirection: 'row',
    backgroundColor: 'transperent',
    gap: horizontalScale(12),
    alignItems: 'center',
    paddingTop: horizontalScale(25),
    paddingBottom: horizontalScale(12),
    paddingHorizontal: horizontalScale(12),
  },
  statsCard: {
    width: horizontalScale(130),
    height: verticalScale(100),
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: horizontalScale(10),
    padding: horizontalScale(10),
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 2,
  },
  stats_count: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: colors.orange,
  },
  stats_title: {
    fontSize: moderateScale(12),
    color: colors.grey,
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  cicle: {
    height: horizontalScale(40),
    width: horizontalScale(40),
    borderRadius: horizontalScale(20),
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: horizontalScale(45),
    marginTop: verticalScale(-25),
  },
});
