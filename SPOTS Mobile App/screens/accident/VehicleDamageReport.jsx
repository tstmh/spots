import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Modal, Dimensions, StyleSheet, TextInput, Pressable, FlatList, Alert, ToastAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import styles from '../../components/spots-styles';
import SystemCode from '../../models/SystemCode';
import BlueButton from '../../components/common/BlueButton';
import WhiteButton from '../../components/common/WhiteButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import Carousel from 'react-native-reanimated-carousel';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TIMSVehicleMake from '../../models/TIMSVehicleMake';
import TIMSVehicleColor from '../../models/TIMSVehicleColor';
import TIMSLocationCode from '../../models/TIMSLocationCode';
import { VehicleImages, VehicleViews } from '../../utils/VDRVehicles';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';
import SketchVehicle from '../../containers/accident/SketchVehicle';
import SketchButton from '../../components/common/SketchButton';
import BlueButtonShort from '../../components/common/BlueButtonShort';
import { formatDateTimeToString, formatIntegerValue, formatDateTimeToLocaleString, formatIntegerValueNotNull, parseStringToDateTimeObject } from '../../utils/Formatter';
import { Skia } from '@shopify/react-native-skia';
import Images from '../../models/Images';
import DatabaseService from '../../utils/DatabaseService';
import RNFS from 'react-native-fs';
import { legends } from '../../containers/common/Legends';
import LoadingModal from '../../containers/common/Loading';
import { submitOSI } from '../../utils/SubmitHelper';

const Tab = createMaterialTopTabNavigator();

const { width: screenWidth } = Dimensions.get('window');

