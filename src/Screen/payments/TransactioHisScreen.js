import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView, StatusBar

} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LiveTransactionScreen from "./LiveTransactionScreen";
import SettlementScreen from "./SettlementScreen";
import Modal from 'react-native-modal';
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";



const { width, height } = Dimensions.get('window');

const transactions = [
  {
    id: "1",
    date: "Jan 14, 2025 10:56 AM",
    ref: "OM2501141056246973423489",
    status: "SUCCESS",
    amount: "₹ 3,758.15",
    productType: "PhonePe PG",
  },
  {
    id: "2",
    date: "Dec 21, 2024 02:43 PM",
    ref: "OM241211443581483846186",
    status: "FAILED",
    amount: "₹ 967.60",
    productType: "PhonePe PG",
  },
  {
    id: "3",
    date: "Dec 21, 2024 02:43 PM",
    ref: "OM241211443581483846186",
    status: "PENDING",
    amount: "₹ 967.60",
    productType: "PhonePe PG",
  },


  {
    id: "4",
    date: "Jan 14, 2025 10:56 AM",
    ref: "OM2501141056246973423489",
    status: "SUCCESS",
    amount: "₹ 3,758.15",
    productType: "PhonePe PG",
  },
  {
    id: "5",
    date: "Dec 21, 2024 02:43 PM",
    ref: "OM241211443581483846186",
    status: "FAILED",
    amount: "₹ 967.60",
    productType: "PhonePe PG",
  },
  {
    id: "6",
    date: "Dec 21, 2024 02:43 PM",
    ref: "OM241211443581483846186",
    status: "PENDING",
    amount: "₹ 967.60",
    productType: "PhonePe PG",
  },



];

const getStatusStyle = (status) => {
  switch (status) {
    case "SUCCESS":
      return { backgroundColor: "#4CAF50" };
    case "PENDING":
      return { backgroundColor: "#FFC107" };
    case "FAILED":
      return { backgroundColor: "#F44336" };
    default:
      return { backgroundColor: "#ccc" };
  }
};

