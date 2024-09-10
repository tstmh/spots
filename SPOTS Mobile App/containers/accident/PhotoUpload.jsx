import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, FlatList, Alert, ToastAndroid } from 'react-native';
import WhiteButton from '../../components/common/WhiteButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { formatDateTimeToString } from '../../utils/Formatter';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';
import RNFS from 'react-native-fs';
import Images from '../../models/Images';
import DatabaseService from '../../utils/DatabaseService';

const PhotoUpload = React.forwardRef((props, ref) => {
    const { accidentReport } = useContext(AccidentReportContext);
    const { officer } = useContext(OfficerContext);
    const [photos, setPhotos] = useState([]);

    const imageType = "photo";
    const maxPhotos = 10;

    useEffect(() => {
        const fetchPhotoUploads = async () => {
            console.log("fetchPhotoUploads");
            try {
                const accidentReportId = accidentReport.ID;
                console.log("accidentReportId >> " , accidentReportId);
                const data = await Images.getImagesByAccIDImgType(DatabaseService.db, accidentReportId, imageType);
                
                console.log("photo upload data >> " , data.length);

                // Convert base64 to URI and map to photo object
                const photosWithUri = data.map(photo => ({
                    ...photo,
                    uri: photo.uri? photo.uri : `data:image/png;base64,${photo.IMAGE64}`,
                    CAPTION: photo.CAPTION || '',
                    ID: photo.ID || '',
                    CREATED_AT: photo.CREATED_AT,
                }));

                // photosWithUri.forEach((photo, index) => {
                //     console.log(`photo ${index} uri >> ` , photo.uri);
                // });

                //console.log("converted photos >> " , photosWithUri);
                setPhotos(photosWithUri);

            } catch (error) {
                console.error("Error fetching photos:", error);
            }
        };

        fetchPhotoUploads();
    }, []);

    const handleTakePhoto = () => {

        if (photos.length >= maxPhotos){
            Alert.alert('Validation Error', `Exceeded ${maxPhotos} Photos`);
            return;
        }

        const options = {
            mediaType: 'photo',
            quality: 0.4, // 0-1 (1-Highest Quality)
            type: 'png',
            width: 375, //375 x 500 
            height: 500
        };
    
        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {

                const originalWidth = response.assets[0].width;
                const originalHeight = response.assets[0].height;

                // Desired width (old spots: 375x500)
                const newWidth = 375;
                // Calculate the new height to maintain the aspect ratio
                const aspectRatio = originalHeight / originalWidth;
                const newHeight = newWidth * aspectRatio;

                // Resize the image
                ImageResizer.createResizedImage(
                    response.assets[0].uri,
                    newWidth,
                    newHeight,
                    'JPEG', // You can choose 'JPEG' or 'PNG'
                    100    // Quality
                ).then((resizedImage) => {
                    console.log('Resized Image URI:', resizedImage.uri);
                    // You can now use the resized image URI as needed
                    if (resizedImage.uri) {
                        setPhotos((prevPhotos) => [...prevPhotos, { uri: resizedImage.uri, CAPTION: '', ID: Date.now() }]);
                    } else {
                        console.error('Invalid URI returned from camera');
                    }
                }).catch((err) => {
                    console.log('Image Resizing Error:', err);
                });
            }
        });
    };

    const handleCaptionChange = (text, id) => {
        const updatedPhotos = photos.map((photo) => {
            if (photo.ID === id) {
                return { ...photo, CAPTION: text };
            }
            return photo;
        });
    
        setPhotos(updatedPhotos);
    };

    const handleDeletePhoto = (id) => {
        console.log('handleDeletePhoto ID >>', id);
        
        // Find the photo by ID and delete it from the database
        Images.deleteImages(DatabaseService.db, id);
    
        // Filter out the photo with the given ID from the photos array
        const updatedPhotos = photos.filter(photo => photo.ID !== id);
        
        // Update state with the new array
        setPhotos(updatedPhotos);
    };    

    const convertImageToBase64 = async (uri) => {
        console.log('convertImageToBase64' , uri);
        try {
            const base64String = await RNFS.readFile(uri, 'base64');
            console.log('base64String: ', base64String);
            return base64String;
        } catch (error) {
            console.log('Error converting image to Base64: ', error);
            return null;
        }
    };

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: save_as_draft,
    }));

    const save_as_draft = async () => {
        console.log(`save_as_draft photo upload ${photos.length} >> `);
        try {
            const updatedPhotos = await Promise.all(
                photos.map(async (photo) => {
                    if (!photo.IMAGE64) {
                        console.log('Converting image to base64 for photo:', photo.uri);
                        const IMAGE64 = await convertImageToBase64(photo.uri);
                        return { ...photo, IMAGE64 };
                    }
                    return photo; 
                })
            );

            //console.log('Photos with Base64:', updatedPhotos);
            updatedPhotos.forEach(photo => handleSave(photo));
            
            ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
            return true;
        } catch (error) {
            console.log('Error saving draft: ', error);
            Alert.alert('Error', 'There was an error saving the draft.');
            return true;
        }
    };

    const handleSave = async (photo) => {
        const imageToSave = {
            ID: photo.ID,
            ACCIDENT_REPORT_ID : accidentReport.ID,
            OFFICER_ID : officer.OFFICER_ID,
            IMAGE_TYPE : imageType,
            CAPTION : photo.CAPTION,
            IMAGE64 : photo.IMAGE64,
            CREATED_AT : photo.createdAt? photo.createdAt : formatDateTimeToString(new Date()),
        }

        try {
            await Images.insertPhotoUpload(DatabaseService.db, imageToSave);
        } catch (error){
            console.error('Error inserting photoupload', error);
        }
        
    };

    const confirmDelete = (id) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this photo?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => handleDeletePhoto(id),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.PhotoItem}>
            <View style={styles.PhotoFrame}>
                <Image source={{ uri: item.uri }} style={styles.Photo} resizeMode='contain'/>
                <TouchableOpacity style={styles.DeleteIcon} onPress={() => confirmDelete(item.ID)}>
                    <Image source={require('../../assets/icon/delete.png')} 
                    style={{ width: 16, height: 18 }} />
                </TouchableOpacity>
            </View>
            <Text style={styles.RtaLocation}>RTA Location</Text>
            <View style={styles.RoundedCaptionInputFont}>
                <TextInput
                    style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12, color: 'black' }}
                    placeholder="Add Caption"
                    value={item.CAPTION}
                    onChangeText={(text) => handleCaptionChange(text, item.ID)}
                    maxLength={255}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.ContainerWhiteBG}>
            <SafeAreaView style={{height: "100%"}}>
                {photos.length === 0 ? (
                    <View style={styles.PhotoUploadFrame}>
                        <View style={styles.CenteredTakePhoto}>
                            <TouchableOpacity style={styles.TakePhotoFrame} onPress={handleTakePhoto}>
                                <Image source={require('../../assets/icon/camera.png')} style={{ width: 25, height: 22 }} />
                                <Text style={styles.LabelSmall}>Tap to take a Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.PhotoUploadListFrame}>
                        <FlatList
                            data={[{ isTakePhotoButton: true }, ...photos]}
                            extraData={photos}
                            renderItem={({ item, index }) => {
                                if (item.isTakePhotoButton) {
                                    return (
                                        <View style={styles.PhotoItem}>
                                            <TouchableOpacity style={styles.TakePhotoFrame} onPress={handleTakePhoto}>
                                                <Image source={require('../../assets/icon/camera.png')} style={{ width: 25, height: 22 }} />
                                                <Text style={styles.LabelSmall}>Tap to take a Photo</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                } else {
                                    return renderItem({ item, index });
                                }
                            }}
                            keyExtractor={(item, index) => item.ID ? item.ID.toString() : index.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.PhotoList}
                        />
                    </View>
                )}
                <View style={[styles.ComponentFrame]}>
                    <View style={styles.MarginContainerXSmall} />
                    <WhiteButton title="SAVE AS DRAFT" customClick={() => save_as_draft()}/>
                    <View style={styles.MarginContainerXSmall} />
                    <BackToHomeButton/>
                </View>
            </SafeAreaView>
        </View>
    );
});

export default PhotoUpload;
