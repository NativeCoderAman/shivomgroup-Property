import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetScrollView, BottomSheetModal } from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import reverseDateFormat from '../../Utils/dateFormat';
import { useDispatch } from 'react-redux';
import alertMessage from '../../Utils/alert';

const colors = {
  primary: '#ffc107',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  muted: '#64748b',
  background: '#fff',
  cardBackground: '#ffffff',
};

const SubscriptionHistoryModal = ({
  adminSubscriptionResponse,
  bottomHistorySheetModalRef,
  snapPoints,
}) => {
  const dispatch = useDispatch();
  const [expandedAddon, setExpandedAddon] = useState({});

  // console.log(adminSubscriptionResponse?.response);

  const toggleAddon = (id) => {
    setExpandedAddon(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInvoiceGenerate = async(data) => {
    console.log('generate invoice data: ',data);
    try {
      //const response = await dispatch();
      //console.log('invoice generate response:',response?.payload);
    } catch (error) {
      // alertMessage(error);
    }
  };

  const renderAddons = (item) => {
    const addons = item?.add_on_item_codes || [];
    const isExpanded = expandedAddon[item.id];
    
    return (
      <View style={styles.addonsContainer}>
        <View style={styles.addonsList}>
          {(isExpanded ? addons : addons.slice(0, 2)).map((addon, index) => (
            <View key={index} style={styles.addonPill}>
              <Text style={styles.addonText}>{addon}</Text>
            </View>
          ))}
        </View>
        {addons.length > 2 && (
          <TouchableOpacity 
            onPress={() => toggleAddon(item.id)}
            style={styles.moreButton}
          >
            <Text style={styles.moreButtonText}>
              {isExpanded ? 'Show less' : `+${addons.length - 2} more`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={bottomHistorySheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: colors.background }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Subscription History</Text>
        <View style={styles.divider} />
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.container}>
        <FlatList
          data={adminSubscriptionResponse?.response || []}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.planName}>
                    {item?.subscription_detail?.package_title} {item?.subscription_detail?.package_duration}
                  </Text>
                  <Text style={styles.planCategory}>
                    {item?.subscription_detail?.package_category}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  item?.status === '1' ? styles.activeBadge : styles.inactiveBadge
                ]}>
                  <Text style={styles.statusText}>
                    {item?.status === '1' ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>

              {/* Price Section */}
              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Paid:</Text>
                  <Text style={styles.priceValue}>
                    ₹{item?.subscription_detail?.paid_amount || `  ----`}
                  </Text>
                </View>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {item?.subscription_detail?.sub_discount}% OFF
                  </Text>
                </View>
              </View>

              {/* Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>{reverseDateFormat(item?.startdate) }</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>End Date</Text>
                  <Text style={styles.detailValue}>{item?.enddate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Seats</Text>
                  <Text style={styles.detailValue}>{item?.no_of_seats}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>GST</Text>
                  <Text style={styles.detailValue}>
                    {item?.subscription_detail?.tax_rate}%
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Price</Text>
                  <Text style={styles.detailValue}>
                    ₹{item?.subscription_detail?.subs_price}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>AddOn Amount</Text>
                  <Text style={styles.detailValue}>
                  ₹{item?.subscription_detail?.addon_amount || `  ----`}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>
                  ₹{item?.subscription_detail?.amount || `  ----`}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Previous Remaining</Text>
                  <Text style={styles.detailValue}>
                  ₹{item?.subscription_detail?.pre_amount || `  ----`}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Plan Action</Text>
                  <Text style={[styles.detailValue,{fontSize:10}]}>
                    {item?.plan_action}
                  </Text>
                </View>
              </View>

              {/* Addons Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Addons</Text>
                {renderAddons(item)}
              </View>

              {/* Action Section */}
              <View style={styles.actionContainer}>
                <TouchableOpacity 
                  style={styles.billButton}
                  onPress={() => handleInvoiceGenerate(item)}
                >
                  <MaterialCommunityIcons 
                    name="file-document" 
                    size={18} 
                    color={colors.primary}
                  />
                  <Text style={styles.billButtonText}>View Invoice</Text>
                </TouchableOpacity>
                <Text style={styles.remainingDays}>
                  Day Left : {item?.counter}
                </Text>
              </View>
            </View>
          )}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 16,
  },
  container: {
    // paddingBottom: 32,
    paddingTop:10,
    paddingBottom:100
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    marginHorizontal:'5%'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  planCategory: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: '#24B218',
  },
  inactiveBadge: {
    backgroundColor: '#C70039',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color:'white'
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 14,
    color: colors.muted,
    marginRight: 8,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  discountBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    width: '30%',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    elevation:1
  },
  detailLabel: {
    fontSize: 10,
    color: 'black',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  addonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  addonsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addonPill: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addonText: {
    fontSize: 12,
    color: colors.primary,
  },
  moreButton: {
    paddingVertical: 4,
  },
  moreButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.muted,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingTop: 16,
    marginTop: 8,
  },
  billButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  remainingDays: {
    fontSize: 12,
    color: 'black',
    fontWeight:'500'
  },
});

export default SubscriptionHistoryModal;