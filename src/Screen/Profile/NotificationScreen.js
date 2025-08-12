import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import NotificationCardTwo from "../../Components/cards/NotificationCardTwo";
import axios from "axios";

const { width } = Dimensions.get("window");

const NotificationScreen = () => {
  const [selectedTab, setSelectedTab] = useState(null); 
  const [allNotifications, setAllNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://192.168.79.143:8000/api/all-notifications");
      if (res.data.status && Array.isArray(res.data.notifications)) {
        setAllNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };



  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = allNotifications
        .filter((item) => item.is_read === 0)
        .map((item) => item.id);

      if (unreadIds.length === 0) {
        console.log("No unread notifications to mark as read.");
        return;
      }

      const responses = await Promise.all(
        unreadIds.map((id) =>
          axios.post("http://192.168.79.143:8000/api/mark-as-read", {
            notification_id: id,
          })
        )
      );

      console.log("Mark as read responses:", responses);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };




  const filteredNotifications = allNotifications
    .filter((item) =>
      selectedTab === "read"
        ? item.is_read === 1
        : selectedTab === "unread"
          ? item.is_read === 0
          : true
    )
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.headerRow}>
        <Text style={styles.inboxText}>Inbox</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={22} color="#555" />
          <TextInput
            placeholder="Search Mail"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.tabRow}>


        {["read", "unread", "markAll"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              if (tab === "markAll") {
                handleMarkAllAsRead();
                setSelectedTab("markAll");
              } else {
                setSelectedTab(tab);
              }
            }}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "read"
                ? "Read Notification"
                : tab === "unread"
                  ? "Unread Notification"
                  : "Mark All As Read"}
            </Text>
          </TouchableOpacity>
        ))}


      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationCardTwo
              title={item.title}
              body={item.body}
              date={item.created_at || "N/A"}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.markAllText}>No notifications found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inboxText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginRight: 12,
    width: width * 0.18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
    color: "#333",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#f1ac2a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    color: "#333",
    fontSize: 13,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  markAllText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 14,
  },
});
