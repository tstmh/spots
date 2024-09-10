import React, { useEffect, useState, useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Modal, TextInput, FlatList, Alert, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import styles from '../../components/spots-styles';
import BlueButton from '../../components/common/BlueButton';
import WhiteButton from '../../components/common/WhiteButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import Orientation from 'react-native-orientation-locker';
import Images from '../../models/Images';
import DatabaseService from '../../utils/DatabaseService';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';
import { formatDateTimeToString, formatIntegerValue } from '../../utils/Formatter';
import LoadingModal from '../../containers/common/Loading';
import { submitOSI } from '../../utils/SubmitHelper';

const SketchPlan = ({ navigation }) => {
    const { accidentReport, resetAccidentReport } = useContext(AccidentReportContext);
    const { officer } = useContext(OfficerContext);
    const [loading, setLoading] = useState(false);

    const imageType = 'sketchPlan';
    const maxSketches = 5;

    const [ sketchImages, setSketchImages ] = useState([]);
    const route = useRoute();
    
    const [toggleCheckSketch, setToggleCheckSketch] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        // Lock the screen to landscape mode when the component mounts
        Orientation.lockToPortrait();
    }, []);

    //fetch sketches from sqlite
    useEffect(() => {
        const fetchSketches = async () => {
            console.log("fetchSketches");
            try {
                const accidentReportId = accidentReport.ID;
                const data = await Images.getImagesByAccIDImgType(DatabaseService.db, accidentReportId, imageType);
                console.log("sketches data >> " , data.length);

                if (data && data.length > 0){
                    data.forEach((sketch, index) => {
                        console.log(`sketch ${index} base64 length >> `, sketch.IMAGE64.length);
                    });
    
                    // Convert base64 to URI and map to photo object
                    const sketchesWithUri = data.map(sketch => ({
                        ...sketch,
                        uri: `data:image/png;base64,${sketch.IMAGE64}`,
                        CAPTION: sketch.CAPTION || '',
                        ID: sketch.ID || '',
                    }));
    
                    //console.log("converted sketch >> " , sketchesWithUri);
                    setSketchImages(sketchesWithUri);
                }

            } catch (error) {
                console.error("Error fetching sketch:", error);
            }
        };

        fetchSketches();
    }, []);

    //fetch returned sketches (with uri) from Sketch.jsx
    useEffect(() => {
        //console.log('route ', route);
        if (route.params?.updatedSketchImage) {
            const updatedSketchImage = route.params.updatedSketchImage;

            // console.log('updatedSketchImage ', updatedSketchImage);

            setSketchImages((prev) => {
                const index = prev.findIndex((sketch) => sketch.ID === updatedSketchImage.ID);
                
                if (index !== -1) {
                    // Update existing sketch
                    return prev.map((sketch) =>
                        sketch.ID === updatedSketchImage.ID ? updatedSketchImage : sketch
                    );
                } else {
                    // Add new sketch
                    return [...prev, updatedSketchImage];
                }
            });

            // console.log('sketchImages ', sketchImages);
        }
    }, [route.params?.updatedSketchImage]);


    const handleCreateSketch = () => {

        if (!caption){
            Alert.alert('Validation Error', 'Please enter caption');
            return;
        }

        if (sketchImages.length >= maxSketches){
            Alert.alert('Validation Error', `Exceeded ${maxSketches} Sketches`);
            return;
        }

        const sketchImage = {
            ID: Date.now(),
            ACCIDENT_REPORT_ID : accidentReport.ID,
            OFFICER_ID : officer.OFFICER_ID,
            IMAGE_TYPE : imageType,
            CAPTION : caption,
            IMAGE64 : "",
            CREATED_AT : formatDateTimeToString(new Date()),
            RAW_METADATA: null
        }
        Images.insertSketch(DatabaseService.db, sketchImage);

        sketchImages.push(sketchImage);

        // console.log('sketchImages' , sketchImages);

        setModalVisible(false);
        
        navigation.navigate('AccidentAddSketch', { sketchImage });
    };

    const handleSave = async () => {
        console.log('handleSave!! image size:' , sketchImages.length);
        try {
            if (sketchImages.length > 0){
                sketchImages.forEach((image) => {
                    const imageToSave = {
                        ID: image.ID,
                        ACCIDENT_REPORT_ID : image.ACCIDENT_REPORT_ID,
                        OFFICER_ID : formatIntegerValue(image.OFFICER_ID),
                        IMAGE_TYPE : image.IMAGE_TYPE,
                        CAPTION : image.CAPTION,
                        IMAGE64 : image.IMAGE64,
                        CREATED_AT : image.CREATED_AT,
                        RAW_METADATA : image.RAW_METADATA
                    }
                    Images.insertSketch(DatabaseService.db, imageToSave);
                });
                ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
            };
        } catch (error) {
            console.error('Error capturing snapshot:', error);
        }
    };
    
    const handleSubmit = async () => {
        setLoading(true);

        const success = await submitOSI(accidentReport.ID, officer.OFFICER_ID);
        console.log('submitOSI success?', success);
        
        setLoading(false);

        if (success){
            resetAccidentReport();
            navigation.navigate('Dashboard');
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.PhotoItem}>
            <View style={styles.PhotoFrame}>
                <TouchableOpacity style={styles.Photo} onPress={() => handleEdit(index)}>
                    {item.uri ? (
                        <Image source={{ uri: item.uri }} style={styles.Photo} resizeMode='contain'/>
                    ) : (
                        <View style={styles.Photo} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.DeleteIcon} onPress={() => confirmDelete(index)}>
                    <Image source={require('../../assets/icon/delete.png')} 
                        style={{ width: 16, height: 18 }} />
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.RoundedCaptionInputFont}
                value={item.CAPTION}
                onChangeText={ (text) => handleCaptionChange(text, index) }
            />
        </View>
    );

    const handleEdit = (index) => {
        const sketchImage = sketchImages[index];
        //console.log('handleEdit ' , sketchImage);

        navigation.navigate('AccidentAddSketch', { sketchImage });
    };

    const handleCaptionChange = (text, index) => {
        const updatedSketches = [...sketchImages];
        updatedSketches[index].CAPTION = text;
        setSketchImages(updatedSketches);
    };

    const confirmDelete = (index) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this sketch?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => handleDeleteSketch(index),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleDeleteSketch = (index) => {
        console.log('handleDeleteSketch ID >> ' , sketchImages[index].ID);
        Images.deleteImages(DatabaseService.db, sketchImages[index].ID);

        const updatedSketches = sketchImages.filter((_, i) => i !== index);
        setSketchImages(updatedSketches);
    };

    const renderCreateModal = () => (
        <Modal transparent={true} visible={modalVisible}>
            <View style={styles.CenteredView}>
                <View style={styles.ModalView}>
                    <View style={styles.MarginContainerMedium} />
                    <View style={styles.SketchComponent}>
                        <Text style={styles.LabelBig}>Add New Sketch</Text>
                    </View>
                    <View style={styles.MarginContainerMedium} />
                    <View style={styles.ModalTextInputContainer}>
                        <Text style={styles.Label}> Sketch Caption </Text>
                        <TextInput
                            style={styles.ModalRoundedTextInput}
                            placeholder='Add Caption'
                            maxLength={255}
                            onChangeText={ (text) => setCaption(text) }
                        />
                        <View style={styles.ModalHorizontalVector} />
                    </View>
                    <View style={styles.ButtonContainer}>    
                        <BlueButton title="CREATE SKETCH" customClick={handleCreateSketch}/>
                        <View style={styles.MarginContainerXSmall} />
                        <WhiteButton title="Cancel" customClick={() => setModalVisible(false)}/>                            
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.ContainerWhiteBGFrame}>
            <SafeAreaView style={styles.OSITextContainer}>
                <View style={styles.Frame2893081}>
                    <CheckBox
                        value={toggleCheckSketch}
                        onValueChange={setToggleCheckSketch}
                        tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                    />
                    <Text style={[styles.LabelNormal, {alignItems:'center'}]}>Check if N/A </Text>
                </View>
                {sketchImages.length === 0 ? (
                    <View style={styles.SketchComponent}>
                        <TouchableOpacity style={styles.SketchDashedFrame} onPress={() => setModalVisible(true)}>
                            <Image
                                source={require('../../assets/icon/pen.png')}
                                style={{ width: 20, height: 20 }}
                            />
                            <Text style={styles.LabelNormal}>Tap to add New Sketch</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.SketchListFrame}>
                        <FlatList
                            data={[{ isTakePhotoButton: true }, ...sketchImages]}
                            renderItem={({ item, index }) => 
                                item.isTakePhotoButton ? (
                                    <View style={styles.PhotoItem}>
                                        <TouchableOpacity style={styles.TakePhotoFrame} onPress={() => setModalVisible(true)}>
                                            <Image source={require('../../assets/icon/pen.png')} style={{ width: 20, height: 20 }} />
                                            <Text style={styles.LabelNormal}>Tap to add New Sketch</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : renderItem({ item, index: index - 1 })
                            }
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.PhotoList}
                        />
                    </View>
                )}
                {renderCreateModal()}
                <View style={styles.ComponentFrame}>
                    <View style={styles.MarginContainerXSmall} />
                    <WhiteButton title="Save as Draft" customClick={handleSave} />                            
                    <View style={styles.MarginContainerXSmall} />
                    <BlueButton title="SUBMIT" customClick={handleSubmit}/>
                    <View style={styles.MarginContainerXSmall} />
                    <BackToHomeButton/>
                </View>
                <LoadingModal visible={loading} />
            </SafeAreaView>
        </View>
    );
};

export default SketchPlan;