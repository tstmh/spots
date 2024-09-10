import React, {useEffect, useState} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Image, FlatList } from 'react-native';
import spotsStyles from '../../components/spots-styles';
import TIMSOffenceCode from '../../models/TIMSOffenceCode';
import BlueButtonShort from '../../components/common/BlueButtonShort';
import WhiteButtonShort from '../../components/common/WhiteButtonShort';

const SearchOffenceModal = ({ visible, onClose, onSelect, isVehicle, record }) => {

    const [searchInput, setSearchInput] = useState('');
    const [selectedRecord, setSelectedRecord] = useState('');

    const [offenceList, setOffenceList] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState(offenceList);
    
    const handlePress = (item) => { 
        setSelectedRecord(item);
    };

    useEffect(() => {
        if (isVehicle){
            setOffenceList(TIMSOffenceCode.timsOffenceCode);
        } else {
            setOffenceList(TIMSOffenceCode.timsOffenceCodePedestrianCyclist);
        }
    }, []);

    useEffect(() => {
        setFilteredRecords(offenceList);
    }, [offenceList]);

    useEffect(() => {
        console.log('SearchOffenceModal >> record', record);
        setSelectedRecord(record)
    }, [record]);

    useEffect(() => {
        const newFilteredRecords = offenceList.filter(record =>
            record.caption.toUpperCase().includes(searchInput.toUpperCase())
        );
        setFilteredRecords(newFilteredRecords);
    }, [searchInput]);

    const OffenceItem = ({ item, onPress, isSelected }) => (
        <TouchableOpacity
            style={[styles.itemContainer, isSelected ? styles.selectedItem : null]}
            onPress={() => onPress(item)}
        >
            <View style={styles.descContainer}>
                <Text style={styles.itemText}>{item.caption}</Text>
            </View>
            <View style={styles.fineAmountContainer}>
                <Text style={styles.itemText}> ${item.fine_amount}</Text>
            </View>
        </TouchableOpacity>
    );
    
    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.centerFrameRow}>
                            <Text style={styles.labelBig}>Offence Quick Search</Text>
                        </View>
                        <View style={[spotsStyles.FrameRow, {marginTop: 10}]}>
                            <View style={spotsStyles.FullFrame}>
                                <Text>
                                    <Text style={styles.label}>Offence Description: </Text>
                                    <Text style={spotsStyles.LabelImpt}> (*) </Text>
                                </Text>
                                <View style={spotsStyles.RoundedDateInput}>
                                    <TextInput
                                        style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12 }}
                                        placeholder="Search Offence"
                                        value={searchInput}
                                        onChangeText={setSearchInput}
                                    />
                                    <TouchableOpacity>
                                        <Image
                                            source={require('../../assets/icon/search.png')}
                                            style={{ width: 28, height: 28 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        
                        <View style={styles.frameColumn}>
                            <View style={styles.headerContainer}>
                                
                                <View style={styles.descContainer}>
                                    <Text style={styles.label}>Description</Text>
                                </View>
                                <View style={styles.fineAmountContainer}>
                                    <Text style={styles.label}>Fine Amount</Text>
                                </View>
                            </View>
                            <FlatList
                                style={{height: '75%'}}
                                data={filteredRecords}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <OffenceItem
                                        item={item}
                                        onPress={handlePress}
                                        isSelected={selectedRecord?.code === item.code} 
                                    />
                                )}
                            />

                        </View>
                        
                        <View style={styles.frameRow}>
                            <View style={styles.closeButton}>
                                <BlueButtonShort title="OK" customClick={() => { onSelect(selectedRecord); onClose(); }}
                                    disabled={!selectedRecord}/>
                            </View>
                            <View style={styles.closeButton}>
                                <WhiteButtonShort title="Cancel" customClick={onClose}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centerFrameRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginRight: 20,
        boxSizing: "border-box",
    },
    frameRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginLeft: 40, 
        boxSizing: "border-box",
    },
    frameColumn: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        marginTop: 10,
        marginRight: 20,
        boxSizing: "border-box",
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    descContainer: {
        width: '80%'
    },
    fineAmountContainer: {
        width: '20%',
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontSize: 15,
        color: "rgba(0,22,62,1)",
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 14,
    },
    textInputContainer: {
        marginBottom: 10,
        width: "100%",
        padding: 8
    },
    thirdFrameContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "centre",
        alignItems: "centre",
        width: "34%",
        height: "100%",
        padding: 10,
        boxSizing: "border-box",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'start',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '100%',
        width: '85%'
    },
    closeButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        margin: 15,
        width: '30%',
        height: '30%',
    },
    buttonText: {
        fontSize: 15,
        color: "rgba(0,22,62,1)",
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    selectedItem: {
        backgroundColor: '#d3d3d3',
    },
    label: {
        color: "rgba(0,22,62,1)",
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "ZenKakuGothicAntique-Bold",
    },
    labelBig: {
        color: "rgba(0,22,62,1)",
        fontSize: 18,
        lineHeight: 20,
        fontFamily: "ZenKakuGothicAntique-Black",
        fontWeight: "700"
    },
});

export default SearchOffenceModal;