export default function TransactionHistoryScreen() {

  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("live");
  const [filterVisble, setFilterVisble] = useState(false);
  const [selectedRange, setSelectedRange] = useState("past 6 months")

  const filterOptions = [
    "Past 6 Month",
    "Past 3 Month",
    "This Month",
    "This Week",
    "Yesterday",
    "Today",
    "Custom"
  ];

  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });


  const filtered = transactions.filter((item) =>
    item.ref.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "#ffffffc9",
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }}>

      <View style={styles.container}>


        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: height * 0.08 }}>




          <View style={styles.headerRow}>
            <View style={styles.leftSection}>
              <Text style={styles.title}>Transactions</Text>
              <TouchableOpacity style={styles.tourButton} activeOpacity={0.7}>
                <Icon name="stars" size={16} color="#6c4cff" style={{ marginRight: 4 }} />
                <Text style={styles.tourText}>Take a Tour</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.bellWrap} activeOpacity={0.7} >


              <Icon name="notifications-none" size={30} color="#23272a" />

            </TouchableOpacity>
          </View>




          <View style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            justifyContent: "space-between"
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{
                fontSize: 18,
                color: "blue",
                fontWeight: "bold",
                marginRight: 6
              }}>
                Transaction Reports
              </Text>
              <Icon name="open-in-new" size={20} color="blue" />
            </View>

            {activeTab === "history" && (
              <View style={{ flexDirection: "row", alignItems: "center", paddingVertical:10 }}>
                <TouchableOpacity style={styles.actionIconButton}>
                  <AntDesign name="reload1" size={22} color="#424446" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIconButton}>
                  <Icon name="more-vert" size={22} color="#000" />
                </TouchableOpacity>
              </View>
            )}
          </View>


          <View style={styles.paymentType}>
            <TouchableOpacity
              onPress={() => setActiveTab("live")}
              style={{ }}
            >
              <View style={[styles.tabButton, activeTab === "live" && styles.activeTab]}>
                <Text style={[styles.paymentTypeText, activeTab === "live" && styles.activeText]}>
                  Live Transaction
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("history")}
              style={{ marginRight: width * 0.015 }}
            >
              <View style={[styles.tabButton, activeTab === "history" && styles.activeTab]}>
                <Text style={[styles.paymentTypeText, activeTab === "history" && styles.activeText]}>
                  Transaction History
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Settlements")}
              style={{ marginRight: 6 }}
            >
              <View style={[styles.tabButton, activeTab === "settlement" && styles.activeTab]}>
                <Text style={[styles.paymentTypeText, activeTab === "settlement" && styles.activeText]}>
                  Settlement
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {activeTab === "history" && (
            <>
              <View style={styles.searchRow}>
                <View style={styles.searchBoxWrapper}>
                  <View style={styles.searchBox}>
                    <Icon name="search" size={20} color="black" style={{ marginRight: 8 }} />
                    <TextInput
                      placeholder="Search by ID / UTR"
                      style={styles.searchInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor="black"
                    />
                  </View>
                </View>


                <TouchableOpacity style={styles.rangeDropdown} onPress={() => setFilterVisble(true)}>
                  <Text style={styles.rangeDropdownLabel}>{selectedRange}</Text>
                  <Icon name="filter-list" size={24} color="#fff" />
                </TouchableOpacity>
              </View>




          <Modal
  isVisible={filterVisble}
  onBackdropPress={() => setFilterVisble(false)}
  swipeDirection={["down"]}
  onSwipeComplete={() => setFilterVisble(false)}
  style={styles.expertModal}
>
  <View style={styles.sheet}>
    <View style={styles.sheetHandle} />
    <Text style={styles.sheetTitle}>Select Date Range</Text>

    {filterOptions.map(option => (
      <TouchableOpacity
        key={option}
        style={[
          styles.sheetOption,
          option === selectedRange && styles.sheetActiveOption
        ]}
        onPress={() => {
          setSelectedRange(option);
          if (option !== "Custom") {
            setFilterVisble(false);
          }
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.sheetOptionText,
            option === selectedRange && styles.sheetActiveOptionText
          ]}
        >
          {option}
        </Text>
        {option === selectedRange && (
          <Icon name="check" size={22} color="orange" style={{ marginLeft: 12 }} />
        )}
      </TouchableOpacity>
    ))}

    {selectedRange === "Custom" && (
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Select Custom Range</Text>

        <TextInput
          placeholder="From Date (e.g. 2024-01-01)"
          value={customDateRange.from}
          onChangeText={(text) =>
            setCustomDateRange((prev) => ({ ...prev, from: text }))
          }
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12
          }}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="To Date (e.g. 2024-01-31)"
          value={customDateRange.to}
          onChangeText={(text) =>
            setCustomDateRange((prev) => ({ ...prev, to: text }))
          }
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12
          }}
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          onPress={() => {
            console.log("Apply Filter:", customDateRange);
            setFilterVisble(false);
          }}
          style={{
            backgroundColor: "orange",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Apply Custom Range
          </Text>
        </TouchableOpacity>
      </View>
    )}

    <TouchableOpacity
      style={styles.sheetCancel}
      onPress={() => setFilterVisble(false)}
      activeOpacity={0.75}
    >
      <Text style={styles.sheetCancelText}>Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>

              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <Text style={styles.cardLabel}>Transactions Count</Text>
                  <Text style={styles.cardValue}>{transactions.length}</Text>
                </View>

                <View style={[styles.summaryCard,]}>
                  <Text style={styles.cardLabel}>Total Amount</Text>
                  <Text style={styles.cardValue}>₹ 12,02,22,897.78</Text>
                </View>

              </View>

           
<Animated.FlatList
  data={filtered}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingBottom: height * 0.08 }}
  renderItem={({ item, index }) => {
    const animatedValue = new Animated.Value(0);

    // Start animation with delay for staggered effect
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
      <Animated.View style={{ transform: [{ translateY }], opacity }}>
        <View style={styles.card}>
          <Text style={styles.label}>
            Date: <Text style={styles.date}>{item.date}</Text>
          </Text>
          <Text style={styles.label}>
            Transaction Reference: <Text style={styles.value}>{item.ref}</Text>
          </Text>
          <View style={styles.statusRow}>
            <Text style={[styles.status, getStatusStyle(item.status)]}>
              {item.status}
            </Text>
            <Text style={styles.label}>
              Amount: <Text style={styles.amount}>{item.amount}</Text>
            </Text>
          </View>
          <Text style={styles.product}>{item.productType}</Text>
        </View>
      </Animated.View>
    );
  }}
