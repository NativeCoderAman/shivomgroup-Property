import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, memo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
const {height} = Dimensions.get('window');
import {colors} from '../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import alertMessage from '../../Utils/alert';
import Regular_Registeration from '../../Components/register/Regular_Registeration';
import Old_Registrations from '../../Components/register/Old_Registrations';
import Queue_Registration from '../../Components/register/Queue_Registration';
import {
  handleBasicRegisterDetails,
  getOldStudentRegisterThunkAPI,
  getSelfRegisterStudentsThunkAPI,
} from '../../Service/slices/RegisterSlice';

const Register_Candidate_Screen = ({navigation}) => {
  const scrollY = new Animated.Value(0);
  const [selectedHeader, setSelectedHeader] = useState(0);

  const {registerBasicDataResponse} = useSelector(
    state => state.root.registerData,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedHeader === 0) {
          await dispatch(handleBasicRegisterDetails());
        } else {
          // Handle other cases when selectedHeader changes
          switch (selectedHeader) {
            case 3:
              await dispatch(getOldStudentRegisterThunkAPI());
              break;
            case 5:
              await dispatch(getSelfRegisterStudentsThunkAPI());
              break;
            default:
              await dispatch(handleBasicRegisterDetails());
              break;
          }
        }
      } catch (err) {
        alertMessage('Something went wrong');
      }
    };

    fetchData();
  }, [selectedHeader, dispatch]);

  const RenderAddBtn = memo(() => (
    <View style={[styles.addbtn, styles.shadow]}>
      <TouchableOpacity onPress={() => navigation.navigate('Add_Registration')}>
        <Icon name={'plus'} size={25} color={colors.white} />
      </TouchableOpacity>
    </View>
  ));

  return (
    <View style={styles.container}>
      {/* Horizontal Scroll Header */}
      <View style={styles.headerContainer}>
        <FlatList
          horizontal
          data={registerBasicDataResponse?.response}
          renderItem={({item, index}) => (
            <Pressable
              style={[
                styles.headerItem,
                selectedHeader === index && styles.selectedHeaderItem,
              ]}
              onPress={() => setSelectedHeader(index)}>
              <View
                style={[
                  styles.statsCard,
                  {
                    borderColor:
                      selectedHeader === index
                        ? colors.AppDefaultColor
                        : colors.white,
                  },
                ]}>
                <View style={styles.circle}>
                  <Text style={styles.stats_count}>{item.value}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <Icon name={'address-card'} color={colors.black} size={30} />
                </View>
                <View>
                  <Text style={styles.stats_title}>{item.title}</Text>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {registerBasicDataResponse?.response.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: selectedHeader === index ? 10 : 6,
                height: selectedHeader === index ? 10 : 6,
                backgroundColor:
                  selectedHeader === index
                    ? colors.AppDefaultColor
                    : colors.grey,
              },
            ]}
          />
        ))}
      </View>

      {/* Vertical Scroll Content */}

      {(selectedHeader === 0 ||
        selectedHeader === 1 ||
        selectedHeader === 3) && <Regular_Registeration scrollY={scrollY} />}
      {selectedHeader === 2 && <Old_Registrations />}
      {selectedHeader === 4 && <Queue_Registration scrollY={scrollY} />}

      <RenderAddBtn />
    </View>
  );
};

export default memo(Register_Candidate_Screen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '13%',
  },
  headerContainer: {
    height: height * 0.17, // 20% of the screen height
  },
  headerItem: {
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  statsCard: {
    width: 130,
    height: 100,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.orange,
  },
  stats_title: {
    fontSize: 12,
    color: colors.orange,
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 45,
    marginTop: -25,
  },
  iconContainer: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: 4,
    backgroundColor: colors.black,
  },
  contentItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    height: 400,
  },
  contentText: {
    fontSize: 16,
    color: '#000', // Black text
  },

  addbtn: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: colors.AppDefaultColor,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 70,
    right: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
