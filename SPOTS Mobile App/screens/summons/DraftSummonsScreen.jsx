import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, Alert, FlatList } from 'react-native';
import styles from '../../components/spots-styles';
import CheckBox from '@react-native-community/checkbox';
import BlueButton from '../../components/common/BlueButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import HeaderBanner from '../../components/common/HeaderBanner';
import Summons from '../../models/Summons';
import Offenders from '../../models/Offenders';
import dbService from '../../utils/DatabaseService';
import { formatLocationCode } from '../../utils/Formatter';
import { SummonsContext } from '../../context/summonsContext';
import { OfficerContext } from '../../context/officerContext';
import { submitSummonsReport } from '../../utils/SubmitHelper';
import LoadingModal from '../../containers/common/Loading';

const DraftSummons = ({ navigation }) => {
    const { officer } = useContext(OfficerContext);
    const { updateSummons, resetSummons } = useContext(SummonsContext);

    const [draftSummons, setDraftSummons] = useState([]);
    const [originalDrafts, setOriginalDrafts] = useState([]);
    const [draftSummonsCount, setDraftSummonsCount] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDraftSummons();
        fetchDraftCount();
    }, []);

    const fetchDraftSummons = async () => {
        try {
            const drafts = await Summons.getDraftSummons(dbService.db);
            console.log("retrieved summons drafts >> ", drafts);
        
            setOriginalDrafts(drafts);

            const draftsWithFormattedLocations = await Promise.all(drafts.map(async draft => {

                const formattedLocation = await formatLocationCode(draft.INCIDENT_OCCURED, draft.LOCATION_CODE, draft.LOCATION_CODE_2);
                
                // Fetch offenders count for the draft
                const offendersCount = await Offenders.getOffendersCountBySummonsID(dbService.db, draft.ID);

                const offendersList = await Offenders.getOffendersListBySummonsID(dbService.db, draft.ID);
                // const regNoList = offendersList.map(offender => offender.registrationNo).filter(registrationNo => registrationNo !== null);
                // const nameList = offendersList.filter(offender => offender.offenderType === 1).map(offender => offender.name);
    
                // Get unique registrationNo list
                const regNoList = [...new Set(offendersList.map(offender => offender.registrationNo).filter(registrationNo => registrationNo !== null))];

                // Get unique name list for offenders with offenderType === 1
                const nameList = [...new Set(offendersList.filter(offender => offender.offenderType === 1).map(offender => offender.name))];

                //const offendersCount = regNoList?.length + nameList?.length;

                return { ...draft, formattedLocation, offendersCount, regNoList, nameList };
            }));
            setDraftSummons(draftsWithFormattedLocations);

        } catch (error) {
            console.error("Failed to fetch draft summons:", error);
        }
    };

    const fetchDraftCount = async () => {
        try {
            const count = await Summons.getDraftCountSummons(dbService.db);
            setDraftSummonsCount(count);
        } catch (error) {
            console.error("Failed to fetch draft summons count:", error);
        }
    };

    const handleEdit = (summons) => {
        console.log(`handleEdit summons with ID: ${summons.ID}`);

        const originalSummons = originalDrafts.find(s => s.ID === summons.ID);
        console.log(`originalSummons`, originalSummons);
        if (originalSummons) {
            console.log(`edit summons with ID: ${originalSummons.ID}`);
            updateSummons(originalSummons);
            if (summons.TYPE == 'M401'){
                console.log(`is summons`);
                navigation.navigate('SummonsMainScreen');
            } else {
                console.log(`is echo`);
                navigation.navigate('SummonsEchoMainScreen');
            }
        } else {
            console.error(`Original summons with ID ${summons.ID} not found`);
        }
    };

    const handleDelete = (summonsId) => {
        console.log(`Delete summons with ID: ${summonsId}`);

        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this summons?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            await Summons.deleteSummons(dbService.db, summonsId);
                            setDraftSummons(prevDrafts => prevDrafts.filter(summons => summons.ID !== summonsId));
                            setOriginalDrafts(prevDrafts => prevDrafts.filter(summons => summons.ID !== summonsId));
                        } catch (error) {
                            console.error("Failed to delete summons:", error);
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
            setSelectedItems(draftSummons.map(item => item.ID));
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
                const success = await submitSummonsReport(id);
                if (success) {
                    resetSummons();
                    console.log(`successfully submitted ${id}`);
                }
            }

            fetchDraftSummons();
            fetchDraftCount();
            
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
            <View style={[{ width: "19%" }, { justifyContent: "center", alignItems:"center" }]}>
                <Text style={styles.LabelNormal}>{item.SPOTS_ID}</Text>
            </View>
            <View style={[{ width: "8%" }, { justifyContent: "center", alignItems:"center" }]}>
                <Text style={styles.LabelNormal}>{item.TYPE}</Text>
            </View>
            <View style={[{ width: "25%" }, { justifyContent: "center", alignItems:"center" }]}>
                <Text style={styles.LabelNormal}>{item.formattedLocation}</Text>
            </View>
            <View style={[{ width: "20%" }, { justifyContent: "center", alignItems:"center" }]}>
                {item.nameList && item.nameList.length > 0 && (
                    <>
                        <Text style={styles.LabelNormalBold}>Person Name: </Text>
                        {item.nameList.map((name, index) => (
                            <Text key={index} style={styles.LabelNormal}>{name}</Text>
                        ))}
                    </>
                )}
                {item.regNoList && item.regNoList.length > 0 && (
                    <>
                        <Text style={styles.LabelNormalBold}>Vehicle No: </Text>
                        {item.regNoList.map((regNo, index) => (
                            <Text key={index} style={styles.LabelNormal}>{regNo}</Text>
                        ))}
                    </>
                )}
            </View>
            <View style={[{ width: "7%" }, { justifyContent: "center", alignItems:"center" }]}>
                <Text style={styles.LabelNormal}>{item.offendersCount}</Text>
            </View>
            <View style={[{ width: "16%" }, { flexDirection: "row", justifyContent: "center", alignContent: 'center'}]}>
                <TouchableOpacity onPress={() => handleDelete(item.ID)}>
                    <Image
                        style={{ width: 17, height: 20, justifyContent: "center", alignSelf: 'center', marginRight: "37%" }}
                        source={require('../../assets/icon/delete-red.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Image
                        style={{ width: 19, height: 20, justifyContent: "center", alignSelf: 'center' }}
                        source={require('../../assets/icon/edit.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View>
            <HeaderBanner title="Draft Summons" officerName={officer.OFFICER_NAME} navigation={navigation} />
            <View style={styles.ContainerGrey}>
                <View style={styles.ContainerWhite}>
                    <SafeAreaView style={styles.SummonsTextContainer}>
                        <Text style={styles.LabelMediumBold}>Total Record: {draftSummonsCount}</Text>
                        <View style={styles.MarginContainerXSmall} />
                        <View style={draftStyles.container}>
                            <FlatList
                                data={draftSummons}
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
                                        <View style={[{ width: "19%" }, { justifyContent: "center", alignItems:"center" },]}>
                                            <Text style={styles.LabelSmall}>SPOTS ID</Text>
                                        </View>
                                        <View style={[{ width: "8%" }, { justifyContent: "center", alignItems:"center" },]}>
                                            <Text style={styles.LabelSmall}>Type</Text>
                                        </View>
                                        <View style={[{ width: "25%" }, { justifyContent: "center", alignItems:"center" },]}>
                                            <Text style={styles.LabelSmall}>Location</Text>
                                        </View>
                                        <View style={[{ width: "20%" }, { justifyContent: "center", alignItems:"center" },]}>
                                            <Text style={styles.LabelSmall}>Offenders</Text>
                                        </View>
                                        <View style={[{ width: "7%" }, { justifyContent: "center", alignItems:"center" },]}>
                                            <Text style={styles.LabelSmall}>Count</Text>
                                        </View>
                                        <View style={[{ width: "17%" }, { justifyContent: "center", alignItems:"center" },]}>
                                            <Text style={styles.LabelSmall}>Action</Text>
                                        </View>
                                    </View>
                                }
                            />
                        </View>
                        <BlueButton title="SUBMIT" customClick={() => submit()} disabled={selectedItems.length === 0}/>
                        <View style={styles.MarginContainerSmall} />
                        <BackToHomeButton />
                        <LoadingModal visible={loading} />
                    </SafeAreaView>
                </View>
            </View>
        </View>
    );
};

const draftStyles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 18,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'rgba(212, 212, 212, 0.8)'
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 13,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        height: '70%'
    }
});

export default DraftSummons;

