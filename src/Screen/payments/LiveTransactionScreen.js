import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const { width } = Dimensions.get('window');

const LiveTransactionScreen = () => {
  return (
    <View style={styles.container}>
   

<View style={styles.topRow}>
  {/* LEFT: LIVE + FILTER */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <View style={styles.liveContainer}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>LIVE</Text>
      <Text style={styles.timeText}>from 7:16 pm</Text>
    </View>
    <TouchableOpacity style={[styles.filterBtn, { marginLeft: 10 }]}>
      <AntDesign name="filter" size={18} color="#333" />
      <Text style={styles.filterText}>Filters</Text>
    </TouchableOpacity>
  </View>

  <TouchableOpacity style={styles.refreshIcon}>
    <AntDesign name="reload1" size={22} color="#555" />
  </TouchableOpacity>
</View>



      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="receipt" size={width * 0.1} color="#B3D1F4" />
        </View>
        <Text style={styles.mainText}>
          Live and ready for payments. They will appear here once received.
        </Text>
        <Text style={styles.subText}>
          To view older transactions{" "}
          <Text
            style={styles.linkText}
            onPress={() => Linking.openURL("")}
          >
            View transactions history
          </Text>
        </Text>
      </View>

   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    justifyContent: "flex-start",
  },
  topRow: {
    flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", 
  paddingHorizontal: width * 0.03,
  marginTop: width * 0.06,
  marginBottom: width * 0.08,
  },
  liveContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderWidth: 1,
    borderColor: "blue", 
    paddingVertical: 7, 
    paddingHorizontal: 10, 
    borderRadius: 10,
  },
  liveDot: {
    width: width * 0.027,
    height: width * 0.027,
    borderRadius: width * 0.0135,
    backgroundColor: "#A390EF",
    marginRight: 6,
  },
  liveText: {
    color: "#7B58D3",
    fontWeight: "bold",
    marginRight: 4,
    fontSize: width * 0.042,
  },
  timeText: {
    color: "#B3B5B8",
    fontSize: width * 0.036,
    marginLeft: 1,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E6E7EA",
    marginLeft: 10,
  },
  filterText: {
    marginLeft: 5,
    color: "#333",
    fontSize: width * 0.041,
    fontWeight: "500",
  },
  refreshIcon: {
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E6E7EA"
  },
  centerContent: {
    alignItems: "center",
    marginTop: width * 0.14,
  },
  iconCircle: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    backgroundColor: "#E6F0FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  mainText: {
    color: "#59595E",
    fontSize: width * 0.043,
    textAlign: "center",
    marginBottom: 20,
    marginHorizontal: 28,
  },
  subText: {
    color: "#9EA0A8",
    fontSize: width * 0.04,
    textAlign: "center",
    marginBottom: 10,
  },
  linkText: {
    color: "#2488DA",
    textDecorationLine: "underline",
  },

});

export default LiveTransactionScreen;