const VehicleDamageReport = ({ navigation }) => {

    const imageType = 'vehReport';
    const { accidentReport, resetAccidentReport } = useContext(AccidentReportContext);
    const { officer } = useContext(OfficerContext);
    const [loading, setLoading] = useState(false);

    const [ vdrImages, setVdrImages ] = useState([]);
    const [currentVdrImage, setCurrentVdrImage] = useState({
        ID: null,
        ACCIDENT_REPORT_ID : null,
        OFFICER_ID: null,
        IMAGE_TYPE: null,
        CAPTION: null,
        IMAGE64: null,
        CREATED_AT: null,
        TYPE_CODE: null,
        REGISTRATION_NO: null,
        MAKE_CODE: null,
        COLOR: null,
        COLOR_CODE: null,
        PLATE_DISPLAYED: null,
        ACCIDENT_DATE: null,
        EXAMINATION_DATE: null,
        INCIDENT_OCCURED: null,
        LOCATION_CODE: null,
        LOCATION_CODE_2: null,
        FILE_PATH: null,
        RAW_METADATA: null,
        FRONT_METADATA: null,
        LEFT_METADATA: null,
        RIGHT_METADATA: null,
        REAR_METADATA: null,
        TOP_METADATA: null,
        BOX_METADATA: null
    });

    useEffect(() => {
        console.log("currentIndex >> ", currentIndex);
    }, [currentIndex]);

    const [expandedSection, setExpandedSection] = useState(true);
    const toggleSection = () => {
        setExpandedSection(expandedSection? false : true);
    };

    const [isLegendsExpanded, setIsLegendsExpanded] = useState(false);

    const [showComponent, setShowComponent] = useState(false);
    const [toggleCheckSketch, setToggleCheckSketch] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSnapToItem = useCallback((index) => {
        setCurrentIndex(index); // Update state to re-render pagination dots
    }, []);

    const canvasRefs = useRef([]);
    const [snapshots, setSnapshots] = useState([]);
    const navigationState = useNavigationState(state => state);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    //fetch sketches from sqlite
    useEffect(() => {
        const fetchVdrs = async () => {
            console.log("fetchVdrs");
            try {
                const accidentReportId = accidentReport.ID;
                const data = await Images.getImagesByAccIDImgType(DatabaseService.db, accidentReportId, imageType);
                console.log("retrieved sketches data length >> " , data.length);

                data.forEach(d => {
                    console.log('data' , d);
                });

                if (data && data.length > 0){

                    const vdrsWithUri = data.map(vdr => ({
                        ...vdr,
                        uri: `data:image/png;base64,${vdr.IMAGE64}`,
                        CAPTION: vdr.CAPTION || '',
                        ID: vdr.ID || '',
                        ACCIDENT_DATE: vdr.ACCIDENT_DATE ? new Date (parseStringToDateTimeObject(vdr.ACCIDENT_DATE)) : '',
                        EXAMINATION_DATE: vdr.EXAMINATION_DATE ? new Date (parseStringToDateTimeObject(vdr.EXAMINATION_DATE)) : '',
                        INCIDENT_OCCURED: vdr.INCIDENT_OCCURED? vdr.INCIDENT_OCCURED.toString() : '',
                        PLATE_DISPLAYED: vdr.PLATE_DISPLAYED? vdr.PLATE_DISPLAYED.toString() : '',
                    }));

                    //console.log("converted sketch >> " , sketchesWithUri);
                    setVdrImages(vdrsWithUri);
                    // console.log("vdr images >> " , vdrImages);
                }
            } catch (error) {
                console.error("Error fetching sketch:", error);
            }
        };
        fetchVdrs();
    }, []);

    useEffect(() => {
        setVehicleTypeList(SystemCode.vehicleType);
        setIncidentOccuredList(SystemCode.incidentOccured);
        setPlateDisplayedList(SystemCode.yesNoUnknown);
        setRoad1List(TIMSLocationCode.timsLocationCode);
        setRoad2List(TIMSLocationCode.timsLocationCode);
        setVehicleMakeList(TIMSVehicleMake.timsVehicleMake);
        setVehicleColorList(TIMSVehicleColor.timsVehicleColor);

        assetToBase64(require('../../assets/legends/Legend_Table.png'), "Legend_Table");
    }, []);
    
    const [selectedVehicleType, setSelectedVehicleType] = useState('');

    const [vehicleTypeList, setVehicleTypeList] = useState([]);
    const [incidentOccuredList, setIncidentOccuredList] = useState([]);
    const [road1List, setRoad1List] = useState([]);
    const [road2List, setRoad2List] = useState([]);
    const [vehicleMakeList, setVehicleMakeList] = useState([]);
    const [vehicleColorList, setVehicleColorList] = useState([]);
    const [plateDisplayedList, setPlateDisplayedList] = useState([]);
    const [openAccidentDate, setOpenAccidentDate] = useState(false);
    const handleOpenAccidentDate = () => { setOpenAccidentDate(true); };
    const [openExaminationDate, setOpenExaminationDate] = useState(false);
    const handleOpenExaminationDate = () => { setOpenExaminationDate(true); };

    const [legendBase64, setLegendBase64] = useState(null);

    const uriToBase64 = async (uri) => {
        // console.log('uriToBase64 ' , uri);
        try {
            const base64 = await RNFS.readFile(uri, 'base64'); 
            // console.log(base64);
            return base64;
        } catch (error) {
            console.error('Error converting URI to Base64:', error);
            return null;
        }
    };

    const assetToBase64 = async (asset, fileName) => {
        try {
            const assetSource = Image.resolveAssetSource(asset);
            console.log('assetSource', assetSource);
            const uri = assetSource.uri;
            console.log('uri', uri);
        
            if (uri.startsWith('http')) {
                // DEV mode with METRO, Handle HTTP URL
                console.log('DEV mode with METRO, Handling HTTP URL');
                const response = await fetch(uri);
                const blob = await response.blob();
                const reader = new FileReader();
        
                reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];
                const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}.png`;
                await RNFS.writeFile(localPath, base64data, 'base64');
                const base64String = await RNFS.readFile(localPath, 'base64');
                setLegendBase64(base64String);
                };
        
                reader.readAsDataURL(blob);
            } else {
                // PROD mode, Handle local file path inside APK
                console.log('PROD/UAT mode, Handling asset URL');

                //const base64String = await RNFS.readFileAssets(uri, 'base64');
                const base64String = await RNFS.readFileAssets('legends/Legend_Table.png', 'base64');
                setLegendBase64(base64String);
            }
        } catch (error) {
            console.error('Error converting asset to Base64:', error);
            return null;
        }
    };

    const validateForm = () => {
        console.log('in validateForm!');

        if (!currentVdrImage.INCIDENT_OCCURED) {
            Alert.alert('Validation Error', 'Please select incident Occurred.');
            return false;
        };

        if (!currentVdrImage.LOCATION_CODE) {
            Alert.alert('Validation Error', 'Please select Road 1');
            return false;
        };
        
        if (currentVdrImage.INCIDENT_OCCURED !== '1' && !currentVdrImage.LOCATION_CODE_2) {
            Alert.alert('Validation Error', 'Please select Road 2');
            return false;
        };
        
        if (!currentVdrImage.REGISTRATION_NO) {
            Alert.alert('Validation Error', `Please enter Vehicle No.`);
            return false;
        };

        //TODO check registration_no

        return true;
    }

    const handleSave = async () => {
        
        if (!validateForm()){
            return;
        }

        setLoading(true); // Set loading state to true
        
        const snapshots = await saveAllSnapshots();
    
        if (snapshots === null) {
            console.log("saveAllSnapshots returned null. Stopping execution.");
            setLoading(false);
            return; 
        }

        const { frontMetaData, leftMetaData, rightMetaData, topMetaData, rearMetaData, boxMetaData} = snapshots;

        //console.log('vdrImages', vdrImages);
        console.log('frontMetaData', frontMetaData);
        console.log('leftMetaData', leftMetaData);
        console.log('rightMetaData', rightMetaData);
        console.log('topMetaData', topMetaData);
        console.log('rearMetaData', rearMetaData);
        console.log('boxMetaData', boxMetaData);
        
        setVdrImages((prev) => {
            const index = prev.findIndex((item) => item.ID === currentVdrImage.ID);

            const updatedCurrentVdr = {
                ...currentVdrImage,
                FRONT_METADATA : frontMetaData,
                LEFT_METADATA : leftMetaData,
                RIGHT_METADATA : rightMetaData,
                TOP_METADATA : topMetaData,
                REAR_METADATA : rearMetaData,
                BOX_METADATA : boxMetaData,
            }
            
            if (index !== -1) {
                // Update existing 
                return prev.map((item) =>
                    item.ID === currentVdrImage.ID ? updatedCurrentVdr : item
                );
            } else {
                // Add new
                return [...prev, updatedCurrentVdr];
            }
        });

        //update metadata in currentVdr
        setCurrentVdrImage(prevState => ({
            ...prevState,
            FRONT_METADATA: frontMetaData,
            LEFT_METADATA: leftMetaData,
            RIGHT_METADATA: rightMetaData,
            TOP_METADATA: topMetaData,
            REAR_METADATA: rearMetaData,
            BOX_METADATA: boxMetaData
        }));

        // update in database
        const updatedVdr = {
            ...currentVdrImage,
            COLOR : (currentVdrImage.COLOR_CODE == 99 || currentVdrImage.COLOR_CODE == '99') ? currentVdrImage.COLOR : null,
            INCIDENT_OCCURED : formatIntegerValue(currentVdrImage.INCIDENT_OCCURED),
            PLATE_DISPLAYED : formatIntegerValue(currentVdrImage.PLATE_DISPLAYED),
            ACCIDENT_DATE : formatDateTimeToString(currentVdrImage.ACCIDENT_DATE),
            EXAMINATION_DATE : formatDateTimeToString(currentVdrImage.EXAMINATION_DATE),
            FRONT_METADATA : frontMetaData,
            LEFT_METADATA : leftMetaData,
            RIGHT_METADATA : rightMetaData,
            TOP_METADATA : topMetaData,
            REAR_METADATA : rearMetaData,
            BOX_METADATA : boxMetaData
        }

        await Images.insertVdrWithImage(DatabaseService.db, updatedVdr);

        setLoading(false); 

        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
    };

    const captureAllSnapshots = async () => {
        console.log(`captureAllSnapshots`, canvasRefs.current);
        const allSnapshots = [];
        
        for (let i = 0; i < canvasRefs.current.length; i++) {
            if (canvasRefs.current[i]){
                const sketch = await canvasRefs.current[i].captureSnapshot();
                console.log(`captureAllSnapshots sketch`, sketch);
                if (sketch) {
                    allSnapshots.push(sketch);
                } else {
                    return null;
                }
            }
        }
        
        console.log(`allSnapshots ${allSnapshots.length}`, allSnapshots);
        return allSnapshots;
    };

    useEffect(() => {
        console.log("useEffect snapshots length:", snapshots.length);
    }, [snapshots]);

    const saveAllSnapshots = async () => {

        console.log("saveAllSnapshots " , canvasRefs);
        console.log("activeTabIndex " , activeTabIndex);

        console.log(`snapshots ${snapshots.length}`, snapshots);
        console.log(`canvasRefs.length ${canvasRefs.current.length} snapshots.length ${snapshots.length}`);

        let allSnapshots = [];

        if (canvasRefs.current.length != snapshots.length){
            allSnapshots = await captureAllSnapshots();
            if (!allSnapshots) {
                return null;
            }
            setSnapshots(allSnapshots);

        } else {
            // Just capture snapshot of current tab
            console.log("canvas of active ", canvasRefs.current[activeTabIndex]);
            if (canvasRefs.current[activeTabIndex]) {
                console.log("in canvas of active ");
                const sketch = await canvasRefs.current[activeTabIndex].captureSnapshot();
                if (sketch) {
                    allSnapshots = [
                        ...snapshots.filter(s => s.view !== sketch.view),
                        sketch,
                    ];
                    setSnapshots(allSnapshots);
                }
            }
        }

        console.log(`snapshots: ${snapshots.length} allSnapshots: ${allSnapshots.length} canvasRefs:${canvasRefs.current.length}`);
        const snapshotsToProcess = allSnapshots.length > 0 ? allSnapshots : snapshots;

        const metadata = {
            frontMetaData: null,
            leftMetaData: null,
            rightMetaData: null,
            topMetaData: null,
            rearMetaData: null,
            boxMetaData: null,
            frontBase64: null,
            leftBase64: null,
            rightBase64: null,
            topBase64: null,
            rearBase64: null,
            boxBase64: null,
        };

        if (canvasRefs.current.length === snapshotsToProcess.length) {
            for (const s of snapshotsToProcess) {
                console.log(`snapshots ${s.view} uri> `, s.uri);
                console.log(`snapshots ${s.view} metadata> `, s.RAW_METADATA);
            }

            const base64Promises = snapshotsToProcess.map(async (snapshot) => {
                try {
                    const base64 = await uriToBase64(snapshot.uri);
                    const rawMetadata = snapshot.RAW_METADATA;
                    console.log(`snapshots ${snapshot.view} rawMetadata`, rawMetadata);
                    switch (snapshot.view.toUpperCase()) {
                        case 'FRONT':
                            metadata.frontMetaData = rawMetadata;
                            metadata.frontBase64 = base64;
                            break;
                        case 'LEFT':
                            metadata.leftMetaData = rawMetadata;
                            metadata.leftBase64 = base64;
                            break;
                        case 'RIGHT':
                            metadata.rightMetaData = rawMetadata;
                            metadata.rightBase64 = base64;
                            break;
                        case 'TOP':
                            metadata.topMetaData = rawMetadata;
                            metadata.topBase64 = base64;
                            break;
                        case 'REAR':
                            metadata.rearMetaData = rawMetadata;
                            metadata.rearBase64 = base64;
                            break;
                        case 'BOX':
                            metadata.boxMetaData = rawMetadata;
                            metadata.boxBase64 = base64;
                            break;
                        default:
                            break;
                    }
                } catch (error) {
                    console.error('Error converting URI to Base64:', error);
                }
            });

            await Promise.all(base64Promises);
        }

        return metadata;
    };

    const handleBack = async () => {

        if (!validateForm()){
            return;
        }

        setLoading(true); // Set loading state to true

        const snapshots = await saveAllSnapshots();
    
        if (snapshots === null) {
            console.log("saveAllSnapshots returned null. Stopping execution.");
            setLoading(false);
            return; 
        }

        const { frontMetaData, leftMetaData, rightMetaData, topMetaData, rearMetaData, boxMetaData,
            frontBase64, leftBase64, rightBase64, topBase64, rearBase64, boxBase64} = snapshots;
        
        console.log('frontMetaData', frontMetaData);
        console.log('leftMetaData', leftMetaData);
        console.log('rightMetaData', rightMetaData);
        console.log('topMetaData', topMetaData);
        console.log('rearMetaData', rearMetaData);
        console.log('boxMetaData', boxMetaData);

        console.log('legendBase64 ' , legendBase64.length);
        console.log('boxBase64 ' , boxBase64? boxBase64.length: null);
        console.log('frontBase64 ' , frontBase64? frontBase64.length: null);
        console.log('rearBase64 ' , rearBase64? rearBase64.length: null);
        console.log('leftBase64 ' , leftBase64? leftBase64.length: null);
        console.log('topBase64 ' , topBase64? topBase64.length: null);
        console.log('rightBase64 ' , rightBase64? rightBase64.length: null);
        
        //only combine image on back
        const image64 = await handleCombineImages(boxBase64, frontBase64, rearBase64, leftBase64, topBase64, rightBase64);
        //console.log('combined!! image64 ', image64);

        //set uri to display in list
        const updatedCurrentVdr = {
            ...currentVdrImage,
            IMAGE64 : image64,
            uri: `data:image/png;base64,${image64}`,
            FRONT_METADATA : frontMetaData,
            LEFT_METADATA : leftMetaData,
            RIGHT_METADATA : rightMetaData,
            TOP_METADATA : topMetaData,
            REAR_METADATA : rearMetaData,
            BOX_METADATA : boxMetaData
        }
        setVdrImages((prev) => {
            const index = prev.findIndex((item) => item.ID === currentVdrImage.ID);
            
            if (index !== -1) {
                // Update existing 
                return prev.map((item) =>
                    item.ID === currentVdrImage.ID ? updatedCurrentVdr : item
                );
            } else {
                // Add new
                return [...prev, updatedCurrentVdr];
            }
        });

        //update combined image base64 to database
        const updatedVdr = {
            ID: currentVdrImage.ID,
            ACCIDENT_REPORT_ID : currentVdrImage.ACCIDENT_REPORT_ID,
            OFFICER_ID: currentVdrImage.OFFICER_ID,
            IMAGE_TYPE: currentVdrImage.IMAGE_TYPE,
            CAPTION: currentVdrImage.CAPTION,
            CREATED_AT: currentVdrImage.CREATED_AT,
            TYPE_CODE: currentVdrImage.TYPE_CODE,
            REGISTRATION_NO: currentVdrImage.REGISTRATION_NO,
            MAKE_CODE: currentVdrImage.MAKE_CODE,
            COLOR_CODE: currentVdrImage.COLOR_CODE,
            LOCATION_CODE: currentVdrImage.LOCATION_CODE,
            LOCATION_CODE_2: currentVdrImage.LOCATION_CODE_2,
            FILE_PATH: null,
            RAW_METADATA: null,
            IMAGE64 : image64,
            COLOR : (currentVdrImage.COLOR_CODE == 99 || currentVdrImage.COLOR_CODE == '99') ? currentVdrImage.COLOR : null,
            INCIDENT_OCCURED : formatIntegerValue(currentVdrImage.INCIDENT_OCCURED),
            PLATE_DISPLAYED : formatIntegerValue(currentVdrImage.PLATE_DISPLAYED),
            ACCIDENT_DATE : formatDateTimeToString(currentVdrImage.ACCIDENT_DATE),
            EXAMINATION_DATE : formatDateTimeToString(currentVdrImage.EXAMINATION_DATE),
            FRONT_METADATA : frontMetaData,
            LEFT_METADATA : leftMetaData,
            RIGHT_METADATA : rightMetaData,
            TOP_METADATA : topMetaData,
            REAR_METADATA : rearMetaData,
            BOX_METADATA : boxMetaData
        }
        await Images.insertVdrWithImage(DatabaseService.db, updatedVdr);
        
        setLoading(false); // Set loading state to false after operation

        hideForm();
        
        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
    }

    //combining views images
    const loadImage = (base64) => {
        return Skia.Image.MakeImageFromEncoded(Skia.Data.fromBase64(base64));
    };
    
    const handleCombineImages = async (boxBase64, frontBase64, rearBase64, leftBase64, topBase64, rightBase64) => {

        console.log("---------------------- handleCombineImages ----------------------");

        console.log('legendBase64 ' , legendBase64.length);
        console.log('boxBase64 ' , boxBase64?.length);
        console.log('frontBase64 ' , frontBase64?.length);
        console.log('rearBase64 ' , rearBase64?.length);
        console.log('leftBase64 ' , leftBase64?.length);
        console.log('topBase64 ' , topBase64?.length);
        console.log('rightBase64 ' , rightBase64?.length);

        const images = [
            { base64: legendBase64, width: 150, height: 197, left: 40, top: 30 },
            { base64: boxBase64, width: 350, height: 416, left: 200, top: 5 },
            { base64: frontBase64, width: 350, height: 416, left: 560, top: 5 },
            { base64: rearBase64, width: 350, height: 416, left: 920, top: 5 },
            { base64: leftBase64, width: 350, height: 416, left: 200, top: 431 },
            { base64: topBase64, width: 350, height: 416, left: 560, top: 431 },
            { base64: rightBase64, width: 350, height: 416, left: 920, top: 431 }, 
        ];
        //console.log("images" , images);

        const availableImages = images.filter(img => img.base64);
        console.log('availableImages ' , availableImages.length);
        
        //1000 x 662, each image 350 x 416, legend 556 x 732 now 150 x 197 
        const width = 1310;
        const height = 877;

        const surface = Skia.Surface.Make(width, height);
        const canvas = surface.getCanvas();
        const paint = Skia.Paint();
    
        if (availableImages.length > 0){
            availableImages.forEach((img) => {
                const skImage = loadImage(img.base64);
                console.log('skImage', skImage.getImageInfo());
                if (skImage) {
                    canvas.drawImage(skImage, img.left, img.top, paint);
                }
            });
        
            const snapshot = surface.makeImageSnapshot();
            const base64 = snapshot.encodeToBase64();
            console.log('combinedImage base64 > ' , base64.length);

            return base64;
        }
        
    };

    const handleSaveAsDraft = async () => {
        setLoading(true);

        console.log(`handleSaveAsDraft vdrImages ${vdrImages.length} `);

        vdrImages.forEach(element => {
            Images.updateCaption(DatabaseService.db, element.ID, element.ACCIDENT_REPORT_ID, element.CAPTION);
        });
        
        setLoading(false);

        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
    };

    const handleSubmit = async () => {
        setLoading(true);

        const success = await submitOSI(accidentReport.ID, officer.OFFICER_ID);
        console.log('submitOSI success?', success);

        setLoading(false);

        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);

        if (success == true){
            resetAccidentReport();
            navigation.navigate('Dashboard');
        }
    };

    const handleSelectVehicle = () => {
        console.log(`selectedVehicleType: ${selectedVehicleType}, currentIndex: ${currentIndex}`);
        if (!selectedVehicleType || selectedVehicleType === ""){
            console.log("fail validation");
            return;
        }
        
        // Reset canvasRefs to an empty array
        canvasRefs.current = [];

        setModalVisible(false);

        console.log(`vdrImages`, vdrImages[0]);

        let incidentOccured = null;
        let road1 = null;
        let road2 = null;

        if (vdrImages && vdrImages.length > 0){
            incidentOccured = vdrImages[0].INCIDENT_OCCURED;
            road1 = vdrImages[0].LOCATION_CODE;
            road2 = vdrImages[0].LOCATION_CODE_2;
        }

        const newVdr = {
            ID: formatIntegerValueNotNull(Date.now()),
            ACCIDENT_REPORT_ID : accidentReport.ID,
            OFFICER_ID : formatIntegerValue(officer.OFFICER_ID),
            IMAGE_TYPE : imageType,
            CREATED_AT : formatDateTimeToString(new Date()),
            TYPE_CODE : selectedVehicleType,
            IMAGE64: "",


            INCIDENT_OCCURED : incidentOccured,
            LOCATION_CODE : road1,
            LOCATION_CODE_2 : road2,
            // INCIDENT_OCCURED : incidentOccured? incidentOccured : vdrImages[0].INCIDENT_OCCURED,
            // LOCATION_CODE : road1? road1 : vdrImages[0].LOCATION_CODE,
            // LOCATION_CODE_2 : road2? road2 : vdrImages[0].LOCATION_CODE_2,
        }

        Images.insertVdr(DatabaseService.db, newVdr);
        
        setVdrImages((prev) => {
            const index = prev.findIndex((item) => item.ID === newVdr.ID);
            
            if (index !== -1) {
                // Update existing 
                return prev.map((item) =>
                    item.ID === newVdr.ID ? newVdr : item
                );
            } else {
                // Add new
                return [...prev, newVdr];
            }
        });

        setCurrentVdrImage(newVdr);
        showForm();
    };
    
    const showForm = () => {
        setShowComponent(true);
    };
    
    const hideForm = () => {
        console.log('hiding form!');
        setShowComponent(false);
    };
    
    const handleCaptionChange = (text, index) => {
        const updated = [...vdrImages];
        updated[index].CAPTION = text;
        setVdrImages(updated);
    };

    const confirmDelete = (index) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this Report?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => handleDeleteVdr(index),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleDeleteVdr = (index) => {
        console.log('handleDeleteSketch ID >> ' , vdrImages[index].ID);
        Images.deleteImages(DatabaseService.db, vdrImages[index].ID);

        const updatedVdrs = vdrImages.filter((_, i) => i !== index);
        setVdrImages(updatedVdrs);
    };

    const handleEdit = (index) => {
        // Reset canvasRefs to an empty array
        canvasRefs.current = [];

        //console.log("vdr to edit" , vdrImages[index]);

        setCurrentVdrImage(vdrImages[index]);
        setSelectedVehicleType(vdrImages[index].TYPE_CODE);

        //reset snapshots 
        console.log('resetting snapshots')
        setSnapshots([]);

        console.log("current VDR FRONT_METADATA" , vdrImages[index].FRONT_METADATA);
        console.log("current VDR LEFT_METADATA" , vdrImages[index].LEFT_METADATA);
        console.log("current VDR RIGHT_METADATA" , vdrImages[index].RIGHT_METADATA);
        console.log("current VDR TOP_METADATA" , vdrImages[index].TOP_METADATA);
        console.log("current VDR REAR_METADATA" , vdrImages[index].REAR_METADATA);
        console.log("current VDR BOX_METADATA" , vdrImages[index].BOX_METADATA);

        showForm();
    };

    const handleTabChange = (index) => {
        console.log('handleTabChange ' , index);
        setActiveTabIndex(index);
    };    

    const handleTabBlur = (index) => {
        console.log('handleTabBlur ' , index);
        if (canvasRefs.current[index]) {
            canvasRefs.current[index].captureSnapshot().then((sketch) => {
                if (sketch) {
                    setSnapshots((prevSnapshots) => [
                        ...prevSnapshots.filter(s => s.view !== sketch.view), // Remove any existing entry for the same view
                        sketch,
                    ]);
                }
            });
        }
    };

    const generateTabs = (selectedVehicleType, currentIndex) => {
        console.log('Generating tabs for:', selectedVehicleType, currentIndex);

        if (!selectedVehicleType || selectedVehicleType === ""){
            return;
        };  

        const vehicleType = `${selectedVehicleType}_${currentIndex + 1}`; 
        console.log("vehicleType " , vehicleType);

        const vehicle = VehicleViews[vehicleType];
        console.log("vehicle " , vehicle);
        if (!vehicle) return null;
    
        const views = Object.keys(vehicle);
        console.log("views " , views);

        //console.log(`currentVdrImage `, currentVdrImage);

        // Function to get the metadata based on the view
        const getMetadata = (view) => {
            let metadata = null;
            switch (view.toUpperCase()) {
                case 'FRONT':
                    metadata = currentVdrImage.FRONT_METADATA;
                    break;
                case 'LEFT':
                    metadata = currentVdrImage.LEFT_METADATA;
                    break;
                case 'RIGHT':
                    metadata = currentVdrImage.RIGHT_METADATA;
                    break;
                case 'TOP':
                    metadata = currentVdrImage.TOP_METADATA;
                    break;
                case 'REAR':
                    metadata = currentVdrImage.REAR_METADATA;
                    break;
                case 'BOX':
                    metadata = currentVdrImage.BOX_METADATA;
                    break;
                default:
                    metadata = null;
                    break;
            }
            //console.log(`getMetadata for SketchVehicle ${view} return` , metadata);
            return metadata;
        }

        return views.map((view, index) => (
            <Tab.Screen
                key={view}
                name={view.charAt(0).toUpperCase() + view.slice(1)}
                options={{ unmountOnBlur: false }}
                listeners={{
                    blur: () => handleTabBlur(index),
                    focus: () => handleTabChange(index)
                }}
                children={() => (
                    <SketchVehicle
                        source={vehicle[view]}
                        view={view} 
                        id={currentVdrImage.ID}
                        rawMetadata={getMetadata(view)}
                        activeTabIndex={activeTabIndex} 
                        tabIndex={index} 
                        ref={el => canvasRefs.current[index] = el}
                        onLayout={() => {
                            // Once layout is done, trigger snapshot
                            if (canvasRefs.current[index]) {
                                canvasRefs.current[index].captureSnapshot().then((sketch) => {
                                    if (sketch) {
                                        setSnapshots((prevSnapshots) => [
                                            ...prevSnapshots.filter(s => s.view !== sketch.view),
                                            sketch,
                                        ]);
                                    }
                                });
                            }
                        }}
                    />
                )}
            />
        ));
    };
    const tabs = generateTabs(selectedVehicleType, currentIndex);

    const renderItem = ({ item, index }) => (
        <View style={styles.PhotoItem}>
            <View style={styles.VdrPhotoFrame}>
                <TouchableOpacity onPress={() => handleEdit(index)}>
                    {item.uri ? (
                        <Image source={{ uri: item.uri }} style={styles.VdrPhoto} resizeMode='contain'/>
                    ) : (
                        <View style={styles.VdrPhoto} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.DeleteIcon} onPress={() => confirmDelete(index)}>
                    <Image source={require('../../assets/icon/delete.png')} 
                        style={{ width: 16, height: 18 }} />
                </TouchableOpacity>
            </View>
            <Text style={styles.RtaLocation}>RTA Location</Text>
            <TextInput
                style={styles.VdrRoundedCaptionInputFont}
                value={item.CAPTION}
                onChangeText={text => {
                    handleCaptionChange(text, index);
                }}
            />
        </View>
    );

    const renderPagination = () => {
        if (!selectedVehicleType || !VehicleImages[selectedVehicleType]) return null;
        return (
            <View style={addVDRStyles.centeredView}>
                <View style={addVDRStyles.paginationContainer}>
                    {VehicleImages[selectedVehicleType].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                addVDRStyles.paginationDot,
                                index === currentIndex ? addVDRStyles.paginationDotActive : addVDRStyles.paginationDotInactive,
                            ]}
                        />
                    ))}
                </View>
            </View>
        );
    };

    const renderAddVdrModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.CenteredView}>
                <View style={styles.VDRModalView}>
                    <View style={styles.MarginContainerMedium} />
                    <View style={styles.SketchComponent}>
                        <Text style={styles.LabelBig}>Add New Vehicle Damage Report</Text>
                    </View>
                    <View style={styles.MarginContainerSmall} />
                    <View style={styles.ModalTextInputContainer}>
                        <Text style={styles.Label}> Vehicle Type </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            searchPlaceholder="Search..."
                            data={vehicleTypeList}
                            value={selectedVehicleType}
                            onChange={item => {
                                setSelectedVehicleType(item.value);
                                setCurrentIndex(0);  // Reset currentIndex to 0
                            }}
                        />
                        {Boolean(selectedVehicleType && VehicleImages[selectedVehicleType] && !isLegendsExpanded) && (
                            <View>
                                <View style={addVDRStyles.carouselContainer}>
                                    <Carousel
                                        width={screenWidth / 1.8}
                                        height={480}
                                        data={VehicleImages[selectedVehicleType]}
                                        renderItem={({ item }) => (
                                            <View style={addVDRStyles.itemContainer}>
                                                <Image source={item} style={addVDRStyles.vehicleImage} />
                                            </View>
                                        )}
                                        onSnapToItem={handleSnapToItem}
                                        pagingEnabled={true}
                                        useNativeDriver={true}
                                    />
                                </View>
                                {renderPagination()}
                            </View>
                        )}
                    </View>
                    <View style={styles.ButtonContainer}>
                        <BlueButton title="SELECT THIS VEHICLE" customClick={handleSelectVehicle}/>
                        <View style={styles.MarginContainerXSmall} />
                        <WhiteButton title="Cancel" customClick={() => setModalVisible(false)}/>                            
                        <View style={styles.MarginContainerSmall} />
                        <View style={styles.HorizontalVector} /> 
                        <TouchableOpacity style={[{flexDirection: 'row', alignItems: 'center'}]} onPress={() => setIsLegendsExpanded(!isLegendsExpanded)}>
                            <Text style={styles.LabelNormalBlue}> CODE </Text>
                            <View style={[styles.VerticalVector, {borderRightColor: '#D4D4D4', height: 25, marginHorizontal: 10, marginVertical: 3 }]} /> 
                            <Text style={styles.LabelNormalBlue}> At the time of my arrival, i observed </Text>
                            {isLegendsExpanded ? (
                                <Image source={require('../../assets/icon/arrow-up.png')}/>
                            ) : (
                                <Image source={require('../../assets/icon/arrow-down.png')}/>
                            )}
                        </TouchableOpacity>
                        {isLegendsExpanded && (
                            <View style={[{height: '70%', marginTop: 10}]}>
                                {legends.map(legend => (
                                    <View key={legend.id} style={addVDRStyles.legendContainer}>
                                        <Image source={legend.image} style={addVDRStyles.legendImage} />
                                        <Text style={addVDRStyles.legendText}>{legend.text}</Text>
                                        <View style={styles.HorizontalVector} />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.ContainerWhiteBGFrame}>
            <SafeAreaView style={styles.OSITextContainer}>

                {!showComponent && (
                <View>
                    <View style={styles.ComponentFrame}>
                        <View style={styles.Frame2893081}>
                            <CheckBox
                                value={toggleCheckSketch}
                                onValueChange={setToggleCheckSketch}
                                tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                            />
                            <Text style={[styles.LabelNormal]}>Check if N/A </Text>
                        </View>
                        
                        {vdrImages.length === 0 ? (
                            <View style={styles.SketchComponent}>
                                <TouchableOpacity style={styles.SketchDashedFrame} onPress={() => setModalVisible(true)}>
                                    <Image
                                        source={require('../../assets/icon/pen.png')}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <Text style={styles.LabelNormal}>Tap to add New Report</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.VdrListFrame}>
                                <FlatList
                                    data={[{ isTakePhotoButton: true }, ...vdrImages]}
                                    renderItem={({ item, index }) => 
                                        item.isTakePhotoButton ? (
                                            <View style={styles.PhotoItem}>
                                                <TouchableOpacity style={styles.VdrTakePhotoFrame} onPress={() => setModalVisible(true)}>
                                                    <Image source={require('../../assets/icon/pen.png')} style={{ width: 20, height: 20 }} />
                                                    <Text style={styles.LabelNormal}>Tap to add New Report</Text>
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

                    </View>

                    {renderAddVdrModal()}

                    <View style={styles.ComponentFrame}>
                        <View style={styles.MarginContainerXSmall} />
                        {/* TODO check if this is correct */}
                        <WhiteButton title="Save as Draft" customClick={() => handleSaveAsDraft()}/>                          
                        <View style={styles.MarginContainerXSmall} />
                        <BlueButton title="SUBMIT" customClick={() => handleSubmit()}/>
                        <View style={styles.MarginContainerXSmall} />
                        <BackToHomeButton/>
                    </View>
                </View>
                )}
                <LoadingModal visible={loading} />
                {showComponent && (
                    <View>
                        <View style={[styles.AccordionFrame, {backgroundColor: 'rgba(242,245,249,1)'}]}>
                            <View style={[styles.FrameVDR]}>
                                <TouchableOpacity 
                                    onPress={() => toggleSection()}
                                    style={{ width: "94%", height: 30, marginLeft: 10, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start' }}>                                    
                                    <Text style={styles.Label}>{expandedSection? "Collapse Form" : "Expand Form"}</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', alignSelf: 'flex-end' }}>
                                    <TouchableOpacity 
                                        onPress={() => toggleSection()}
                                        style={{ flex: 1, flexDirection: "row", alignSelf: 'flex-end' }}>
                                        {expandedSection? (
                                            <Image source={require('../../assets/icon/arrow-up.png')}/>
                                        ) : (
                                            <Image source={require('../../assets/icon/arrow-down.png')}/>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        {expandedSection && (
                        <View style={[styles.ComponentFrame, {marginBottom: 5}]}>
                            <View style={styles.FrameRow}>
                                <View style={styles.FullFrameVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Incident Occurred </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.DropdownRoundedTextInputFont}
                                        placeholderStyle={styles.Placeholder}
                                        selectedTextStyle={styles.Placeholder}
                                        itemTextStyle={styles.Placeholder}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select item"
                                        searchPlaceholder="Search..."
                                        data={incidentOccuredList}
                                        value={currentVdrImage.INCIDENT_OCCURED}
                                        onChange={item => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                INCIDENT_OCCURED: item.value
                                            }));
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.FrameRow}>
                                <View style={currentVdrImage.INCIDENT_OCCURED !== '1' ? styles.HalfFrameContainerVDR : styles.FullFrameVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Road 1 Name </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.DropdownRoundedTextInputFont}
                                        placeholderStyle={styles.Placeholder}
                                        selectedTextStyle={styles.Placeholder}
                                        itemTextStyle={styles.Placeholder}
                                        search
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select item"
                                        searchPlaceholder="Search..."
                                        data={road1List}
                                        value={currentVdrImage.LOCATION_CODE}
                                        onChange={item => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                LOCATION_CODE: item.value
                                            }));
                                        }}
                                    />
                                </View>

                                {currentVdrImage.INCIDENT_OCCURED !== '1' ? (
                                    <View style={styles.HalfFrameContainerVDR}>
                                        <Text>
                                            <Text style={styles.Label}> Road 2 Name </Text>
                                            <Text style={styles.LabelImpt}> (*)</Text>
                                        </Text>
                                        <Dropdown
                                            style={styles.DropdownRoundedTextInputFont}
                                            placeholderStyle={styles.Placeholder}
                                            selectedTextStyle={styles.Placeholder}
                                            itemTextStyle={styles.Placeholder}
                                            search
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select item"
                                            searchPlaceholder="Search..."
                                            data={road2List}
                                            value={currentVdrImage.LOCATION_CODE_2}
                                            onChange={item => {
                                                setCurrentVdrImage(prevState => ({
                                                    ...prevState,
                                                    LOCATION_CODE_2: item.value
                                                }));
                                            }}
                                        />
                                    </View>
                                ) : null}
                            </View>
                            
                            <View style={styles.FrameRow}>
                                <View style={styles.HalfFrameContainerVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Vehicle No. </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={currentVdrImage.REGISTRATION_NO}
                                        onChangeText={text => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                REGISTRATION_NO: text
                                            }));
                                        }}
                                    />
                                </View>
                                <View style={styles.HalfFrameContainerVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Vehicle Make </Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.DropdownRoundedTextInputFont}
                                        placeholderStyle={styles.Placeholder}
                                        selectedTextStyle={styles.Placeholder}
                                        itemTextStyle={styles.Placeholder}
                                        search
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select item"
                                        searchPlaceholder="Search..."
                                        data={vehicleMakeList}
                                        value={currentVdrImage.MAKE_CODE}
                                        onChange={item => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                MAKE_CODE: item.value
                                            }));
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.FrameRow}>
                                {/* <View style={styles.HalfFrameContainerVDR}> */}
                                <View style={currentVdrImage.COLOR_CODE === '99' ? styles.HalfFrameContainerVDR : styles.FullFrameVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Vehicle Color </Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.DropdownRoundedTextInputFont}
                                        placeholderStyle={styles.Placeholder}
                                        selectedTextStyle={styles.Placeholder}
                                        itemTextStyle={styles.Placeholder}
                                        search
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select item"
                                        searchPlaceholder="Search..."
                                        data={vehicleColorList}
                                        value={currentVdrImage.COLOR_CODE}
                                        onChange={item => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                COLOR_CODE: item.value
                                            }));
                                        }}
                                    />
                                </View>
                                {currentVdrImage.COLOR_CODE === '99' ? (
                                    <View style={styles.HalfFrameContainerVDR}>
                                        <Text>
                                            <Text style={styles.Label}> Vehicle Color (For Others) </Text>
                                        </Text>
                                        <TextInput
                                            style={styles.RoundedTextInputWhiteFont}
                                            maxLength={20}
                                            value={currentVdrImage.COLOR}
                                            onChangeText={text => {
                                                setCurrentVdrImage(prevState => ({
                                                    ...prevState,
                                                    COLOR: text
                                                }));
                                            }}
                                        />
                                    </View>
                                ) : null}
                            </View>
                            <View style={styles.FrameRow}>
                                <View style={styles.HalfFrameContainerVDR}>
                                    <Text>
                                        <Text style={styles.Label}> "P" Plate Displayed </Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.DropdownRoundedTextInputFont}
                                        placeholderStyle={styles.Placeholder}
                                        selectedTextStyle={styles.Placeholder}
                                        itemTextStyle={styles.Placeholder}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select item"
                                        searchPlaceholder="Search..."
                                        data={plateDisplayedList}
                                        value={currentVdrImage.PLATE_DISPLAYED}
                                        onChange={item => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                PLATE_DISPLAYED: item.value
                                            }));
                                        }}
                                    />
                                </View>
                                <View style={styles.HalfFrameContainerVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Remarks </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={currentVdrImage.CAPTION}
                                        onChangeText={text => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                CAPTION: text
                                            }));
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.FrameRow}>
                                <View style={styles.HalfFrameContainerVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Accident Date </Text>
                                    </Text>
                                    <Pressable  style={styles.RoundedDateInputWhite} onPress={handleOpenAccidentDate}>
                                        <TextInput
                                            style={styles.DateTextInputWhiteFont}
                                            editable={false}
                                            value={currentVdrImage.ACCIDENT_DATE? formatDateTimeToLocaleString(currentVdrImage.ACCIDENT_DATE): ""}
                                        />
                                        <TouchableOpacity onPress={handleOpenAccidentDate}>
                                            <Image
                                                source={require('../../assets/icon/calendar.png')}
                                                style={{ width: 28, height: 28 }}
                                            />
                                        </TouchableOpacity>
                                    </Pressable>
                                    <DatePicker
                                        modal
                                        textColor="black"
                                        open={openAccidentDate}
                                        maximumDate={new Date()} 
                                        date={currentVdrImage.ACCIDENT_DATE? new Date(currentVdrImage.ACCIDENT_DATE) : new Date()}
                                        onConfirm={(date) => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                ACCIDENT_DATE: date
                                            }));
                                            setOpenAccidentDate(false);
                                        }}
                                        onCancel={() => {
                                            setOpenAccidentDate(false);
                                        }}
                                    />
                                </View>
                                <View style={styles.HalfFrameContainerVDR}>
                                    <Text>
                                        <Text style={styles.Label}> Examination Date </Text>
                                    </Text>
                                    <Pressable  style={styles.RoundedDateInputWhite} onPress={handleOpenExaminationDate}>
                                        <TextInput
                                            style={styles.DateTextInputWhiteFont}
                                            editable={false}
                                            value={currentVdrImage.EXAMINATION_DATE? formatDateTimeToLocaleString(currentVdrImage.EXAMINATION_DATE): ""}
                                        />
                                        <TouchableOpacity onPress={handleOpenExaminationDate}>
                                            <Image
                                                source={require('../../assets/icon/calendar.png')}
                                                style={{ width: 28, height: 28 }}
                                            />
                                        </TouchableOpacity>
                                    </Pressable>
                                    <DatePicker
                                        modal
                                        textColor="black"
                                        open={openExaminationDate}
                                        date={currentVdrImage.EXAMINATION_DATE? new Date(currentVdrImage.EXAMINATION_DATE) : new Date()}
                                        onConfirm={(date) => {
                                            setCurrentVdrImage(prevState => ({
                                                ...prevState,
                                                EXAMINATION_DATE: date
                                            }));
                                            setOpenExaminationDate(false);
                                        }}
                                        onCancel={() => {
                                            setOpenExaminationDate(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        )}
                        </View>
                        <View style={[{width: "100%"}, {height: 920}]}>
                            <NavigationContainer independent={true}>
                                <Tab.Navigator
                                    screenOptions={{ 
                                        labelStyle: { fontSize: 10 },
                                        swipeEnabled: false,
                                        //lazy: true
                                    }}
                                >
                                    {tabs}
                                </Tab.Navigator>
                            </NavigationContainer>
                        </View>
                        <View style={addVDRStyles.ButtonFrame}>
                            <View style={{width:"23%", marginRight: "2%"}}>
                                <BlueButtonShort title="BACK TO LIST" customClick={handleBack} />
                            </View>
                            <View style={{width:"23%"}}>
                                <SketchButton title="Save as Draft" customClick={handleSave}/>
                            </View>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
};

const addVDRStyles = StyleSheet.create({
    LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    ButtonFrame: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
        padding: 5
    },
    carouselContainer: {
        width: screenWidth,
        height: 430,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    vehicleImage: {
        width: 420,
        height: 450,
        resizeMode: 'contain',
    },
    paginationContainer: {
        flexDirection: 'row',
        marginVertical: 15,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    paginationDotActive: {
        backgroundColor: 'blue',
    },
    paginationDotInactive: {
        backgroundColor: 'gray',
    },
    legendContainer: { flexDirection: 'row', alignItems: 'center' },
    legendText: { marginLeft: 10, fontSize: 13, color: 'black' },
    legendImage: { width: 35, height: 35 }
});

export default VehicleDamageReport;
