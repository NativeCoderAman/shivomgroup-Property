// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   Linking,
//   StyleSheet,
//   Animated,
//   Easing,
//   Dimensions,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');

// const BusinessWebSite = () => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.5)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const bgOpacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Icon + Text animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 3,
//         useNativeDriver: true,
//       }),
//       Animated.loop(
//         Animated.timing(rotateAnim, {
//           toValue: 1,
//           duration: 3000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         })
//       ),
//       Animated.timing(bgOpacity, {
//         toValue: 0.3,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     const timeout = setTimeout(() => {
//       Linking.openURL('https://devops.shivomgroup.com/');
//     }, 2000);

//     return () => clearTimeout(timeout);
//   }, []);

//   const rotate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.blurCircle,
//           { opacity: bgOpacity, transform: [{ scale: 1.5 }] },
//         ]}
//       />
//       <Animated.View style={[{ transform: [{ rotate }] }]}>
//         <Ionicons name="globe-outline" size={80} color="#fcbc80ff" />
//       </Animated.View>
//       <Animated.Text
//         style={[
//           styles.text,
//           {
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         🚀 Launching Shivom Group Website...
//       </Animated.Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f0f0fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     color: '#fcbc80ff',
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   blurCircle: {
//     position: 'absolute',
//     width: width * 2,
//     height: width * 2,
//     borderRadius: width,
//     backgroundColor: '#ff9e44ff',
//     top: -width / 2,
//     left: -width / 2,
//   },
// });

// export default BusinessWebSite;

import React from 'react';
import {Text, View} from "react-native";

const BusinessWebSite=()=>{
    return(
<View>
    <Text>hello</Text>
</View>
    )
}
export default BusinessWebSite
