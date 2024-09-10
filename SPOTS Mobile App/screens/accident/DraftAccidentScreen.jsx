import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Alert, FlatList, RefreshControl } from 'react-native';
import styles from '../../components/spots-styles';
import CheckBox from '@react-native-community/checkbox';
import BlueButton from '../../components/common/BlueButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import HeaderBanner from '../../components/common/HeaderBanner';
import dbService from '../../utils/DatabaseService';
import AccidentReport from '../../models/AccidentReport';
import { parseStringToDateTime, formatLocationCode } from '../../utils/Formatter'; 
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';
import { submitOSI } from '../../utils/SubmitHelper';
import LoadingModal from '../../containers/common/Loading';

const DraftAccidentScreen = ({ navigation }) => {
    const { officer } = useContext(OfficerContext);
    const { updateAccidentReport } = useContext(AccidentReportContext);
    
    const [draftAccidents, setDraftAccidents] = useState([]);
    const [originalDrafts, setOriginalDrafts] = useState([]);
    const [draftCount, setDraftCount] = useState(0);

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDraftAccidents();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchDraftAccidents();
        fetchDraftCount();
    }, []);

    const fetchDraftAccidents = async () => {
        try {
            const drafts = await AccidentReport.getDraftAccidents(dbService.db);
            setOriginalDrafts(drafts);
            const draftsWithFormattedLocations = await Promise.all(drafts.map(async draft => {
                const formattedLocation = await formatLocationCode(draft.INCIDENT_OCCURED, draft.LOCATION_CODE, draft.LOCATION_CODE_2);
                const formattedDate = parseStringToDateTime(draft.CREATED_AT);
                return { ...draft, formattedLocation, formattedDate };
            }));
            setDraftAccidents(draftsWithFormattedLocations);
        } catch (error) {
            console.error("Failed to fetch draft accidents:", error);
        }
    };

    const fetchDraftCount = async () => {
        try {
            const count = await AccidentReport.getDraftCountAccidents(dbService.db);
            setDraftCount(count);
        } catch (error) {
            console.error("Failed to fetch draft count:", error);
        }
    };

    const handleEdit = (accidentId) => {
        console.log(`handleEdit accident with ID: ${accidentId}`);

        const originalAccident = originalDrafts.find(accident => accident.ID === accidentId);
        if (originalAccident) {
            console.log(`edit accident with ID: ${originalAccident.ID}`);
            updateAccidentReport(originalAccident);
            navigation.navigate('AccidentMainScreen');
        } else {
            console.error(`Original accident with ID ${accidentId} not found`);
        }
    };

    const handleDelete = (accidentId) => {
        console.log(`Delete accident with ID: ${accidentId}`);

        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this accident report?",
            [
                {
                    text: "Cancel", style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            await AccidentReport.deleteAccident(dbService.db, accidentId);
                            setDraftAccidents(prevDrafts => prevDrafts.filter(accident => accident.ID !== accidentId));
                            setOriginalDrafts(prevDrafts => prevDrafts.filter(accident => accident.ID !== accidentId));
                        } catch (error) {
                            console.error("Failed to delete accident:", error);
                        }
                    }
                }
            ]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(draftAccidents.map(item => item.ID));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const submit = async () => {

        console.log('submit in draft', selectedItems);
        setLoading(true);

        try {
            for (const id of selectedItems) {
                const success = await submitOSI(id, officer.OFFICER_ID);
                console.log('submitOSI success?', success);
                if (success) {
                    console.log(`successfully submitted ${id}`);
                }
            }
            fetchDraftAccidents();
            fetchDraftCount();
    
            //console.log('All selected items have been submitted');
        } catch (error) {
            setLoading(false);
            console.error('Error during submission:', error);
        } finally {
            setLoading(false);
        }

    };

    const renderItem = ({ item }) => (
        <View style={draftStyles.row}>
            <CheckBox
                style={{ width: "5%" }}
                tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                value={selectedItems.includes(item.ID)}
                onValueChange={() => handleSelectItem(item.ID)}
            />
            <View style={[{width:"21%"}, {justifyContent: "flex-start"}, {marginLeft:10}]}>
                <Text style={styles.LabelNormal}>{item.INCIDENT_NO}</Text>
            </View>
            <View style={[{width:"35%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.formattedLocation}</Text>
            </View>
            <View style={[{width:"20%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.formattedDate}</Text>
            </View>
            
            <View style={[{width:"25%", flexDirection: "row"}]}>
                <TouchableOpacity onPress={() => handleDelete(item.ID)}>
                    <Image 
                        style={{ width: 17, height: 20, alignSelf: 'center', marginRight: "32%" }}  
                        source={require('../../assets/icon/delete-red.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEdit(item.ID)}>
                    <Image 
                    style={{ width: 19, height: 20, alignSelf: 'center' }}  
                    source={require('../../assets/icon/edit.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );    

    return (
        <View>
            <HeaderBanner title="Draft On-Scene Investigation Report" officerName={officer.OFFICER_NAME} navigation={navigation} />
            <View style={styles.ContainerGrey}>
                <View style={styles.ContainerWhite}>
                    <SafeAreaView style={draftStyles.TextContainer}>
                        <Text style={styles.LabelMediumBold}>Total Report: {draftCount}</Text>
                        <View style={styles.MarginContainerXSmall} />
                        <View style={draftStyles.container}>
                            <FlatList
                                data={draftAccidents}
                                renderItem={renderItem}
                                keyExtractor={item => item.ID.toString()}
                                ListHeaderComponent={
                                    <View style={draftStyles.header}>
                                        <CheckBox
                                            style={{ width: "5%" }}
                                            tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                                            value={selectAll}
                                            onValueChange={handleSelectAll}
                                        />
                                        <View style={[{ width: "21%" }, { justifyContent: "center" }, { marginLeft: 10 }]}>
                                            <Text style={styles.LabelSmall}>Incident No.</Text>
                                        </View>
                                        <View style={[{ width: "35%" }, { justifyContent: "center" }]}>
                                            <Text style={styles.LabelSmall}>Location</Text>
                                        </View>
                                        <View style={[{ width: "20%" }, { justifyContent: "center" }]}>
                                            <Text style={styles.LabelSmall}>Date/Time</Text>
                                        </View>
                                        <View style={[{ width: "25%" }, { justifyContent: "center", paddingLeft: 25 }]}>
                                            <Text style={styles.LabelSmall}>Actions</Text>
                                        </View>
                                    </View>
                                }
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            />
                        </View>
                        <View style={styles.MarginContainer} />
                        <BlueButton title="SUBMIT" customClick={() => submit()} disabled={selectedItems.length === 0}/>
                        <View style={styles.MarginContainerSmall} />
                        <BackToHomeButton/>
                        <LoadingModal visible={loading} />
                    </SafeAreaView>
                </View>
            </View>
        </View>
    );
};

const draftStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'rgba(212, 212, 212, 0.8)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    TextContainer: {
        flex: 1,
        height: '100%',
        width: '87%',
        marginTop: '5%',
    },
    container: {
        width: '100%',
        height: '55%'
    }
    
});

export default DraftAccidentScreen;