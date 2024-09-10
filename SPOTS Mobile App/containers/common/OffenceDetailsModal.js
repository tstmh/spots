import React, {useState, useEffect} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable, Image, Alert } from 'react-native';
import spotsStyles from '../../components/spots-styles';
import DatePicker from 'react-native-date-picker';
import { formatDateTimeToLocaleString } from '../../utils/Formatter';
import SearchOffenceModal from './SearchOffenceModal';
import BlueButtonShort from '../../components/common/BlueButtonShort';
import WhiteButtonShort from '../../components/common/WhiteButtonShort';

const OffenceModal = ({ visible, onClose, onSelectOffence, offence, isVehicle }) => {
    const [description, setDescription] = useState('');
    const [offenceDate, setOffenceDate] = useState('');
    const [selectedOffence, setSelectedOffence] = useState({});

    useEffect(() => {
        if (offence) {
            setDescription(offence.description);
            setOffenceDate(offence.offenceDate);
            setSelectedOffence(offence.selectedOffence)
        } else {
            resetForm();
        }
    }, [offence]);

    const [openOffenceDate, setOpenOffenceDate] = useState(false);
    const handleOpenOffenceDate = () => { setOpenOffenceDate(true); };
    const [showOffenceModal, setShowOffenceModal] = useState(false);

    const handleSelectRecord = (record) => {
        console.log('handleSelectRecord' , record);
        setSelectedOffence(record);
    };

    const renderSearchOffenceModal = () => (
        <SearchOffenceModal
            visible={showOffenceModal}
            onClose={() => setShowOffenceModal(false)}
            onSelect={handleSelectRecord}
            isVehicle={isVehicle}
            record={selectedOffence}
        />
    );

    const resetForm = () => { 
        setDescription('');
        setOffenceDate('');
        setSelectedOffence({});
    };

    const handleSelect = () => { 
        if (!selectedOffence?.code){
            Alert.alert("Invalid Offence", "Please select Offence");
            return;
        }
        if (!offenceDate){
            Alert.alert("Invalid Offence", "Please select Offence Date & Time");
            return;
        }
        const updatedOffence = {
            id: offence?.id? offence.id : Date.now(),
            selectedOffence,
            offenceDate,
            description
        }
        onSelectOffence(updatedOffence);
        
        resetForm();
        onClose();
    };
    
    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView]}>
                        {renderSearchOffenceModal()}
                        <View style={styles.centerFrameRow}>
                            <Text style={styles.labelBig}>Offence Details</Text>
                        </View>
                        <View style={[styles.row, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={spotsStyles.FullFrame}>
                                <Text>
                                    <Text style={styles.label}>Offence Description: </Text>
                                    <Text style={spotsStyles.LabelImpt}> (*) </Text>
                                </Text>
                                <TouchableOpacity style={spotsStyles.RoundedDateInputNoHeightLimit} onPress={() => setShowOffenceModal(true)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12, color: "rgba(0,22,62,1)" }}
                                            placeholder="Search Offence"
                                            multiline={true}
                                            editable={false}
                                            pointerEvents="none" 
                                            value={selectedOffence?.caption}
                                        />
                                        <Image
                                            source={require('../../assets/icon/search.png')}
                                            style={{ width: 28, height: 28 }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[ { width: '100%', flexDirection: 'row', padding: 10 }]}>
                            {/* Offence Code at the start */}
                            <View style={[ { flex: 1, flexDirection: 'row' }]}>
                                <Text style={styles.labelThin}>Offence Code: </Text>
                                <Text style={styles.labelThin}>
                                    {selectedOffence?.code || '0'}
                                </Text>
                            </View>

                            {/* Fine Amount in the middle or end, depending on `isVehicle` */}
                            {isVehicle ? (
                                <>
                                    {/* If `isVehicle` is true, Fine Amount goes in the middle */}
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={styles.labelThin}>Fine Amount: </Text>
                                        <Text style={styles.labelThin}>
                                            ${selectedOffence?.fine_amount || '0'}
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={styles.labelThin}>Fine Amount: </Text>
                                    <Text style={styles.labelThin}>
                                        ${selectedOffence?.fine_amount || '0'}
                                    </Text>
                                </View>
                            )}

                            {/* Demerit Points at the end only if `isVehicle` is true */}
                            {isVehicle && (
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={styles.labelThin}>Demerit Points: </Text>
                                    <Text style={styles.labelThin}>
                                        {selectedOffence?.demerit_point || '0'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={spotsStyles.FrameRow}>
                            <View style={spotsStyles.FullFrame}>
                                <Text>
                                    <Text style={styles.label}>Offence Date & Time </Text>
                                    <Text style={spotsStyles.LabelImpt}> (*) </Text>
                                </Text>
                                <Pressable  style={spotsStyles.RoundedDateInputWhite} onPress={handleOpenOffenceDate}>
                                    <TextInput
                                        style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12 , color : '#000000'}}
                                        placeholder="Select Date Time (DD/MM/YYYY HH:MM)"
                                        editable={false}
                                        value={offenceDate? formatDateTimeToLocaleString(offenceDate) : ""}
                                    />
                                    <TouchableOpacity onPress={handleOpenOffenceDate}>
                                        <Image
                                            source={require('../../assets/icon/calendar.png')}
                                            style={{ width: 28, height: 28 }}
                                        />
                                    </TouchableOpacity>
                                </Pressable>
                                <DatePicker
                                    modal
                                    open={openOffenceDate}
                                    maximumDate={new Date()} 
                                    date={offenceDate? new Date(offenceDate) : new Date()}
                                    onConfirm={(date) => {
                                        setOpenOffenceDate(false);
                                        setOffenceDate(date);
                                    }}
                                    onCancel={() => {
                                        setOpenOffenceDate(false);
                                    }}
                                />
                            </View>
                        </View>

                        <View style={spotsStyles.FrameRow}>
                            <View style={[spotsStyles.TextInputContainer, {padding: 8}]}>
                                <Text>
                                    <Text style={styles.label}> Description of Incident </Text>
                                    <Text style={spotsStyles.LabelSmall}> (2000 Characters) :</Text>
                                </Text>
                                <View style={spotsStyles.TextInputWrapper}>
                                    <TextInput
                                        style={spotsStyles.RoundedLongTextInputMediumLongWhite}
                                        multiline={true}
                                        textAlignVertical="top"
                                        onChangeText={text => setDescription(text)}
                                        maxLength={255}
                                        value={description}
                                    />
                                    <Text style={spotsStyles.CharCounter}>{description? description.length : 0}/2000</Text>
                                </View>
                            </View>
                        </View>
                        
                        <View style={styles.frameRow}>
                            <View style={styles.closeButton}>
                                <WhiteButtonShort title="Cancel" customClick={onClose}/>
                            </View>
                            <View style={styles.closeButton}>
                                <BlueButtonShort title="OK" customClick={() => { handleSelect() }} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    row: {
        width: "100%",
    },
    centerFrameRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
    },
    frameRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
        marginLeft: 210, 
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
        alignItems: 'center',
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
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    buttonText: {
        fontSize: 15,
        color: "rgba(0,22,62,1)",
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    textInput: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        color: 'rgba(0,22,62,1)',
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
    labelThin: {
        color: "black",
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "ZenKakuGothicAntique-Regular"
    },
    roundedDateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        color: 'black',
        borderColor: '#C7C7C7',
        borderRadius: 5,
        marginTop: 5,
        paddingRight: 8,
        minHeight: 53, // Changed from 'height' to 'minHeight' to allow dynamic growth
    },
});

export default OffenceModal;
