import { StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions, FlatList, RefreshControl, PanResponder } from 'react-native';
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { colors } from '../../Utils/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { activePlansPermissionsThunkApi } from '../../Service/slices/profileDataSlice';

const SWIPE_THRESHOLD = 30;
const screenWidth = Dimensions.get('window').width;


const Permissions_Screen = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.root.auth.userData);
  const { activePlansPermissionsResponse } = useSelector(state => state.profileData);

  // Fetch permission data
  useEffect(() => {
    if (token) {
      dispatch(activePlansPermissionsThunkApi(token));
    }
  }, [dispatch, token]);

  // Refresh permission data
  const onRefresh = useCallback(() => {
    if (token) {
      dispatch(activePlansPermissionsThunkApi(token));
    }
  }, [dispatch, token]);

  const [permission, setPermission] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Separate animated values for each tab's background color
  const planTabBackgroundColor = useRef(new Animated.Value(1)).current; // 1 for active, 0 for inactive
  const addonTabBackgroundColor = useRef(new Animated.Value(0)).current; // 1 for active, 0 for inactive

  // Animated value for content transition
  const translateX = useRef(new Animated.Value(0)).current;

  // Handle tab press and animate background colors
  const handlePermissionToggle = useCallback((isPlan) => {
    setPermission(isPlan);

    // Animate the tab background color based on active tab
    Animated.parallel([
      Animated.timing(planTabBackgroundColor, {
        toValue: isPlan ? 1 : 0, // Plan tab is active when `isPlan` is true
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(addonTabBackgroundColor, {
        toValue: isPlan ? 0 : 1, // Addon tab is active when `isPlan` is false
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(translateX, {
        toValue: isPlan ? 0 : 1, // Content slides based on active tab
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [translateX, planTabBackgroundColor, addonTabBackgroundColor]);

  // Interpolated background colors for each tab
  const planBackgroundColor = planTabBackgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f1f1f1', colors.orange], // Inactive to Active
  });

  const addonBackgroundColor = addonTabBackgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f1f1f1', colors.orange], // Inactive to Active
  });

  // Generalized function to parse both plan and addon permissions
  const parsePermissions = useCallback((obj, parentKey = "") => {
    const result = [];
    Object.entries(obj || {}).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey} > ${key}` : key;
      if (typeof value === 'object' && value !== null) {
        result.push(...parsePermissions(value, newKey));
      } else {
        result.push({ key: newKey, value });
      }
    });
    return result;
  }, []);

  const permissionArray = parsePermissions(activePlansPermissionsResponse?.response?.planPermission);
  const addOnPermissionArray = parsePermissions(activePlansPermissionsResponse?.response?.addOnPermission);

  // Memoized renderItem to avoid unnecessary re-renders
  const renderItem = useCallback(({ item }) => (
    <View style={styles.permissionView}>
      <Text style={styles.black}>{item.key}</Text>
    </View>
  ), []);

  // Function to render the FlatList content
  const renderPermissionList = useCallback((dataArray) => (
    <Animated.FlatList
      data={dataArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      initialNumToRender={10} // Render 10 items initially
      maxToRenderPerBatch={5} // Render 5 items per batch
      removeClippedSubviews={true} // Unmount items that are offscreen
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  ), [refreshing, onRefresh, renderItem]);

  // Swipe detection using PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Detect if it's a horizontal swipe
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swiped left, show Addon Permissions
          handlePermissionToggle(false);
        } else if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swiped right, show Plan Permissions
          handlePermissionToggle(true);
        }
      }
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>

      <View style={{ alignItems: "flex-end", marginRight: 20, marginBottom:10  }}>
        <TouchableOpacity style={{ backgroundColor: "grey", paddingVertical: 14, borderRadius: 8, paddingHorizontal:12 }}>
          <Text style={{color:"#ffff",fontWeight:"500"}}>Update </Text>
        </TouchableOpacity>
      </View>


      <View style={[styles.flex, styles.height40, { marginHorizontal:20 }]}>
        <Animated.View style={[styles.topTab, { backgroundColor: planBackgroundColor }]}>
          <TouchableOpacity onPress={() => handlePermissionToggle(true)}>
            <Text style={styles.topTabText}>Plan Permissions</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.topTab, { backgroundColor: addonBackgroundColor }]}>
          <TouchableOpacity onPress={() => handlePermissionToggle(false)}>
            <Text style={styles.topTabText}>Add Ons Permissions</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>


      <Animated.View
        style={[
          styles.contentContainer,
          {
            width: screenWidth * 2, // dono list ka total width
            flexDirection: 'row',
            transform: [{
              translateX: translateX.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -screenWidth],
              })
            }],
          },
        ]}
      >
        <View style={{ width: screenWidth }}>
          {renderPermissionList(permissionArray)}
        </View>
        <View style={{ width: screenWidth }}>
          {renderPermissionList(addOnPermissionArray)}
        </View>
      </Animated.View>


    </View>
  );
};

export default memo(Permissions_Screen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white,
    paddingTop: 15,
    paddingBottom: 54,
    gap:5
  },
  black: {
    color: colors.black,
    fontSize: 15.5,
    fontWeight: '600',
    flexShrink: 1,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  height40: {
    height: 40,
  },
  topTab: {
    width: '47%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  topTabText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '500',
  },
  permissionView: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 9,
    marginHorizontal: '6%',
    paddingVertical: 15,
    paddingHorizontal: 22,
    elevation: 3,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#fae5b4',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
