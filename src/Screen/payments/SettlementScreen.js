import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const SettlementsScreen = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCopy = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'UTR copied to clipboard');
  };

  const monthYear = selectedDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });



  const handlePrevDate = () => {
  const prevDate = new Date(selectedDate);
  prevDate.setDate(prevDate.getDate() - 1);
  setSelectedDate(prevDate);
};

const handleNextDate = () => {
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);
  setSelectedDate(nextDate);
};


const navigation=useNavigation();

  return (
    <SafeAreaView style={styles.container}>   
  <ScrollView
        contentContainerStyle={{ paddingBottom: height * 0.08 }}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >

<View style={styles.headerRow}>
  <Text style={styles.header}>Settlements</Text>

   <TouchableOpacity style={styles.bellWrap} activeOpacity={0.7}>
              <Icon name="notifications-none" size={30} color="#23272a" />
            </TouchableOpacity>
</View>

      <Text style={styles.subHeader}>
        View the consolidated payouts of the transactions to your Bank Account
      </Text>

      <TouchableOpacity style={styles.helpBox}>
        <Icon name="help-outline" size={20} color="#000" />
        <Text style={styles.helpText}>Have not received settlements? Get Help</Text>
      </TouchableOpacity>

<View style={{paddingVertical:10}}>
      <Text style={styles.sectionTitle}>Last Settlement</Text>


<Text>No settlements in last 59 days, Change months to view older settlements
</Text>

</View>

      
      <View style={styles.datePickerWrapper}>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
    
    <TouchableOpacity onPress={handlePrevDate}>
      <Icon name="chevron-left" size={24} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePickerTrigger}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Icon name="calendar-month" size={24} color="#000" />
        <Text style={styles.datePickerText}>
          {selectedDate.toLocaleDateString('en-GB')}
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleNextDate}>
      <Icon name="chevron-right" size={24} color="#000" />
    </TouchableOpacity>
  </View>

  {showPicker && (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={onChange}
    />
  )}
</View>




      <Text style={styles.monthLabel}>{monthYear}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Initiated At</Text>
          <Text style={styles.value}>Oct 07, 2024 01:14 PM</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Last Updated At</Text>
          <Text style={styles.value}>Oct 07, 2024 01:45 PM</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>₹ 20</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, { color: 'green' }]}>SUCCESS</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>UTR</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.value}>AXNPN28153545615</Text>
            <TouchableOpacity onPress={() => handleCopy('AXNPN28153545615')}>
              <Icon name="content-copy" size={18} color="#000" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Mode of Settlement</Text>
          <Text style={styles.value}>Auto-Settle</Text>
        </View>
      </View>






      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Previous Month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Next Month</Text>
        </TouchableOpacity>
      </View>

      </ScrollView> 
    </SafeAreaView>
  );
};

export default SettlementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    padding: width * 0.045,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginTop: height * 0.070,
  },
  subHeader: {
    fontSize: width * 0.038,
    color: '#333',
    marginBottom: height * 0.015,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F3FF',
    padding: width * 0.035,
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
  },
  helpText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: width * 0.038,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '500',
    marginBottom: height * 0.01,
  },
  datePickerWrapper: {
    width: '60%',
    marginBottom: height * 0.02,
  },
  datePickerTrigger: {
    backgroundColor: '#fff',
    borderRadius: width * 0.03,
    padding: width * 0.04,
  },
  datePickerText: {
    fontSize: width * 0.038,
    color: '#333',
  },
  monthLabel: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: width * 0.035,
    padding: width * 0.04,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginBottom: height * 0.02,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.012,
  },
  label: {
    fontSize: width * 0.035,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: width * 0.037,
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  navButton: {
    backgroundColor: '#fff',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.025,
    elevation: 2,
  },
  navText: {
    fontSize: width * 0.037,
    fontWeight: '500',
    color: '#000',
  },

  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

  bellWrap: {
    paddingVertical: 5,
    backgroundColor: "#fff",

  },








});
