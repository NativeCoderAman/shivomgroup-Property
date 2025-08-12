import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, Modal, Alert, Share, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";  
import { useDispatch, useSelector } from "react-redux";
import { getPropertyThunk, updatePropertyThunk } from "../../Service/api/thunks";
import { clearUpdateStatus } from "../../Service/slices/BusinessProfile/propertySlice";

const { width, height } = Dimensions.get('window');

const BusinessProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { propertyList, loading, error, updateLoading, updateError, updateSuccess } = useSelector((state) => state.property);

     const [activeIndexes, setActiveIndexes] = useState({});
    const carouselRefs = useRef({});

    useEffect(() => {
        dispatch(getPropertyThunk(4));
    }, []);

    useEffect(() => {
        if (propertyList && propertyList.length > 0) {
            const formattedCards = propertyList.map((item) => ({
                id: item.id,
                propertyName: item.property_name,
                propertytype: item.property_type,
                address: item.address,
                contact: item.contact,
                description: item.description,
                images: item.images,
                amenities: item.amenities,
                totalRooms: item.total_rooms,
                occupiedRooms: item.occupied_rooms,
            }));
            setCards(formattedCards);
        }
    }, [propertyList]);

     useEffect(() => {
        const intervals = [];
        
        cards.forEach((card) => {
            if (card.images && card.images.length > 1) {
                const interval = setInterval(() => {
                    setActiveIndexes((prev) => {
                        const currentIndex = prev[card.id] || 0;
                        const nextIndex = (currentIndex + 1) % card.images.length;
                        
                         if (carouselRefs.current[card.id]) {
                            carouselRefs.current[card.id].scrollTo({ 
                                index: nextIndex, 
                                animated: true 
                            });
                        }
                        
                        return { ...prev, [card.id]: nextIndex };
                    });
                }, 4000);  
                
                intervals.push(interval);
            }
        });

        return () => {
            intervals.forEach(interval => clearInterval(interval));
        };
    }, [cards]);

    useEffect(() => {
        if (updateSuccess) {
            alert("Property updated successfully!");
            setAddModalVisible(false);
            setEditData(null);
            setUploadedImages([]);
            dispatch(clearUpdateStatus());  
        }
        
        if (updateError) {
            alert("Update failed: " + updateError);
            dispatch(clearUpdateStatus());  
        }
    }, [updateSuccess, updateError, dispatch]);

    const [bgImage, setBgImage] = useState({
        uri: "https://videos.openai.com/vg-assets/assets%2Ftask_01jtt3asqgew6va87jj8a97g5a%2F1746780151_img_2.webp?st=2025-07-29T09%3A55%3A07Z&se=2025-08-04T10%3A55%3A07Z&sks=b&skt=2025-07-29T09%3A55%3A07Z&ske=2025-08-04T10%3A55%3A07Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=RcC30tzt0oqN1UQBXSibcIdgnsn2OuOaRh6L8vbauLA%3D&az=oaivgprodscus"
    });

    const handleBackgroundChange = () => {
        ImagePicker.openPicker({
            width: width,
            height: 250,
            cropping: true,
        }).then(image => {
            setBgImage({ uri: image.path });
        }).catch(err => {
            console.log(err);
        });
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'Share your Business Profile',
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const getAmenityIcon = (amenityName) => {
        const iconMap = {
            'WiFi': 'wifi',
            'Free Wi-Fi': 'wifi',
            'AC': 'snowflake-o',
            'AC Room': 'snowflake-o',
            'Meals': 'cutlery',
            'Food': 'cutlery',
            'CCTV': 'video-camera',
            'Security': 'shield',
            'Power Backup': 'flash',
            'Cleaning': 'magic',
            'Laundry': 'magic',
            'Parking': 'car',
            'Water': 'tint',
            'Electricity': 'flash',
            'Internet': 'wifi',
            'default': 'check'
        };
        return iconMap[amenityName] || iconMap['default'];
    };

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalVisible, setModalVisibleIm] = useState(false);
    const [profileImage, setProfileImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjDGMp734S91sDuUFqL51_xRTXS15iiRoHew&s");

    const [profileData, setProfileData] = useState({
        hostelName: "shivom",
        email: "zentrue@email.com",
        phone: "+91 9876543210",
        address: "12-B, MG Road, Bengaluru",
        bookings: "10",
        subscription: {
            plan: "Gold",
            validTill: "2025-09-30",
            platform: "Mobile + Desktop"
        }
    });

    const getRemainingDays = (dateString) => {
        const today = new Date();
        const endDate = new Date(dateString);
        const diffTime = endDate - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return daysLeft > 0 ? `${daysLeft} days remaining` : "Expired";
    };

    const handleChange = (key, value) => {
        setProfileData({ ...profileData, [key]: value });
    };

    const handleProfileImageChange = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
        }).then(image => {
            setProfileImage(image.path);
        }).catch(err => console.log(err));
    };

    const [cards, setCards] = useState([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleOpenEditModal = () => {
        if (propertyList && propertyList.length > 0) {
            const propertyToEdit = propertyList.find(p => p.id === 4);
            if (propertyToEdit) {
                setEditData(propertyToEdit);
                setAddModalVisible(true);
            } else {
                alert("Property with id not found");
            }
        }
    };

    const handleSaveCard = async () => {
        if (!editData || !editData.id) {
            alert("No property selected to update");
            return;
        }

        const formData = new FormData();
        
        formData.append("contact", editData.contact);
        formData.append("alternative_contact", editData.alternative_contact);
        formData.append("address", editData.address);
        formData.append("description", editData.description);

        editData.amenities.forEach((a, i) => {
            formData.append(`amenities[${i}]`, a);
        });

        uploadedImages.forEach((img, index) => {
            formData.append('images[]', {
                uri: img.uri,
                type: img.type || 'image/jpeg',
                name: img.name || `image_${index}.jpg`,
            });
        });

        dispatch(updatePropertyThunk({ 
            id: editData.id, 
            formData 
        }));
    };

    const handleUploadImage = () => {
        if (uploadedImages.length >= 12) {
            alert("Maximum 12 images allowed!");
            return;
        }

        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
        }).then((image) => {
            setUploadedImages([...uploadedImages, { uri: image.path }]);
        });
    };

    return (
        <View style={styles.Container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <ImageBackground style={styles.profilesection}
                    source={bgImage} imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                >
                    <View style={styles.darkOverlay} />

                    <TouchableOpacity
                        style={styles.leftIcon}
                        onPress={handleBackgroundChange}
                    >
                        <Ionicons name="image-outline" size={24} color="#ffff" />
                    </TouchableOpacity>

                    <Image
                        source={{
                            uri: "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small_2x/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg"
                        }}
                        style={styles.image}
                    />
                    <Text style={styles.nametx}>Shivom Group</Text>

                    <LinearGradient colors={['#FFD700', '#ffd68aff']} style={styles.memberTag}>
                        <Text style={styles.memberText}>Gold Member</Text>
                    </LinearGradient>

                    <View style={styles.starcontainer}>
                        {[...Array(5)].map((_, index) => (
                            <Icon
                                key={index}
                                name={index < 4 ? "star" : "star-o"}
                                size={24}
                                color="#FFD700"
                                style={{ marginHorizontal: 3 }}
                            />
                        ))}
                        <Text style={{ marginLeft: 8, fontSize: 16, color: "#fff", fontWeight: "600" }}>
                            4/5
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row", zIndex: 2 }}>
                        <Text style={{ fontSize: 20, color: "#bdff17" }}> Active Subscription</Text>
                        <Icon name="history" size={22} color={"#bdff17"} style={{ marginLeft: 10, marginTop: 2 }}
                            onPress={() => setModalVisible(true)}
                        />
                    </View>

                    <TouchableOpacity style={styles.shareIcon} onPress={onShare}>
                        <Icon name="share-alt" size={27} color="#ffff"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                padding: 12,
                                borderRadius: 20,
                            }}
                        />
                    </TouchableOpacity>

                    <View style={styles.profileButtonsRow}>
                        <TouchableOpacity style={[styles.profileButton, { backgroundColor: "#4A90E2" }]}>
                            <Ionicons name="bar-chart-outline" size={20} color="#fff" style={styles.iconStyle} />
                            <Text style={styles.profileButtonText}>Performance</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.profileButton, { backgroundColor: "#F5A623" }]}>
                            <Ionicons name="hand-left-outline" size={20} color="#fff" style={styles.iconStyle} />
                            <Text style={styles.profileButtonText}>Total Clicks</Text>
                            <View style={styles.clickValueBadge}>
                                <Text style={styles.clickValueText}>245</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.profileButton, { backgroundColor: "#7ED321" }]}>
                            <Ionicons name="rocket-outline" size={20} color="#fff" style={styles.iconStyle} />
                            <Text style={styles.profileButtonText}>Boost</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.subscriptionCard}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>📦 Subscription Info</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#555" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.subscriptionRow}>
                                <MaterialIcons name="verified-user" size={20} color="#007bff" />
                                <Text style={styles.subscriptionLabel}>Plan:</Text>
                                <Text style={styles.subscriptionValue}>{profileData.subscription.plan}</Text>
                            </View>

                            <View style={styles.subscriptionRow}>
                                <MaterialIcons name="event" size={20} color="#FFA500" />
                                <Text style={styles.subscriptionLabel}>Valid Till:</Text>
                                <Text style={styles.subscriptionValue}>{profileData.subscription.validTill}</Text>
                            </View>

                            <View style={styles.subscriptionRow}>
                                <MaterialIcons name="check-circle" size={20} color="green" />
                                <Text style={styles.subscriptionLabel}>Status:</Text>
                                <Text style={styles.subscriptionValue}>
                                    {getRemainingDays(profileData.subscription.validTill) === "Expired" ? "Expired" : "Active"}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.modalCloseButton}
                            >
                                <Text style={{ color: "#ffff", fontSize: 18, textAlign: "center" }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                 <Modal
                    visible={modalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setModalVisibleIm(false)}
                >
                    <View style={styles.imageModalOverlay}>
                        <View style={styles.imageModalContainer}>
                            <Image
                                source={{}}
                                style={styles.imagePreview}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.imageCloseButton}
                                onPress={() => setModalVisibleIm(false)}
                            >
                                <Ionicons name="close-circle" size={40} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                 <View style={styles.filedcontainer}>
                    {cards.map((card) => (
                        <View key={card.id} style={styles.newCard}>
                            <View style={styles.imageWrapper}>
                                 <Carousel
                                    ref={(ref) => {
                                         if (ref) carouselRefs.current[card.id] = ref;
                                    }}
                                    width={width - 32}                     
                                    height={180}                         
                                    data={card.images || []}             
                                    scrollAnimationDuration={600}          
                                    onSnapToItem={(index) => {
                                         setActiveIndexes(prev => ({
                                            ...prev,
                                            [card.id]: index
                                        }));
                                    }}
                                    renderItem={({ item, index }) => (     
                                        <TouchableOpacity 
                                            onPress={() => setModalVisibleIm(true)}
                                            style={{
                                                width: width - 32,
                                                height: 180,
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20,
                                            }}
                                        >
                                            <Image
                                                source={{ 
                                                    uri: `http://192.168.225.143:8000/storage/properties/${item}` 
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    borderTopLeftRadius: 20,
                                                    borderTopRightRadius: 20,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    )}
                                    mode="parallax"                       
                                    modeConfig={{
                                        parallaxScrollingScale: 0.9,      
                                        parallaxScrollingOffset: 50,      
                                    }}
                                    autoPlay={card.images && card.images.length > 1}   
                                    autoPlayInterval={4000}             
                                    loop={card.images && card.images.length > 1}       
                                    panGestureHandlerProps={{
                                        activeOffsetX: [-10, 10],        
                                    }}
                                />

                                 <TouchableOpacity style={styles.favoriteButton}>
                                    <Ionicons name="heart" size={20} color="#fff" />
                                </TouchableOpacity>

                                 {card.images && card.images.length > 1 && (
                                    <View style={{
                                        position: "absolute",
                                        bottom: 12,
                                        alignSelf: "center",
                                        flexDirection: "row",
                                        zIndex: 10,
                                    }}>
                                        {card.images.map((_, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => {
                                                     setActiveIndexes(prev => ({
                                                        ...prev,
                                                        [card.id]: i
                                                    }));
                                                    if (carouselRefs.current[card.id]) {
                                                        carouselRefs.current[card.id].scrollTo({ 
                                                            index: i, 
                                                            animated: true 
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    marginHorizontal: 3,
                                                    elevation: 2,
                                                    backgroundColor: i === (activeIndexes[card.id] || 0) 
                                                        ? "orange" 
                                                        : "rgba(255,255,255,0.6)"
                                                }}
                                            />
                                        ))}
                                    </View>
                                )}

                                 {card.images && card.images.length > 1 && (
                                    <View style={{
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        backgroundColor: "rgba(0,0,0,0.7)",
                                        borderRadius: 12,
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        zIndex: 10,
                                    }}>
                                        <Text style={{
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: "600",
                                        }}>
                                            {(activeIndexes[card.id] || 0) + 1} / {card.images.length}
                                        </Text>
                                    </View>
                                )}

                              
                            </View>

                            <View style={styles.cardDetails}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.propertyName}>{card.propertyName}</Text>
                                    <View style={styles.ratingRow}>
                                        <Ionicons name="star" size={16} color="#FFD700" />
                                        <Text style={styles.ratingText}>{card.propertytype}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <Ionicons name="location-outline" size={16} color="orange" />
                                        <Text style={styles.labelNew}>Address</Text>
                                    </View>
                                    <Text style={styles.subText}>{card.address}</Text>
                                </View>

                                <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <Ionicons name="call-outline" size={16} color="orange" />
                                        <Text style={styles.labelNew}>Contact</Text>
                                    </View>
                                    <Text style={styles.subText}>{card.contact}</Text>
                                </View>

                                <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <Text style={styles.labelNew}>Elite Insights</Text>
                                    </View>
                                    <Text style={styles.description}>{card.description}</Text>
                                </View>

                                <View style={styles.amenitiesRow}>
                                    {card.amenities && card.amenities.length > 0 ? (
                                        card.amenities.map((item, idx) => (
                                            <View key={idx} style={styles.amenityBox}>
                                                <Icon name={getAmenityIcon(item)} size={18} color="#555" />
                                                <Text style={styles.amenityLabel}>{item}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text>No Amenities</Text>
                                    )}
                                </View>

                                <View style={styles.bottomRow}>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoLabel}> Number of Rooms</Text>
                                        <Text style={styles.infoValue}>{card.totalRooms}</Text>
                                    </View>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoLabel}>Occupied</Text>
                                        <Text style={styles.infoValue}>{card.occupiedRooms}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.viewRoomsButton}
                                    onPress={() => navigation.navigate('RoomViewScreen')}
                                >
                                    <Ionicons name="bed" size={20} color="#fff" />
                                    <Text style={styles.viewRoomsText}>View Rooms</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                 <Modal visible={addModalVisible} animationType="slide" transparent={false}>
                    <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                            <ImageBackground
                                source={bgImage}
                                style={styles.profilesection}
                                imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                            >
                                <View style={styles.darkOverlay} />

                                <TouchableOpacity style={styles.leftIcon} onPress={handleBackgroundChange}>
                                    <Ionicons name="image-outline" size={24} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.closeIcon}
                                    onPress={() => setAddModalVisible(false)}
                                >
                                    <Ionicons name="close" size={26} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        ImagePicker.openPicker({
                                            width: 300,
                                            height: 300,
                                            cropping: true,
                                        }).then((image) => {
                                            setProfileImage({ uri: image.path });
                                        });
                                    }}
                                >
                                    <Image source={{ uri: profileImage }} style={styles.image} />
                                </TouchableOpacity>

                                <Text style={styles.nametx}>{profileData.hostelName}</Text>

                                <LinearGradient colors={["#FFD700", "#ffd68aff"]} style={styles.memberTag}>
                                    <Text style={styles.memberText}>Gold Member</Text>
                                </LinearGradient>

                                <View style={styles.starcontainer}>
                                    {[...Array(5)].map((_, index) => (
                                        <Icon
                                            key={index}
                                            name={index < 4 ? "star" : "star-o"}
                                            size={24}
                                            color="#FFD700"
                                            style={{ marginHorizontal: 3 }}
                                        />
                                    ))}
                                    <Text style={{ marginLeft: 8, fontSize: 16, color: "#fff", fontWeight: "600" }}>4/5</Text>
                                </View>

                                <TouchableOpacity style={styles.shareIcon} onPress={onShare}>
                                    <Icon
                                        name="share-alt"
                                        size={27}
                                        color="#fff"
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                                            padding: 12,
                                            borderRadius: 20,
                                        }}
                                    />
                                </TouchableOpacity>
                            </ImageBackground>

                            <Text style={{ fontSize: 20, textAlign: "center", paddingVertical: 5 }}>Property Update</Text>

                            <View style={styles.infoCard}>
                                <TextInput
                                    placeholder="Contact Details"
                                    style={styles.addPropertyInput}
                                    value={editData?.contact || ""}
                                    onChangeText={val => setEditData(prev => ({ ...prev, contact: val }))}
                                />

                                <TextInput
                                    placeholder="Alternative Number"
                                    style={styles.addPropertyInput}
                                    value={editData?.alternative_contact || ""}
                                    onChangeText={val => setEditData(prev => ({ ...prev, alternative_contact: val }))}
                                />

                                <TextInput
                                    placeholder="Address"
                                    style={styles.addPropertyInput}
                                    value={editData?.address || ""}
                                    onChangeText={val => setEditData(prev => ({ ...prev, address: val }))}
                                />

                                <TextInput
                                    placeholder="Elite Insights"
                                    style={[styles.addPropertyInput, { height: 100, textAlignVertical: "top" }]}
                                    multiline
                                    value={editData?.description || ""}
                                    onChangeText={val => setEditData(prev => ({ ...prev, description: val }))}
                                />
                            </View>

                            <View
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: 16,
                                    padding: 16,
                                    marginHorizontal: 16,
                                    marginTop: 16,
                                    elevation: 3,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.05,
                                    shadowRadius: 5,
                                }}
                            >
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Text style={{ fontWeight: "600", color: "#444" }}>Property Type:</Text>
                                    <View style={{ flexDirection: "row", marginBottom: 12 }}>
                                        <Text style={{ fontWeight: "700", color: "orange" }}> {editData?.property_type || ""}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Text style={{ fontWeight: "600", color: "#444" }}>Occupied:</Text>
                                    <Text style={{ fontWeight: "700", color: "orange" }}>
                                        {editData?.occupied_rooms || 0}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontWeight: "600", color: "#444" }}>Total Rooms:</Text>
                                    <Text style={{ fontWeight: "700", color: "orange" }}>{editData?.total_rooms || 0}</Text>
                                </View>
                            </View>

                             <View style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 10,
                                padding: 10
                            }}>
                                {editData?.images?.map((imgFile, index) => (
                                    <View
                                        key={`api-${index}`}
                                        style={{
                                            width: "30%",
                                            aspectRatio: 1,
                                            borderRadius: 10,
                                            overflow: "hidden",
                                            backgroundColor: "#f0f0f0",
                                            elevation: 2
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => setModalVisibleIm(true)}>
                                            <Image
                                                source={{ uri: `http://192.168.225.143:8000/storage/properties/${imgFile}` }}
                                                style={{ width: "100%", height: "100%" }}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {uploadedImages?.map((img, index) => (
                                    <View
                                        key={`uploaded-${index}`}
                                        style={{
                                            width: "30%",
                                            aspectRatio: 1,
                                            borderRadius: 10,
                                            overflow: "hidden",
                                            backgroundColor: "#f0f0f0",
                                            elevation: 2
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => setModalVisibleIm(true)}>
                                            <Image
                                                source={{ uri: img.uri }}
                                                style={{ width: "100%", height: "100%" }}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                             <View style={styles.infoCard}>
                                <Text style={styles.sectionTitle}>Amenities</Text>
                                <View style={styles.amenitiesContainer}>
                                    {editData?.amenities?.map((item, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.amenityBox}
                                        >
                                            <Icon name={getAmenityIcon(item)} size={20} color="black" />
                                            <Text style={styles.amenityLabel}>{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={{ marginHorizontal: 16, marginTop: 20 }}>
                                <TouchableOpacity
                                    style={[styles.addPropertySaveButton, { 
                                        backgroundColor: updateLoading ? "#ccc" : "green" 
                                    }]}
                                    onPress={handleSaveCard}
                                    disabled={updateLoading}
                                >
                                    <Text style={styles.addPropertyButtonText}>
                                        {updateLoading ? "Updating..." : "Save Changes"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.addPropertyImageButton} onPress={handleUploadImage}>
                                    <Text style={styles.addPropertyButtonText}>Pick Image</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </ScrollView>

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleOpenEditModal}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "#ffff",
    },
    profilesection: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 45,
        overflow: "hidden",
        position: "relative",
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    image: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: 80,
        zIndex: 2,
    },
    nametx: {
        fontSize: 26,
        fontWeight: "700",
        color: "#ffff",
        zIndex: 2,
        paddingTop: height * 0.01,
    },
    memberTag: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 6,
        zIndex: 2
    },
    memberText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    starcontainer: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        zIndex: 2
    },
    filedcontainer: {
        marginTop: 20,
        flex: 1,
        padding: 12,
    },
    amenitiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 15,
        gap: 10
    },
    amenityBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#fff",
        padding: 6,
        borderRadius: 8
    },
    amenityLabel: {
        fontSize: 12,
        fontWeight: "500"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscriptionCard: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    subscriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    subscriptionLabel: {
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 16,
        flex: 1,
        color: '#333',
    },
    subscriptionValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
    },
    modalCloseButton: {
        marginTop: 20,
        backgroundColor: 'orange',
        paddingVertical: 10,
        borderRadius: 10,
    },
    leftIcon: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 12,
        borderRadius: 20,
        zIndex: 10
    },
    shareIcon: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: height * 0.02,
        right: width * 0.02,
        backgroundColor: 'orange',
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: (width * 0.15) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 20
    },
    addPropertyInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: height * 0.015,
    },
    addPropertyImageButton: {
        backgroundColor: 'orange',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    addPropertySaveButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: height * 0.015,
    },
    addPropertyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imageModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    imageModalContainer: {
        width: "90%",
        height: "60%",
        borderRadius: 15,
        overflow: "hidden",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
    },
    imageCloseButton: {
        position: "absolute",
        top: height * 0.02,
        right: width * 0.04,
    },
    profileButtonsRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.04,
        paddingVertical: height * 0.01,
        position: "relative",
        gap: width * 0.028,
        zIndex: 12,
    },
    profileButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4A90E2",
        borderRadius: 10,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.02,
        elevation: 3,
        position: "relative",
    },
    profileButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: width * 0.035,
        marginLeft: width * 0.015,
    },
    iconStyle: {
        marginRight: 4,
    },
    clickValueBadge: {
        position: "absolute",
        top: -height * 0.007,
        right: -width * 0.025,
        backgroundColor: "#fff",
        borderRadius: width * 0.025,
        paddingHorizontal: width * 0.015,
        paddingVertical: height * 0.004,
        elevation: 2,
    },
    clickValueText: {
        color: "#F5A623",
        fontWeight: "700",
        fontSize: 12,
    },
    newCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        marginBottom: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    imageWrapper: {
        position: "relative",
    },
    favoriteButton: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
        padding: 6,
        zIndex: 5,
    },
    cardDetails: {
        padding: 14,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    propertyName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        flex: 1,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 4,
        color: "#333",
    },
    subText: {
        fontSize: 13,
        color: "#555",
        marginVertical: 1,
    },
    description: {
        fontSize: 14,
        color: "#000",
        marginVertical: 6,
        fontStyle: "italic",
        fontWeight: "500",
    },
    amenitiesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    infoBox: {
        alignItems: "center",
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: "#777",
    },
    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000",
        marginTop: 2,
    },
    viewRoomsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff8b17",
        borderRadius: 12,
        paddingVertical: 10,
        marginTop: 14,
    },
    viewRoomsText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 6,
        fontSize: 14,
    },
    labelNew: {
        fontSize: 16,
        fontWeight: "600",
        color: "#555",
    },
    closeIcon: {
        position: "absolute",
        top: 15,
        right: 15,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 8,
        borderRadius: 20,
    },
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        marginBottom: 12,
    },
});

export default BusinessProfile;
