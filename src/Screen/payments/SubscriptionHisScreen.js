import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Dimensions ,TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Animated } from "react-native";

const { height, width } = Dimensions.get('window');


const transactions = [
  { id: "1", transactionId: "TransId67cafbc074575338786921", amount: "₹64.61", paymentType: "NETBANKING", status: "Success" },
  { id: "2", transactionId: "TransId67caaed97a252123469709", amount: "₹90.45", paymentType: "NETBANKING", status: "Success" },
  { id: "3", transactionId: "TransId67caae85e47bf785906037", amount: "₹1.18", paymentType: "NETBANKING", status: "Success" },
  { id: "4", transactionId: "TransId1234567890", amount: "₹50.00", paymentType: "UPI", status: "Failed" },
  { id: "5", transactionId: "TransId9876543210", amount: "₹75.00", paymentType: "Credit Card", status: "Pending" },
];

const statuses = ["All", "Success", "Failed", "Pending"];

export default function SubscriptionHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTransactions = transactions.filter(
    (item) =>
      (selectedStatus === "All" || item.status === selectedStatus) &&
      item.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Transaction ID..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        
      />
      <View  style={styles.statusTabs} >
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={[
              styles.statusTab,
              selectedStatus === status && styles.selectedTab,
            ]}
          >
            <Text style={[styles.statusText, selectedStatus === status && styles.selectedStatusText]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
   

<Animated.FlatList
  data={filteredTransactions}
  showsVerticalScrollIndicator={false}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingBottom: 30}}
  renderItem={({ item, index }) => {
    const animatedValue = new Animated.Value(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100, 
      useNativeDriver: true,
    }).start();

    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0], 
    });

    const opacity = animatedValue;

    return (
      <Animated.View
        style={[
          styles.transactionItem,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.text}>Transaction ID: {item.transactionId}</Text>
        <Text style={styles.text}>Amount: {item.amount}</Text>
        <Text style={styles.text}>Payment Type: {item.paymentType}</Text>
        <Text style={styles.text}>Status: {item.status}</Text>
      </Animated.View>
    );
  }}
/>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f9f9f9" ,
 paddingTop: height * 0.09,
  },
  searchInput: {
 height: height * 0.06,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
paddingHorizontal: width * 0.04,  
    backgroundColor: "#fff",
  marginBottom: height * 0.02,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    
  },
 
statusTabs: {
   flexDirection: "row",
  justifyContent: "space-between",      
  alignItems: "center",
  marginBottom: height * 0.02,
  height: height * 0.07,
  width:"107%"    
},

  statusTab: {
  paddingHorizontal: width * 0.05,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
     marginRight: width * 0.04,
     minHeight: height * 0.05, 
    justifyContent:"center",
  },
  selectedTab: {
    backgroundColor: "#eeac55ff",
  },
  statusText: {
  fontSize: width * 0.033,
    fontWeight: "500",
    color: "#333",
    marginVertical:4
  },
  selectedStatusText: {
    color: "#fff",
  },
  transactionItem: {
 backgroundColor: "#fff",
  padding: width * 0.03,
  marginBottom: height * 0.015,
  borderRadius: width * 0.03,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,

  },
  text: {
   fontSize: width * 0.04,
    color: "#333",
     marginBottom: height * 0.005,
  },
});
