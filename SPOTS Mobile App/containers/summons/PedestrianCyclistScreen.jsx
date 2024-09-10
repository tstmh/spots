import React, { useState, useContext, useRef, useEffect, forwardRef } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, SafeAreaView, ScrollView, FlatList, Alert, ToastAndroid } from 'react-native';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import BlueButton from '../../components/common/BlueButton';
import WhiteButton from '../../components/common/WhiteButton';
import Offender from './Offender';
import SearchOffenceModal from '../common/SearchOffenceModal';
import { SummonsContext } from '../../context/summonsContext';
import Offences from '../../models/Offences';
import Offenders from '../../models/Offenders';
import { parseStringToDate, formatDateToLocaleString, formatDateToString, formatIntegerValue, formatIntegerValueNotNull, formatTimeStamp, formatTimeToString, parseDateTimeStringToDateTime } from '../../utils/Formatter';
import DatabaseService from '../../utils/DatabaseService';
import TIMSOffenceCode from '../../models/TIMSOffenceCode';

const PedestrianCyclistScreen = forwardRef((props, ref) => {

  const { summons } = useContext(SummonsContext);
  const [showOffenceDetailsComponent, setShowOffenceDetailsComponent] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [offences, setOffences] = useState([]);
  const [filteredOffences, setFilteredOffences] = useState([]);
  
  const [showOffenceModal, setShowOffenceModal] = useState(false);

  const offenderRefs = useRef([]);

  // Expose the validate function
  React.useImperativeHandle(ref, () => ({
    validate: validateAndSave,
  }));

  useEffect(() => {
    const summonId = summons.ID;

    const getMappedOffenceData = async (summonId, offenceTypeId, offenderId) => {
      //get offences by offender
      const offenderOffenceData = await Offences.getOffenceByOffender(DatabaseService.db, summonId, offenceTypeId, offenderId);
      console.log("offenderOffenceData size " , offenderOffenceData.length);

      const offencePromises = offenderOffenceData.map(async (offence) => ({
        id: offence.ID,
        selectedOffence: await TIMSOffenceCode.getAllTIMSOffenceCodeByCode(DatabaseService.db, offence.OFFENCE_TYPE_ID),
        description: offence.REMARKS,
        createdAt: offence.CREATED_AT,
        offenceDate: parseDateTimeStringToDateTime(offence.OFFENCE_DATE, offence.OFFENCE_TIME),
      }));
    
      const mappedOffenceData = await Promise.all(offencePromises);
    
      return mappedOffenceData;
    };

    //TODO OPTIMISE PLS 
    const fetchMasterOffences = async () => {
        try {
            const masterOffenceData = await Offences.getOffencesBySummonsID(DatabaseService.db, summonId, true);
            
            //get master offences first
            console.log("fetchMasterOffences data size>> " , masterOffenceData.length);
            console.log("fetchMasterOffences data>> " , masterOffenceData);
            for (const masterOffenceRow of masterOffenceData) {
              const timsOffence = await TIMSOffenceCode.getAllTIMSOffenceCodeByCode(DatabaseService.db, masterOffenceRow.OFFENCE_TYPE_ID);

              const offenceExists = offences.some(existingOffence => existingOffence.id === masterOffenceRow.ID);
              console.log("offenceExists in offences? " , offenceExists);
              if (!offenceExists) {
                //add offence to offences! 

                //get unique offenders by master offence 
                const offenderData = await Offenders.getOffendersByOffence(DatabaseService.db, summonId, masterOffenceRow.OFFENCE_TYPE_ID);
                console.log("offenderData size " , offenderData.length);

                let offenderList = [];
                for (const offenderRow of offenderData) {
                    //get list of sub offences by offender
                    const mappedOffenceData = await getMappedOffenceData(summonId, masterOffenceRow.OFFENCE_TYPE_ID, offenderRow.ID);
                    console.log('mappedOffenceData in offenderRow size ' , mappedOffenceData.length);
                    console.log('mappedOffenceData in offenderRow ' , mappedOffenceData);

                    //map offender data, add their sub offences list
                    const mappedData = {
                      id: offenderRow.ID,
                      name: offenderRow.NAME, 
                      selectedInvolvementType: offenderRow.INVOLVEMENT_ID?.toString(), 
                      selectedIdType: offenderRow.ID_TYPE?.toString(),
                      idNo: offenderRow.IDENTIFICATION_NO, 
                      dateOfBirth: offenderRow.DATE_OF_BIRTH? parseStringToDate(offenderRow.DATE_OF_BIRTH) : null, 
                      selectedSex: offenderRow.GENDER_CODE?.toString(),
                      selectedCountryType: offenderRow.BIRTH_COUNTRY, 
                      selectedNationalityType: offenderRow.NATIONALITY, 
                      contact1: offenderRow.CONTACT_1, 
                      contact2: offenderRow.CONTACT_2, 
                      remarks: offenderRow.REMARKS_IDENTIFICATION,
                      selectedAddressType: offenderRow.ADDRESS_TYPE?.toString(), 
                      toggleSameAddress: offenderRow.SAME_AS_REGISTERED === 1,
                      block: offenderRow.BLOCK, 
                      street: offenderRow.STREET, 
                      floor: offenderRow.FLOOR, 
                      unitNo: offenderRow.UNIT_NO, 
                      buildingName: offenderRow.BUILDING_NAME, 
                      postalCode: offenderRow.POSTAL_CODE, 
                      addressRemarks: offenderRow.REMARKS_ADDRESS,
                      offences: mappedOffenceData
                    }
                    console.log('mappedData in offenderRow ' , mappedData);
                    offenderList.push(mappedData);
                }

                const offence = {
                  id: masterOffenceRow.ID,
                  offence: timsOffence,
                  description: masterOffenceRow.REMARKS,
                  createdAt: masterOffenceRow.CREATED_AT,
                  offender: offenderList
                }
                offences.push(offence);
              }
            };
            
            console.log('offences', offences);
            setFilteredOffences(offences);
        } catch (error) {
            console.error("Error fetching master offences:", error);
        }
    };

    fetchMasterOffences();
}, []);

  const [currentRecord, setCurrentRecord] = useState({
    id: null,
    description: '',
    offence: {},
    offender: []
  });

  const resetCurrentRecord = () => {
    setCurrentRecord({
        id: Date.now(),
        description: '',
        offence: {},
        offender: []
    });
  };
  
  useEffect(() => {
    const newFilteredRecords = offences.filter(record =>
        record.offence?.caption.toUpperCase().includes(searchInput.toUpperCase())
    );
    console.log("newFilteredRecords " , newFilteredRecords.length);
    setFilteredOffences(newFilteredRecords);
  }, [searchInput]);

  const showForm = () => {
    setShowOffenceDetailsComponent(true);
  };

  const hideForm = () => {
    setShowOffenceDetailsComponent(false);
    //resetForm();
  };

  const validateAndSave = () => {
    console.log('validateAndSave showOffenceDetailsComponent', showOffenceDetailsComponent);
    if (showOffenceDetailsComponent){
      //Alert.alert('Validation', 'Please go back to offence List.');
      return handleBackToList();
    }
    return !showOffenceDetailsComponent;
  }

  const handleSelectRecord = (record) => {
    console.log('handleSelectRecord', record);
    setCurrentRecord((prevRecord) => ({
        ...prevRecord,
        offence: record
    }));
  };

  const addRecord = () => {
    resetCurrentRecord();
    console.log("addRecord >> currentRecord " , currentRecord);
    showForm();
  };

  const editRecord = (record) => {
    setCurrentRecord(record);
    console.log("currentRecord >> " , record);
    showForm();
  };

  const deleteRecord = (item) => {
    console.log("deleteRecord ", item);
    const updatedRecords = offences.filter(record => record.id !== item.id);
    setOffences(updatedRecords);
    setFilteredOffences(updatedRecords);
    console.log("updatedRecords size ", updatedRecords.length);

    Offenders.deleteOffenderByOffenceId(DatabaseService.db, summons.ID, item.id);
    Offences.deleteOffences(DatabaseService.db, item.id);
  };

  const confirmDeleteRecord = (item) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this offence?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteRecord(item),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const handleAddOffender = () => {
    console.log('handleAddOffender currentRecord.offence ', currentRecord.offence );
    console.log('handleAddOffender currentRecord.offence isEmptyObject?', isEmptyObject(currentRecord.offence) );

    const newOffender = {
        id: Date.now(),
        name: '',
        idNo: '',
        contact1: '',
        contact2: '',
        injury: '',
        remarks: '',
        dateOfBirth: null,
        selectedSex: null,
        selectedInvolvementType: null,
        selectedIdType: null,

        block: '',
        street: '',
        floor: '',
        unitNo: '',
        buildingName: '',
        postalCode: '',
        addressRemarks: '',
        selectedAddressType: null,
        toggleSameAddress: false,

        offences: isEmptyObject(currentRecord.offence)
            ? []
            : [{
                description: '',
                offenceDate: '',
                selectedOffence: currentRecord.offence,
            }]
    };

    console.log('handleAddOffender newOffender ', newOffender );
    // Update the currentRecord.offender list
    setCurrentRecord((prevRecord) => ({
      ...prevRecord,
      offender: [...prevRecord.offender, newOffender]
    }));
  };  

  const handleRemoveOffender = (id) => {
    setCurrentRecord((prevRecord) => ({
        ...prevRecord,
        offender: prevRecord.offender.filter(offender => offender.id !== id)
    }));

    deleteOffenderAndOffences(id, summons.ID);
  };

  const deleteOffenderAndOffences = (offenderId, summonId) => {
    console.log(`deleteOffenderAndOffences ${offenderId}, ${summonId}`);

    // delete all offences related to this offender
    Offences.deleteOffenderOffences(DatabaseService.db, offenderId, summonId);

    // delete offender
    Offenders.deleteOffenderBySummonId(DatabaseService.db, offenderId, summonId);
  }

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this offender?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleRemoveOffender(id),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const saveRecord = (offenderData) => {
    console.log('saveRecord offenderData', offenderData);

    setCurrentRecord(prevRecord => {
        const updatedRecord = {
            ...prevRecord,
            offender: offenderData
        };

        // Perform the operations after setting the state within this function, ensuring it uses the latest state
        console.log("Updated currentRecord:", updatedRecord);

        // Check if the updatedRecord exists in the offences array
        const recordExists = offences.some(record => record.id === updatedRecord.id);

        let updatedRecords;
        if (recordExists) {
            // Update the existing record
            updatedRecords = offences.map(record =>
                record.id === updatedRecord.id ? updatedRecord : record
            );
        } else {
            // Add the new record
            updatedRecords = [...offences, updatedRecord];
        }

        console.log(updatedRecords);
        setOffences(updatedRecords);
        setFilteredOffences(updatedRecords);

        // Save to SQLite
        const mainOffenceToSave = {
            ID: updatedRecord.id,
            OFFENDER_ID: 0,
            SUMMONS_ID: summons.ID,
            SPOTS_ID: summons.SPOTS_ID,
            OFFENCE_TYPE_ID: updatedRecord.offence.code,
            OFFENCE_DATE: null,
            OFFENCE_TIME: null,
            REMARKS: updatedRecord.description,
            CREATED_AT: updatedRecord.createdAt ? updatedRecord.createdAt : formatTimeStamp(),
            PARENT_ID: 0 // parent offence
        };
        console.log('mainOffenceToSave', mainOffenceToSave);
        Offences.insertOffences(DatabaseService.db, mainOffenceToSave);

        // Save offenders
        offenderData.forEach(offender => {
            console.log('start saving each offender', offender);

            const offenderToSave = {
                ID: offender.id,
                SUMMONS_ID: summons.ID,
                OFFENDER_TYPE_ID: 1,
                NAME: offender.name,
                INVOLVEMENT_ID: formatIntegerValueNotNull(offender.selectedInvolvementType),
                ID_TYPE: formatIntegerValueNotNull(offender.selectedIdType),
                IDENTIFICATION_NO: offender.idNo !== null ? offender.idNo : "",
                DATE_OF_BIRTH: offender.dateOfBirth ? formatDateToString(offender.dateOfBirth) : null,
                GENDER_CODE: formatIntegerValue(offender.selectedSex),
                BIRTH_COUNTRY: offender.selectedCountryType,
                NATIONALITY: offender.selectedNationalityType,
                CONTACT_1: offender.contact1,
                CONTACT_2: offender.contact2,
                REMARKS_IDENTIFICATION: offender.remarks,
                ADDRESS_TYPE: formatIntegerValue(offender.selectedAddressType),
                SAME_AS_REGISTERED: offender.toggleSameAddress ? 1 : 0,
                BLOCK: offender.block,
                STREET: offender.street,
                FLOOR: offender.floor,
                UNIT_NO: offender.unitNo,
                BUILDING_NAME: offender.buildingName,
                POSTAL_CODE: offender.postalCode,
                REMARKS_ADDRESS: offender.addressRemarks,
            };

            console.log('offenderToSave', offenderToSave);
            Offenders.insertOffender(DatabaseService.db, offenderToSave);

            Offences.deleteOffenderOffences(DatabaseService.db, offender.id, summons.ID);

            // Start saving each offender's offence
            console.log('start saving each offender’s offence size', offender.offences.length);
            offender.offences.forEach(offence => {
                console.log('each offence', offence);
                const offenceToSave = {
                    ID: offence.id,
                    OFFENDER_ID: offenderToSave.ID,
                    SUMMONS_ID: summons.ID,
                    SPOTS_ID: summons.SPOTS_ID,
                    OFFENCE_TYPE_ID: offence.selectedOffence.code,
                    OFFENCE_DATE: offence.offenceDate ? formatDateToLocaleString(offence.offenceDate) : null,
                    OFFENCE_TIME: offence.offenceDate ? formatTimeToString(offence.offenceDate) : null,
                    REMARKS: offence.description,
                    CREATED_AT: formatTimeStamp(),
                    PARENT_ID: mainOffenceToSave.ID
                };
                console.log('offenceToSave', offenceToSave);

                Offences.insertOffences(DatabaseService.db, offenceToSave);
            });
        });

        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);

        return updatedRecord; // Update the state with the new record
    });
  };


  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const validateForm = () => {
    console.log('validateForm! ' , currentRecord.offence);

    if (isEmptyObject(currentRecord.offence)) {
      Alert.alert('Invalid fields', 'Please select Offence.')
      return false;
    }

    if (!validateAllOffenders()){
      return false;
    }

    return true;
  }

  const validateAllOffenders = () => {
    for (const ref of offenderRefs.current) {
        if (ref) {
            const validation = ref.validateForm();
            console.log('validateAllOffenders', ref);
            console.log('validation', validation);
            if (!validation) {
                return false;
            }
        }
    }
    return true;
  };

  const handleSaveDraft = () => {
    if (validateForm()) {

      let offenderData = [];
      
      offenderRefs.current.forEach((ref, index) => {
        if (ref) {
            offenderData.push(ref.getForm());
        }
      });

      console.log('offenderData', offenderData);

      saveRecord(offenderData); 
    }
  };

  const handleBackToList = () => {
    if (validateForm()) {
      console.log('validation passed! go back to list')
      let offenderData = [];
      
      offenderRefs.current.forEach((ref, index) => {
        if (ref) {
            offenderData.push(ref.getForm());
        }
      });

      console.log('offenderData', offenderData);

      saveRecord(offenderData); 

      hideForm();
      return true;
    } else {
      return false;
    }
  };

  const renderSearchOffenceModal = () => (
    <SearchOffenceModal
      visible={showOffenceModal}
      onClose={() => setShowOffenceModal(false)}
      onSelect={handleSelectRecord}
      isVehicle={false}
      record={currentRecord.offence}
    />
  );

  const renderItem = ({ item }) => (
    <View style={[styles.PedestrianContainer, {padding: 13}]}>
      <TouchableOpacity
        onPress={() => editRecord(item)}
        style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center'}}>
        <Text style={styles.LabelNormalBold}>{item.offence.caption}</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 13 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center', marginRight: 20 }}
          onPress={() => confirmDeleteRecord(item)}>
          <Text style={[styles.DeleteFont, { marginRight: 5 }]}>Delete</Text>
          <Image style={{ width: 15, height: 17, alignSelf: 'center' }} source={require('../../assets/icon/delete-red.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center' }}
          onPress={() => editRecord(item)}>
          <Text style={[styles.ViewFont, { marginRight: 5 }, { alignSelf: 'center' }]}>Edit</Text>
          <Image style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../../assets/icon/edit.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.ContainerWhiteBGSummons}>
      {renderSearchOffenceModal()}
      {!showOffenceDetailsComponent && (
        <SafeAreaView >
          <Text style={styles.VehicleInvolvedTitleFontStyle}>Offence List</Text>
          <View style={styles.MarginContainerSmall} />
          <View style={styles.ComponentFrame}>
            <View style={[styles.RoundedDateInput]}>
              <TextInput
                  style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12 }}
                  placeholder="Search Offences"
                  value={searchInput}
                  onChangeText={setSearchInput}
              />
              <Image
                source={require('../../assets/icon/search.png')}
                style={{ width: 28, height: 28 }}
              />
            </View>
            <FlatList
              style={[styles.ListContainer, {flex: 1}]}
              data={filteredOffences}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <View style={styles.NoItemsContainer}>
                  <Text style={styles.NoItemsFont}>No items found. </Text>
                  <Text style={styles.NoItemsRegularFont}> Tap the button below to add a Pedestrian Offence. </Text>
                </View>
              )}
            />
            <View style={[styles.ListContainer, { flex: 1 }]}>
              <BlueButton title="ADD PEDESTRIAN OFFENCE" customClick={addRecord} />
              <View style={styles.MarginContainerXSmall} />
              <BackToHomeButton />
            </View>
          </View>
        </SafeAreaView>
      )}

      {showOffenceDetailsComponent && (
          <SafeAreaView>
            <View style={styles.FlexRowCenter}>
              <Text style={styles.VehicleInvolvedTitleFontStyle}>Offence Details</Text>
            </View>
            <View style={styles.FrameRow}>
              <View style={styles.FullFrameFlexNoPad}>
                <Text>
                  <Text style={styles.Label}>Offence Description: </Text>
                  <Text style={styles.LabelImpt}> (*) </Text>
                </Text>
                <TouchableOpacity style={styles.RoundedDateInputNoHeightLimit} onPress={() => setShowOffenceModal(true)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12, color: "rgba(0,22,62,1)" }}
                      placeholder="Search Offence"
                      multiline={true}
                      editable={false}
                      pointerEvents="none"
                      value={currentRecord.offence?.caption}
                    />
                    <Image
                      source={require('../../assets/icon/search.png')}
                      style={{ width: 28, height: 28 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: "row", flex: 1, paddingBottom: 10}}>
              <View style={styles.OffenceThirdFrameContainer}>
                <Text style={styles.LabelThin}>Offence Code</Text>
                <View style={[styles.VerticalVector, {borderRightColor: '#D4D4D4', marginLeft: 8, marginRight: 13, marginTop: 10 }]} /> 
                {currentRecord.offence?.fine_amount ? (
                  <Text style={styles.LabelThin} > {currentRecord.offence?.code}</Text>
                ) : (
                  <Text style={styles.LabelThin} > 0 </Text>
                )}

              </View>
              <View style={styles.OffenceThirdFrameContainerEnd}>
                <Text style={styles.LabelThin}>Fine Amount</Text>
                <View style={[styles.VerticalVector, {borderRightColor: '#D4D4D4', marginLeft: 8, marginRight: 13, marginTop: 10 }]} /> 
                {currentRecord.offence?.fine_amount ? (
                  <Text style={styles.LabelThin} > ${currentRecord.offence?.fine_amount}</Text>
                ) : (
                  <Text style={styles.LabelThin} > $0 </Text>
                )}

              </View>
            </View>
            <View style={styles.FrameRow}>
              <View style={[styles.FullFrameFlexNoPad]}>
                <Text>
                  <Text style={styles.Label}> Description of Incident </Text>
                  <Text style={styles.LabelSmall}> (2000 Characters) :</Text>
                </Text>
                <View style={styles.TextInputWrapper}>
                  <TextInput
                    style={styles.RoundedLongTextInputMediumLongWhite}
                    multiline={true}
                    textAlignVertical="top"
                    onChangeText={ (text) => 
                      setCurrentRecord((prevRecord) => ({
                        ...prevRecord, 
                        description: text,
                      }))
                    }
                    maxLength={255}
                    value={currentRecord?.description}
                  />
                  <Text style={styles.CharCounter}>{currentRecord.description ? currentRecord.description.length : 0}/2000</Text>
                </View>
              </View>
            </View>

            <View style={styles.ListComponentFrame}>
              <View style={styles.PassengerTitle}>
                  <Text style={styles.VehicleInvolvedTitleFontStyle}>  Offender List ({currentRecord.offender?.length})</Text>
                  <TouchableOpacity style={[styles.MainButtonStyle3, {marginRight: 15}]} onPress={handleAddOffender}>
                      <Text style={styles.Add}>Add</Text>
                      <Image
                          source={require('../../assets/icon/add-white.png')}
                          style={{ width: 12, height: 12, alignSelf:"center" }}
                      />
                  </TouchableOpacity>
              </View>
              {currentRecord.offender.map((data, index) => (
                  <View 
                      style={styles.ContainerWhiteBG} 
                      key={data.id}>
                      <Offender 
                          ref={el => offenderRefs.current[index] = el}
                          index={index}
                          offenderData={data}
                          onRemoveOffender={confirmDelete}
                      />
                  </View>
              ))}
            </View>
            <View style={styles.FullFrame}>
              <WhiteButton title="SAVE AS DRAFT" customClick={handleSaveDraft} />
              <View style={styles.MarginContainerXSmall} />
              <BlueButton title="BACK TO LIST" customClick={handleBackToList} />
            </View>
            <View style={styles.MarginContainerXLarge} />
          </SafeAreaView>
      )}
      <View style={styles.MarginContainerXLarge} />
    </ScrollView>
  );
});

export default PedestrianCyclistScreen;
