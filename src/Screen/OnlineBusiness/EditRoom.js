import React, { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
  LogBox,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Carousel from 'react-native-reanimated-carousel';  
import { useDispatch, useSelector } from "react-redux";
import { getRoomByIdThunk, updateRoomThunk } from "../../Service/api/thunks";
import { clearUpdateStatus } from "../../Service/slices/BusinessProfile/roomSlice";

const { width, height } = Dimensions.get("window");

const EditRoom = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const allowRoomNoEdit = route?.params?.allowRoomNoEdit ?? true;
  const roomId = route?.params?.roomId ?? null;

   useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

   const { 
    selectedRoom, 
    selectedRoomLoading, 
    selectedRoomError,
    updateLoading, 
    updateError, 
    updateSuccess 
  } = useSelector((state) => state.rooms);

   const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [annualrent, setAnnualRent] = useState("");
  const [foodCharge, setFoodCharge] = useState("");
  const [dailyBedCharge, setDailyBedCharge] = useState("");
  const [discountRange, setDiscountRange] = useState("");

  const [openStatus, setOpenStatus] = useState(false);
  const [statusValue, setStatusValue] = useState("live");
  const [statusItems, setStatusItems] = useState([
    { label: "Live", value: "live" },
    { label: "Hidden from List", value: "hidden" },
  ]);

  const [roomImages, setRoomImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [amenities, setAmenities] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([
    { label: "Rent (Monthly)", value: "rent" },
    { label: "Rent (Annual)", value: "AnnualRent" },
    { label: "Food Charge (Monthly)", value: "food" },
    { label: "Per Bed (Daily)", value: "daily" },
    { label: "Discount (%)", value: "discount" },
  ]);
  const [addedFields, setAddedFields] = useState([]);

   const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef(null);

   useEffect(() => {
    if (roomImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % roomImages.length;
          carouselRef.current?.scrollTo({ index: nextIndex, animated: true });
          return nextIndex;
        });
      }, 2000);  

      return () => clearInterval(timer);
    }
  }, [roomImages.length]);

   useEffect(() => {
    if (roomId) {
      console.log("Fetching room data for ID:", roomId);
      dispatch(getRoomByIdThunk(roomId));
    }
  }, [roomId, dispatch]);

   useEffect(() => {
    if (selectedRoom) {
      console.log("Populating form with room data:", selectedRoom);
      
      setRoomNumber(selectedRoom.room_number || "");
      setRoomType(selectedRoom.room_type || "");
      setDescription(selectedRoom.description || "");
      setRent(selectedRoom.monthly_rent?.toString() || "");
      setAnnualRent(selectedRoom.annual_rent?.toString() || "");
      setFoodCharge(selectedRoom.food_charge_monthly?.toString() || "");
      setDailyBedCharge(selectedRoom.per_day_bed_charge?.toString() || "");
      
       if (selectedRoom.amenities) {
        const roomAmenities = selectedRoom.amenities.map(amenity => {
          const found = allAmenities.find(a => a.label === amenity);
          return found || { icon: "question-circle", label: amenity };
        });
        setAmenities(roomAmenities);
      }

       if (selectedRoom.images && selectedRoom.images.length > 0) {
        const formattedImages = selectedRoom.images.map((img, index) => ({
          id: `db-${index}`,
          url: img.startsWith("http") ? img : `http://192.168.225.143:8000/storage/room/${img}`,
          isFromDatabase: true
        }));
        setRoomImages(formattedImages);
      } else {
         setRoomImages([{
          id: 'default-1',
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          isFromDatabase: false
        }]);
      }
    }
  }, [selectedRoom]);

   useEffect(() => {
    if (updateSuccess) {
      Alert.alert("Success", "Room updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearUpdateStatus());
            navigation.goBack();
          }
        }
      ]);
    }
    
    if (updateError) {
      Alert.alert("Error", `Update failed: ${updateError}`);
      dispatch(clearUpdateStatus());
    }
  }, [updateSuccess, updateError, dispatch, navigation]);

  const allAmenities = [
    { icon: "wifi", label: "Free Wi-Fi" },
    { icon: "snowflake-o", label: "AC Room" },
    { icon: "cutlery", label: "Meals" },
    { icon: "video-camera", label: "CCTV" },
    { icon: "shield", label: "Security" },
    { icon: "flash", label: "Power Backup" },
    { icon: "car", label: "Parking" },
    { icon: "tint", label: "Water Supply" },
  ];

  const pickImage = () => {
    if (roomImages.length >= 12) {
      Alert.alert("Limit Reached", "You can only upload up to 12 images.");
      return;
    }

    ImagePicker.openPicker({ 
      width: 800, 
      height: 800, 
      cropping: true 
    }).then((image) => {
      const newImage = { 
        id: `new-${Date.now()}`, 
        url: image.path,
        isFromDatabase: false
      };
      setRoomImages([...roomImages, newImage]);
    }).catch(err => {
      console.log("Image picker error:", err);
    });
  };

  const deleteImage = (id) => {
    setRoomImages(roomImages.filter((img) => img.id !== id));
    setSelectedImage(null);
  };

  const toggleAmenity = (item) => {
    const exists = amenities.find((a) => a.label === item.label);
    if (exists) {
      setAmenities(amenities.filter((a) => a.label !== item.label));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const addField = () => {
    if (selectedField && !addedFields.includes(selectedField)) {
      setAddedFields([...addedFields, selectedField]);
      setSelectedField(null);
    }
  };

   const updateRoom = () => {
    if (!roomId) {
      Alert.alert("Error", "Room ID is missing");
      return;
    }

    console.log("Starting room update with ID:", roomId);

    const formData = new FormData();
    
    formData.append('room_number', roomNumber);
    formData.append('total_beds', '2');
    formData.append('booked_beds', '1');
    formData.append('room_type', roomType);
    formData.append('description', description);
    formData.append('monthly_rent', rent || '0');
    formData.append('annual_rent', annualrent || '0');
    formData.append('food_charge_monthly', foodCharge || '0');
    formData.append('per_day_bed_charge', dailyBedCharge || '0');
    
     const amenityLabels = amenities.map(a => a.label);
    amenityLabels.forEach((amenity, index) => {
      formData.append(`amenities[${index}]`, amenity);
    });

     roomImages.forEach((image, index) => {
      if (!image.isFromDatabase && image.url && image.url.startsWith('file://')) {
        formData.append('images[]', {
          uri: image.url,
          type: 'image/jpeg',
          name: `room_image_${index}.jpg`,
        });
      }
    });

     dispatch(updateRoomThunk({ roomId, formData }));
  };

   const renderCarouselItem = ({ item, index }) => (
    <View style={styles.carouselImageContainer}>
      <Image source={{ uri: item.url }} style={styles.carouselImage} />
       {item.isFromDatabase && (
        <View style={styles.databaseBadge}>
          <Ionicons name="cloud-done" size={14} color="#fff" />
        </View>
      )}
    </View>
  );

   if (selectedRoomLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#000' }}>Loading room data...</Text>
      </View>
    );
  }

   if (selectedRoomError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: 'red' }}>Error: {selectedRoomError}</Text>
        <TouchableOpacity 
          onPress={() => dispatch(getRoomByIdThunk(roomId))}
          style={{ marginTop: 20, backgroundColor: 'orange', padding: 10, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
         <View style={styles.carouselContainer}>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="mode-edit" size={33} color="orange" />
          </TouchableOpacity>

           <Carousel
            ref={carouselRef}
            width={width * 0.92}
            height={height * 0.25}
            data={roomImages}
            scrollAnimationDuration={800}
            onSnapToItem={(index) => setCurrentImageIndex(index)}
            renderItem={renderCarouselItem}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            autoPlay={roomImages.length > 1}
            autoPlayInterval={4000}
            loop={roomImages.length > 1}
          />

           {roomImages.length > 1 && (
            <View style={styles.dotsContainer}>
              {roomImages.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dot,
                    { 
                      backgroundColor: currentImageIndex === index 
                        ? "orange" 
                        : "rgba(255,255,255,0.6)" 
                    }
                  ]}
                  onPress={() => {
                    setCurrentImageIndex(index);
                    carouselRef.current?.scrollTo({ index, animated: true });
                  }}
                />
              ))}
            </View>
          )}

           {roomImages.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.counterText}>
                {currentImageIndex + 1} / {roomImages.length}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.roomNumber}>Room #{roomNumber || selectedRoom?.room_number}</Text>

        {!allowRoomNoEdit && (
          <TextInput
            style={styles.input}
            value={roomNumber}
            onChangeText={setRoomNumber}
            editable={true}
            placeholder="Enter Room Number"
          />
        )}

        <View style={[styles.row, { marginTop: 20 }]}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Room Type</Text>
            <TextInput
              style={styles.input}
              value={roomType}
              onChangeText={setRoomType}
              placeholder={selectedRoom?.room_type || "Enter Room Type"}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Room Status</Text>
            <DropDownPicker
              open={openStatus}
              value={statusValue}
              items={statusItems}
              setOpen={setOpenStatus}
              setValue={setStatusValue}
              setItems={setStatusItems}
              containerStyle={{ marginBottom: openStatus ? 150 : 20 }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Elite Insights</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={(text) => {
                const words = text.trim().split(/\s+/);
                if (words.length <= 300) {
                  setDescription(text);
                }
              }}
              placeholder={selectedRoom?.description || "Enter Room Description (max 300 words)"}
              multiline
            />
            <Text style={styles.wordCount}>
              {description.trim().split(/\s+/).filter(Boolean).length}/300 words
            </Text>
          </View>
        </View>

         <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Room Charges</Text>
          <TouchableOpacity style={styles.floatingButton} onPress={() => setOpenDropdown(true)}>
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>

        <DropDownPicker
          open={openDropdown}
          value={selectedField}
          items={dropdownItems}
          setOpen={setOpenDropdown}
          setValue={setSelectedField}
          setItems={setDropdownItems}
          placeholder="Select Field to Add"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {selectedField && (
          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <View style={styles.inputFieldContainer}>
                {selectedField === "rent" && (
                  <TextInput
                    style={styles.inputBoxImproved}
                    value={rent}
                    onChangeText={setRent}
                    placeholder={selectedRoom?.monthly_rent?.toString() || "Enter Monthly Rent"}
                    keyboardType="numeric"
                  />
                )}
                {selectedField === "AnnualRent" && (
                  <TextInput
                    style={styles.inputBoxImproved}
                    value={annualrent}
                    onChangeText={setAnnualRent}
                    placeholder={selectedRoom?.annual_rent?.toString() || "Enter Annual Rent"}
                    keyboardType="numeric"
                  />
                )}
                {selectedField === "food" && (
                  <TextInput
                    style={styles.inputBoxImproved}
                    value={foodCharge}
                    onChangeText={setFoodCharge}
                    placeholder={selectedRoom?.food_charge_monthly?.toString() || "Enter Food Charge Monthly"}
                    keyboardType="numeric"
                  />
                )}
                {selectedField === "daily" && (
                  <TextInput
                    style={styles.inputBoxImproved}
                    value={dailyBedCharge}
                    onChangeText={setDailyBedCharge}
                    placeholder={selectedRoom?.per_day_bed_charge?.toString() || "Enter Per Day Bed Charge"}
                    keyboardType="numeric"
                  />
                )}
              </View>

              <View style={styles.discountContainer}>
                <TextInput
                  style={styles.dropdown}
                  value={discountRange}
                  onChangeText={setDiscountRange}
                  placeholder="Enter Discount"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addField}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.fieldList}>
          {addedFields.map((field) => {
            let price = 0;
            if (field === "rent") price = parseFloat(rent) || 0;
            else if (field === "AnnualRent") price = parseFloat(annualrent) || 0;
            else if (field === "food") price = parseFloat(foodCharge) || 0;
            else if (field === "daily") price = parseFloat(dailyBedCharge) || 0;

            const discount = parseFloat(discountRange) || 0;
            const finalPrice = price - (price * discount) / 100;

            return (
              <View key={field} style={styles.fieldCard}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>
                    {field === "rent"
                      ? "Monthly Rent"
                      : field === "AnnualRent"
                        ? "Annual Rent"
                        : field === "food"
                          ? "Food Charge"
                          : "Daily Bed"}
                  </Text>
                </View>

                <View style={styles.fieldPriceContainer}>
                  {field === "discount" ? (
                    <Text style={[styles.fieldValue, { color: "orange" }]}>
                      {discountRange}%
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.originalPrice}>₹{price}</Text>
                      {discount > 0 && (
                        <Text style={styles.discountText}>
                          -{discount}%
                        </Text>
                      )}
                    </>
                  )}
                </View>

                <View style={styles.finalPriceContainer}>
                  <Text style={[styles.fieldValue, { color: "#28a745" }]}>
                    ₹{finalPrice.toFixed(0)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

         <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {allAmenities.map((item, idx) => {
            const isActive = amenities.find((a) => a.label === item.label);
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.amenityIconBox,
                  { backgroundColor: isActive ? "#fff7e6" : "#f0f0f0" },
                ]}
                onPress={() => toggleAmenity(item)}
              >
                <FontAwesome
                  name={item.icon}
                  size={width * 0.07}
                  color={isActive ? "orange" : "black"}
                />
                <Text
                  style={[
                    styles.amenityText,
                    { color: isActive ? "orange" : "black" }
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

       <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={[styles.bookNowButton, { 
            backgroundColor: updateLoading ? "#ccc" : "#1f1e1efa" 
          }]} 
          onPress={updateRoom}
          disabled={updateLoading}
        >
          <MaterialCommunityIcons
            name="home-edit-outline"
            size={width * 0.055}
            color="#fff"
            style={{ marginRight: width * 0.02 }}
          />
          <Text style={styles.bookText}>
            {updateLoading ? "Updating..." : "Edit Room"}
          </Text>
        </TouchableOpacity>
      </View>

       <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Room Images</Text>

            <ScrollView contentContainerStyle={styles.imageGrid}>
              {roomImages.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => setSelectedImage(item)}>
                  <View style={styles.imageItemContainer}>
                    <Image source={{ uri: item.url }} style={styles.roomImage} />
                    {item.isFromDatabase && (
                      <View style={styles.dbImageBadge}>
                        <Ionicons name="cloud-done" size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>+ Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

       <Modal visible={selectedImage !== null} transparent={true}>
        <View style={styles.fullscreenContainer}>
          {selectedImage && (
            <>
              <Image source={{ uri: selectedImage.url }} style={styles.fullscreenImage} />

              {!selectedImage.isFromDatabase && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteImage(selectedImage.id)}
                >
                  <Ionicons name="trash" size={28} color="#fff" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default EditRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: width * 0.04,
  },
   carouselContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 15,
  },
  carouselImageContainer: {
    width: width * 0.92,
    height: height * 0.25,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  databaseBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(34, 197, 94, 0.9)",
    borderRadius: 12,
    padding: 4,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    elevation: 2,
  },
  imageCounter: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  editIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(32, 31, 29, 0.8)",
    borderRadius: 10,
    padding: 8,
    zIndex: 10,
  },
  roomNumber: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginVertical: height * 0.015,
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 15
  },
  inputBox: { width: "48%" },
  label: { 
    fontWeight: "600", 
    color: "black", 
    marginBottom: 5 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    height: 40,
  },
  descriptionInput: {
    height: 70,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 14,
    marginTop: 8,
  },
  wordCount: { 
    textAlign: "right", 
    color: "gray", 
    marginTop: 4 
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderWidth: 1,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
  },
  floatingButton: {
    backgroundColor: "orange",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  plusIcon: { 
    fontSize: 20, 
    color: "#fff" 
  },
  inputWrapper: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  inputRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  inputFieldContainer: { 
    width: "58%" 
  },
  discountContainer: { 
    width: "38%" 
  },
  inputBoxImproved: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: width * 0.04,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  fieldList: { 
    marginTop: 10 
  },
  fieldCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  fieldLabelContainer: { 
    flex: 0.4 
  },
  fieldLabel: {
    fontWeight: "600",
    color: "#333"
  },
  fieldPriceContainer: { 
    flex: 0.35, 
    alignItems: "center" 
  },
  originalPrice: { 
    color: "#333", 
    fontWeight: "500" 
  },
  discountText: { 
    color: "red", 
    fontSize: 12 
  },
  finalPriceContainer: { 
    flex: 0.25, 
    alignItems: "flex-end" 
  },
  fieldValue: { 
    fontWeight: "700", 
    color: "orange" 
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  amenityIconBox: {
    width: "23%",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },
  amenityText: {
    fontSize: width * 0.03,
    marginTop: 5,
  },
  bottomButtonContainer: { 
    alignItems: "center", 
    position: "absolute", 
    top: height * 0.90, 
    width: "100%" 
  },
  bookNowButton: {
    backgroundColor: "#1f1e1efa",
    paddingVertical: 12,
    flexDirection: "row",
    borderRadius: 10,
    justifyContent: "center",
    width: "50%"
  },
  bookText: {
    color: "#fff"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    maxHeight: height * 0.8,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageItemContainer: {
    position: "relative",
    margin: 5,
  },
  roomImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  dbImageBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "green",
    borderRadius: 10,
    padding: 2,
  },
  uploadButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  uploadButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "black",
    padding: 8,
    borderRadius: 20,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 15,
  },
  deleteButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 30,
  },
});
