import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    Modal,
    Share,
    Animated,
    Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Carousel from 'react-native-reanimated-carousel';
import { useDispatch, useSelector } from "react-redux";
import { getRoomsThunk, getRoomByIdThunk } from "../../Service/api/thunks";
import { clearSelectedRoom } from "../../Service/slices/BusinessProfile/roomSlice";

const { width, height } = Dimensions.get("window");

const RoomViewScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const {
        roomsList = [],
        loading = false,
        error = null,
        selectedRoom = null,
        selectedRoomLoading = false,
        selectedRoomError = null
    } = useSelector((state) => state.rooms || {});

    const blinkAnim = useRef(new Animated.Value(1)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [fullImage, setFullImage] = useState(null);
    const [viewmodalVisible, setViewModalVisable] = useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [blinkAnim]);

    useEffect(() => {
        dispatch(getRoomsThunk(1));
    }, [dispatch]);

    const handleRoomSelect = (roomId) => {
        dispatch(getRoomByIdThunk(roomId));
        setViewModalVisable(true);
    };

    const handleCloseModal = () => {
        setViewModalVisable(false);
        dispatch(clearSelectedRoom());
    };

    const amenityIcons = {
        "AC": "snowflake-o",
        "Wi-Fi": "wifi",
        "Power Backup": "bolt",
        "Study Table": "book",
        "Fan": "fan",
        "CCTV": "video-camera",
        "Meals": "cutlery",
        "Parking": "car",

    };

    const getAmenityIcon = (amenity) => {
        return amenityIcons[amenity] || "question-circle";
    };

    const stats = [
        {
            label: "Total Room",
            value: Array.isArray(roomsList) ? roomsList.length : 0,
            icon: "bed-outline"
        },
        {
            label: "Total Seat",
            value: Array.isArray(roomsList) ? roomsList.reduce((sum, r) => sum + (r.total_beds || 0), 0) : 0,
            icon: "bed-outline",
        },
        {
            label: "Engaged Seat",
            value: Array.isArray(roomsList) ? roomsList.reduce((sum, r) => sum + (r.booked_beds || 0), 0) : 0,
            icon: "bed-outline",
        },
    ];

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'Share your Business Profile',
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, color: '#000' }}>Loading rooms...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, color: 'red' }}>Error: {error}</Text>
                <TouchableOpacity
                    onPress={() => dispatch(getRoomsThunk(1))}
                    style={{ marginTop: 20, backgroundColor: 'orange', padding: 10, borderRadius: 8 }}
                >
                    <Text style={{ color: '#fff' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!Array.isArray(roomsList) || roomsList.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, color: '#000' }}>No rooms found</Text>
                <TouchableOpacity
                    onPress={() => dispatch(getRoomsThunk(1))}
                    style={{ marginTop: 20, backgroundColor: 'orange', padding: 10, borderRadius: 8 }}
                >
                    <Text style={{ color: '#fff' }}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: height * 0.15 }}>
                <View style={styles.statsRow}>
                    {stats.map((item, idx) => (
                        <View key={idx} style={styles.statsCard}>
                            <View style={styles.statsValueCircle}>
                                <Text style={styles.statsValue}>{item.value}</Text>
                            </View>
                            <Ionicons name={item.icon} size={width * 0.08} color="#000" />
                            <Text style={styles.statsLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {roomsList.map((room, roomIdx) => (
                    <View key={room.id} style={styles.card}>
                        <View style={{ position: "relative" }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    if (!room.images || room.images.length === 0) {
                                        Alert.alert("No images available");
                                        return;
                                    }

                                    const fullURLs = room.images.map(img =>
                                        img.startsWith("http") ? img : `http://192.168.225.143:8000/storage/room/${img}`
                                    );
                                    setSelectedImages(fullURLs);
                                    setModalVisible(true);
                                }}
                            >
                                <Carousel
                                    loop
                                    width={width - width * 0.08}
                                    height={height * 0.22}
                                    autoPlay={true}
                                    autoPlayInterval={3000}
                                    data={room.images || []}
                                    scrollAnimationDuration={1000}
                                    renderItem={({ item }) => {
                                        const uri = item.startsWith("http") ? item : `http://192.168.225.143:8000/storage/room/${item}`;
                                        return (
                                            <Image
                                                source={{ uri }}
                                                style={styles.roomImage}
                                                resizeMode="cover"
                                            />
                                        );
                                    }}
                                />
                            </TouchableOpacity>

                            <Modal
                                visible={modalVisible}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <Carousel
                                        loop
                                        width={width}
                                        height={height * 0.8}
                                        data={selectedImages}
                                        scrollAnimationDuration={800}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => setFullImage(item)}
                                                style={styles.modalImageContainer}
                                            >
                                                <Image
                                                    source={{ uri: item }}
                                                    style={styles.modalImage}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Ionicons name="close" size={30} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            <Modal
                                visible={!!fullImage}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => setFullImage(null)}
                            >
                                <View style={styles.fullImageContainer}>
                                    <Image source={{ uri: fullImage }} style={styles.fullImage} />
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setFullImage(null)}
                                    >
                                        <Ionicons name="close" size={30} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            <View style={styles.liveContainer}>
                                <Animated.View style={[styles.dot, { opacity: blinkAnim }]} />
                                <Text style={styles.liveText}>LIVE</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.editIcon}
                                onPress={() => navigation.navigate("EditRoom", { roomId: room.id })}
                            >
                                <Ionicons name="create-outline" size={width * 0.05} color="black" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => handleRoomSelect(room.id)}>
                            <View style={styles.cardBottomRow}>
                                <View style={{ flex: 0.55 }}>
                                    <Text style={styles.roomTitle}>Room #{room.room_number}</Text>
                                    <Text style={styles.roomSubtitle}>Type: {room.room_type}</Text>

                                    <View style={styles.bedRow}>
                                        <Ionicons
                                            name="information-circle-outline"
                                            size={width * 0.05}
                                            color="gray"
                                        />
                                        {Array.from({ length: room.total_beds || 0 }).map((_, i) => {
                                            const isBooked = i < (room.booked_beds || 0);
                                            return (
                                                <Ionicons
                                                    key={i}
                                                    name="bed-outline"
                                                    size={width * 0.055}
                                                    color={isBooked ? "orange" : "black"}
                                                    style={{ marginLeft: width * 0.01 }}
                                                />
                                            );
                                        })}
                                    </View>

                                    <View style={styles.priceContainer}>
                                        <Text style={styles.currentPrice}>₹ {room.monthly_rent || 0}</Text>
                                        <Text style={styles.oldPrice}>₹ {room.monthly_rent || 0}</Text>
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>5-25% off</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.amenitiesRight}>
                                    {room.amenities && room.amenities.slice(0, 4).map((amenity, idx) => (
                                        <View key={idx} style={styles.amenityIconBox}>
                                            <FontAwesome
                                                name={getAmenityIcon(amenity)}
                                                size={width * 0.05}
                                                color="orange"
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}

                <Modal
                    animationType="slide"
                    visible={viewmodalVisible}
                    transparent={false}
                >
                    <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                            <FontAwesome
                                name="close"
                                size={28}
                                color="orange"
                                style={styles.modalCloseIcon}
                                onPress={handleCloseModal}
                            />

                            {selectedRoomLoading ? (
                                <View style={styles.loadingContainer}>
                                    <Text style={{ fontSize: 18, color: '#000' }}>Loading room details...</Text>
                                </View>
                            ) : selectedRoom ? (
                                <>
                                    <Carousel
                                        loop
                                        width={width}
                                        height={height * 0.25}
                                        autoPlay
                                        mode="parallax"
                                        scrollAnimationDuration={800}
                                        data={
                                            (selectedRoom?.images || []).map(img =>
                                                img.startsWith("http")
                                                    ? img
                                                    : `http://192.168.225.143:8000/storage/room/${img}`
                                            )
                                        }
                                        renderItem={({ item }) => (
                                            <Image
                                                source={{ uri: item }}
                                                style={styles.selectedRoomImage}
                                                resizeMode="cover"
                                            />
                                        )}
                                    />

                                    <View style={styles.liveContainer}>
                                        <Animated.View style={[styles.dot, { opacity: blinkAnim }]} />
                                        <Text style={styles.liveText}>LIVE</Text>
                                    </View>

                                    <View style={{ padding: 10, marginTop: 10 }}>
                                        <View style={styles.cardmodal}>
                                            <View style={styles.roomDetailsHeader}>
                                                <Text style={styles.roomDetailsTitle}>Room Details</Text>
                                                <TouchableOpacity onPress={onShare}>
                                                    <FontAwesome name="share" size={22} color="orange" />
                                                </TouchableOpacity>
                                            </View>

                                            <Text style={styles.roomNumberTitle}>
                                                Room #{selectedRoom?.room_number}
                                            </Text>
                                            <View style={styles.roomInfoRow}>
                                                <FontAwesome
                                                    name="hotel"
                                                    size={20}
                                                    color={"orange"}
                                                    style={styles.hotelIcon}
                                                />
                                                <Text style={styles.bedsText}>
                                                    {selectedRoom?.total_beds} Beds
                                                </Text>
                                                <Text style={styles.roomTypeText}>
                                                    | Type: {selectedRoom?.room_type}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.cardmodal}>
                                            <Text style={styles.label}>Renting</Text>
                                            <View style={styles.rentingContainer}>
                                                {[
                                                    { price: selectedRoom?.monthly_rent, label: "Monthly", discount: "5-25% off" },
                                                    { price: selectedRoom?.food_charge_monthly, label: "Food charge monthly", discount: "25% off" },
                                                    { price: selectedRoom?.per_day_bed_charge, label: "per bed daily basis (with food)", discount: null },
                                                ].map((item, index) => (
                                                    <View key={index} style={styles.priceRow}>
                                                        <Text style={styles.priceText}>₹ {item.price}</Text>
                                                        <Text style={styles.priceLabelText}>
                                                            ({item.label})
                                                        </Text>
                                                        {item.discount && (
                                                            <View style={styles.discountTag}>
                                                                <Text style={styles.discountTagText}>{item.discount}</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        <View style={styles.cardmodal}>
                                            <Text style={styles.label}>Elite Insights</Text>
                                            <Text style={styles.descriptionText}>
                                                {selectedRoom?.description}
                                            </Text>
                                        </View>

                                        <View style={styles.cardmodal}>
                                            <Text style={styles.label}>Amenities</Text>
                                            <View style={styles.amenitiesContainer}>
                                                {selectedRoom?.amenities?.map((amenity, index) => {
                                                    return (
                                                        <View key={index} style={styles.amenityItem}>
                                                            <FontAwesome
                                                                name={getAmenityIcon(amenity)}
                                                                size={width * 0.07}
                                                                color="orange"
                                                            />
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </View>

                                        <View style={styles.actionButtonsContainer}>
                                            <TouchableOpacity
                                                style={styles.hideButton}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.hideButtonText}>Hide from list</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.editButton}
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    navigation.navigate("EditRoom", {
                                                        allowRoomNoEdit: false,
                                                        roomId: selectedRoom?.id
                                                    });
                                                    handleCloseModal();
                                                }}
                                            >
                                                <Text style={styles.editButtonText}>Edit Room</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            ) : null}
                        </ScrollView>
                    </View>
                </Modal>
            </ScrollView>

            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={styles.bookNowButton}>
                    <Ionicons
                        name="bed-outline"
                        size={width * 0.055}
                        color="#fff"
                        style={{ marginRight: width * 0.02 }}
                    />
                    <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bookNowButton}
                    onPress={() => navigation.navigate("EditRoom", { allowRoomNoEdit: false })}
                >
                    <MaterialCommunityIcons
                        name="home-edit-outline"
                        size={width * 0.055}
                        color="#fff"
                        style={{ marginRight: width * 0.02 }}
                    />
                    <Text style={styles.bookText}>Add Custom Item</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RoomViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: height * 0.025,
    },
    statsCard: {
        backgroundColor: "#fff",
        borderRadius: width * 0.03,
        width: width / 3.4,
        alignItems: "center",
        paddingVertical: height * 0.015,
        elevation: 3,
    },
    statsValueCircle: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.05,
        borderWidth: 2,
        borderColor: "orange",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: height * 0.005,
    },
    statsValue: {
        fontWeight: "700",
        color: "#000",
        fontSize: width * 0.04
    },
    statsLabel: {
        fontSize: width * 0.03,
        marginTop: height * 0.005,
        fontWeight: "500"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: width * 0.04,
        marginHorizontal: width * 0.04,
        marginTop: height * 0.025,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    roomImage: {
        width: '100%',
        height: '100%'
    },
    editIcon: {
        position: "absolute",
        top: height * 0.015,
        right: width * 0.03,
        backgroundColor: "#ffff",
        padding: width * 0.02,
        borderRadius: width * 0.05,
        elevation: 4,
    },
    cardBottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: width * 0.03,
    },
    roomTitle: {
        fontSize: width * 0.05,
        fontWeight: "700",
        color: "#000"
    },
    roomSubtitle: {
        fontSize: width * 0.035,
        color: "#555",
        marginVertical: height * 0.005
    },
    bedRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: height * 0.005
    },
    amenitiesRight: {
        flex: 0.4,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: width * 0.03,
    },
    amenityIconBox: {
        backgroundColor: "#fff7e6",
        borderRadius: width * 0.03,
        padding: width * 0.025,
        margin: width * 0.01,
        elevation: 2,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: height * 0.005,
        gap: width * 0.02,
    },
    currentPrice: {
        fontWeight: "bold",
        fontSize: width * 0.045,
        color: "#000",
    },
    oldPrice: {
        fontSize: width * 0.035,
        color: "gray",
        textDecorationLine: "line-through",
    },
    discountBadge: {
        backgroundColor: "yellow",
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.003,
        borderRadius: 7,
    },
    discountText: {
        fontSize: width * 0.033,
        fontWeight: "600",
        color: "#000",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalImageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalImage: {
        width: width * 0.9,
        height: height * 0.7,
    },
    fullImageContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.95)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: width * 0.9,
        height: height * 0.7,
        resizeMode: "contain",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.57)",
        padding: 10,
        borderRadius: 20,
    },
    liveContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "orange",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        alignSelf: "flex-start",
        margin: 5,
        position: "absolute",
        top: 5
    },
    dot: {
        width: 8,
        height: 8,
        backgroundColor: "#fff",
        borderRadius: 4,
        marginRight: 6,
    },
    liveText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        letterSpacing: 1,
    },
    modalCloseIcon: {
        position: "absolute",
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#46433c8e"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
    selectedRoomImage: {
        width: '100%',
        height: '100%'
    },
    cardmodal: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "orange"
    },
    roomDetailsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },
    roomDetailsTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#000"
    },
    roomNumberTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#000",
        marginBottom: 6
    },
    roomInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 20
    },
    hotelIcon: {
        backgroundColor: "#fff4e6",
        borderRadius: 6,
        padding: 6,
        borderWidth: 1,
        borderColor: "orange",
    },
    bedsText: {
        fontSize: 20,
        color: "#000",
        fontWeight: "500"
    },
    roomTypeText: {
        fontSize: 20,
        color: "#000",
        fontWeight: "500"
    },
    label: {
        color: "black",
        fontSize: 24,
        fontWeight: "500"
    },
    rentingContainer: {
        gap: 8,
        marginTop: 6,
        marginBottom: 20
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },
    priceText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000"
    },
    priceLabelText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#444",
        marginLeft: 4
    },
    discountTag: {
        backgroundColor: "orange",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    discountTagText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13
    },
    descriptionText: {
        fontSize: 15,
        color: "#333",
        fontWeight: "400",
        lineHeight: 22,
        marginBottom: 20,
        marginTop: 5,
    },
    amenitiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        marginTop: 8,
    },
    amenityItem: {
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: "#fff7e6",
        borderRadius: 10,
        elevation: 2,
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        gap: 18
    },
    hideButton: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "orange",
        elevation: 3,
    },
    hideButtonText: {
        color: "orange",
        fontWeight: "700",
        fontSize: 16
    },
    editButton: {
        backgroundColor: "orange",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        elevation: 3,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },
    bottomButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: width * 0.01,
        position: "absolute",
        top: height * 0.90
    },
    bookNowButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#36454F",
        borderWidth: 1,
        borderColor: "orange",
        paddingVertical: height * 0.015,
        borderRadius: width * 0.08,
        elevation: 6,
        marginBottom: 30,
    },
    bookText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: width * 0.04
    }
});