/>
            </>
          )}

          {activeTab === "live" && <LiveTransactionScreen />}
          {/* {activeTab === "settlement" && <SettlementScreen />} */}

        </ScrollView>



      </View>

    </SafeAreaView>


  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: width * 0.04,
  },



  paymentType: {
    backgroundColor: "#fff",
    // marginBottom: height * 0.010,
    width: width * 0.96,
    paddingv: width * 0.022,
    borderRadius: width * 0.02,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: width * 0.03,
  },
  tabButton: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.03,
    marginHorizontal: width * 0.01,
  },
  activeTab: {
    backgroundColor: "#FFC107",
    borderRadius: 13, 

  },
  paymentTypeText: {
    fontSize: width * 0.037,
    color: "#000",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    marginTop:height * 0.02
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.022,
    borderRadius: width * 0.025,
    height: height * 0.055,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.043,
  },
  filterIcon: {
    marginLeft: width * 0.02,
    backgroundColor: "orange",
    padding: width * 0.027,
    borderRadius: width * 0.022,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: height * 0.02,
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: width * 0.032,
    flex: 1,
    marginRight: width * 0.02,
    borderRadius: width * 0.025,
    elevation: 2,
  },
  cardLabel: {
    fontSize: width * 0.031,
    color: "#777",
  },
  cardValue: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginTop: 4,
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: width * 0.025,
    padding: width * 0.032,
    marginBottom: height * 0.015,
    elevation: 2,
    paddingBottom: 20
  },
  date: {
    fontSize: width * 0.03,
    color: "#555",
    marginBottom: 6,
  },
  label: {
    fontSize: width * 0.036,
    fontWeight: "500",
    color: "#222",
    marginBottom: 4,
  },
  value: {
    fontWeight: "normal",
    color: "#444",
  },

  searchBoxWrapper: {
    flex: 2,
    marginRight: width * 0.02,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.008,
    alignItems: "center",
  },
  status: {
    paddingHorizontal: width * 0.024,
    paddingVertical: height * 0.004,
    borderRadius: width * 0.016,
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.031,
  },
  amount: {
    fontWeight: "bold",
    fontSize: width * 0.045,
    color: "#333",
  },
  product: {
    marginTop: 4,
    fontSize: width * 0.03,
    color: "#888",
  },
  expertModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    backgroundColor: "#fff",
    paddingBottom: height * 0.04,
    borderTopLeftRadius: width * 0.06,
    borderTopRightRadius: width * 0.06,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
    minHeight: height * 0.42,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
  },
  sheetHandle: {
    alignSelf: "center",
    width: width * 0.13,
    height: height * 0.008,
    borderRadius: width * 0.021,
    backgroundColor: "#e0e0e0",
    marginBottom: height * 0.018,
  },
  sheetTitle: {
    fontSize: width * 0.047,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: height * 0.012,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.018,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  sheetActiveOption: {
    backgroundColor: "orange",
    paddingHorizontal: width * 0.025,
    borderRadius: width * 0.032,
  },
  sheetOptionText: {
    fontSize: width * 0.041,
    color: "#333",
    flex: 1,
  },
  sheetActiveOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  sheetCancel: {
    marginTop: height * 0.011,
    paddingVertical: height * 0.017,
    borderRadius: width * 0.032,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  sheetCancelText: {
    color: "#666",
    fontSize: width * 0.041,
    fontWeight: "600"
  },
  rangeDropdown: {

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: height * 0.06,
    width: width * 0.4,
    borderRadius: width * 0.037,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,

  },
  rangeDropdownLabel: {
    fontSize: width * 0.041,
    color: "#231f20",
    fontWeight: "600",
    flex: 1,
    minWidth: width * 0.36,
    flexShrink: 0,
  },



  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ffffffff",
    justifyContent: "space-between",
    paddingTop: width * 0.02,
    paddingBottom: width * 0.01,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.057,
    color: "#222",
    fontWeight: "bold",
    marginRight: 8,
  },
  tourButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6ff",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderWidth: 1,
    borderColor: "#d7dcf5",
    borderRadius: 5,
    marginLeft: 2,
  },
  tourText: {
    color: "#6c4cff",
    fontSize: width * 0.036,
    marginLeft: 1,
    fontWeight: "500",
  },


  bellWrap: {
    paddingVertical: 5,
    backgroundColor: "#fff",

  },
  actionDocsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  actionIconButton: {
    marginLeft: 5,
   
    
  },

});
