import React, { useState, useContext, useRef, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, SafeAreaView, ScrollView, FlatList, Alert, ToastAndroid } from 'react-native';
import { SummonsContext } from '../../context/summonsContext';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import BlueButton from '../../components/common/BlueButton';
import WhiteButton from '../../components/common/WhiteButton';
import SearchOffenceModal from '../common/SearchOffenceModal';
import Vehicle from './Vehicle';
import Offences from '../../models/Offences';
import TIMSOffenceCode from '../../models/TIMSOffenceCode';
import Offenders from '../../models/Offenders';
import DatabaseService from '../../utils/DatabaseService';
import { formatDateToLocaleString, formatTimeStamp, formatTimeToString, parseDateTimeStringToDateTime } from '../../utils/Formatter';

const SummonsEchoVehicle = React.forwardRef((props, ref) => {

  const { summons } = useContext(SummonsContext);
  const [showOffenceDetailsComponent, setShowOffenceDetailsComponent] = useState(false);
  const [showOffenceModal, setShowOffenceModal] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [offences, setOffences] = useState([]);
  const [filteredOffences, setFilteredOffences] = useState([]);

  const vehicleRefs = useRef([]);

  // Expose the validate function
  React.useImperativeHandle(ref, () => ({
    validate: validateAndSave,
  }));

  useEffect(() => {
    console.log('filteredOffences:', filteredOffences);
  }, [filteredOffences]);

  //fetch from sqlite
  useEffect(() => {
    const summonId = summons.ID;

    const getMappedOffenceData = async (summonId, offenderOffenceData) => {

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
        //get list of master offences first
        const masterOffenceData = await Offences.getOffencesBySummonsID(DatabaseService.db, summonId, true);
        console.log(`fetchMasterOffences data size ${masterOffenceData.length} >> `, masterOffenceData);
        
        for (const masterOffenceRow of masterOffenceData) {
          const timsOffence = await TIMSOffenceCode.getAllTIMSOffenceCodeByCode(DatabaseService.db, masterOffenceRow.OFFENCE_TYPE_ID);

          const offenceExists = offences.some(existingOffence => existingOffence.id === masterOffenceRow.ID);
          console.log("offenceExists in offences? " , offenceExists);

          if (!offenceExists) {
            //fetch offenders vehicles
            const vehiclesData = await Offenders.getOffendersByOffence(DatabaseService.db, summonId, masterOffenceRow.OFFENCE_TYPE_ID);
            console.log(`vehiclesData ${vehiclesData.length} >> ` , vehiclesData);

            const vehicleList = [];
            for (const vehicleRow of vehiclesData) {

              //get list of sub offences by offender
              const offenderOffenceData = await Offences.getSubOffenceByOffender(DatabaseService.db, summonId, masterOffenceRow.ID, vehicleRow.ID);
              console.log(`offenderOffenceData ${offenderOffenceData.length} >> ` , offenderOffenceData);

              let sVehicleSpeedingClocked = null;
              let sVehicleSpeedLimit = null;
              let sRoadSpeedLimit = null;
              let sSelectedSpeedLimiterRequired = null;
              let sSelectedSpeedDevice = null;
              let sSelectedSpeedLimiterInstalled = null;
              let sSelectedSentForInspection = null;

              //get speeding details from offence
              if (offenderOffenceData && offenderOffenceData.length > 0){
                const speedingOffence = offenderOffenceData[0];
                console.log('speedingOffence', speedingOffence);
                sVehicleSpeedingClocked = offenderOffenceData[0].SPEED_CLOCKED;
                sVehicleSpeedLimit = offenderOffenceData[0].SPEED_LIMIT;
                sRoadSpeedLimit = offenderOffenceData[0].ROAD_LIMIT;
                sSelectedSpeedLimiterRequired = offenderOffenceData[0].SPEED_LIMITER_REQUIRED?.toString();
                sSelectedSpeedDevice = offenderOffenceData[0].SPEED_DEVICE_ID?.toString();
                sSelectedSpeedLimiterInstalled = offenderOffenceData[0].SPEED_LIMITER_INSTALLED?.toString();
                sSelectedSentForInspection = offenderOffenceData[0].SENT_INSPECTION?.toString();
              }

              const mappedOffenceData = await getMappedOffenceData(summonId, offenderOffenceData);

              //map vehicles
              const mappedVehicle = {
                id: vehicleRow.ID,

                registrationNo: vehicleRow.REGISTRATION_NO,
                toggleLocalVehCheckBox: vehicleRow.LOCAL_PLATE === 1,
                toggleSpecialPlateCheckBox: vehicleRow.SPECIAL_PLATE === 1,
                selectedVehicleType: vehicleRow.TYPE_CODE,
                selectedVehicleCategory: vehicleRow.CATEGORY_CODE?.toString(),
                selectedVehicleTransmission: vehicleRow.TRANSMISSION_TYPE?.toString(),
                selectedClass3CEligibility: vehicleRow.ELIGIBLE_CLASS_3C?.toString(),
                selectedVehicleMake: vehicleRow.MAKE_CODE,
                selectedVehicleColor: vehicleRow.COLOR_CODE,
                vehicleColorOthers: vehicleRow.COLOR,
                vehicleUnladenWeight: vehicleRow.WEIGHT,
                selectedOperationType: vehicleRow.OPERATION_TYPE?.toString(),

                vehicleSpeedingClocked: sVehicleSpeedingClocked,
                vehicleSpeedLimit: sVehicleSpeedLimit,
                roadSpeedLimit: sRoadSpeedLimit,
                selectedSpeedLimiterRequired: sSelectedSpeedLimiterRequired? sSelectedSpeedLimiterRequired: null,
                selectedSpeedDevice: sSelectedSpeedDevice? sSelectedSpeedDevice : null,
                selectedSpeedLimiterInstalled: sSelectedSpeedLimiterInstalled? sSelectedSpeedLimiterInstalled : null,
                selectedSentForInspection: sSelectedSentForInspection? sSelectedSentForInspection : null,
                
                offences: mappedOffenceData
              }
              console.log(`mappedVehicle >> ` , mappedVehicle);

              vehicleList.push(mappedVehicle);
            }

            console.log(`vehicleList ${vehicleList.length} >> ` , vehicleList);

            //add master offence to offences! 
            const offence = {
              id: masterOffenceRow.ID,
              offence: timsOffence,
              description: masterOffenceRow.REMARKS,
              createdAt: masterOffenceRow.CREATED_AT,
              vehicles: vehicleList
            }
            offences.push(offence);
          }
        };
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
    vehicles: []
  });

  const resetCurrentRecord = () => {
    setCurrentRecord({
        id: Date.now(),
        description: '',
        offence: {},
        vehicles: []
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
    Offences.deleteAllOffences(DatabaseService.db, item.id);

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

  const handleAddVehicle = () => {
    console.log(`handleAddVehicle currentRecord.offence isEmptyObject? ${isEmptyObject(currentRecord.offence)}`, currentRecord.offence );

    const newVehicle = {
        id: Date.now(),
        registrationNo: '',
        selectedOperationType: null,
        selectedVehicleType: null,
        selectedVehicleCategory: null,
        toggleLocalVehCheckBox: false,
        toggleSpecialPlateCheckBox: false,
        selectedVehicleTransmission: null,
        selectedClass3CEligibility: null,
        selectedVehicleMake: null,
        vehicleUnladenWeight: '',
        selectedVehicleColor: null,
        vehicleColorOthers: '',
        selectedSpeedDevice: null,
        vehicleSpeedingClocked: '',
        vehicleSpeedLimit: '',
        roadSpeedLimit: '',
        selectedSpeedLimiterRequired: null,
        selectedSpeedLimiterInstalled: null,
        selectedSentForInspection: null,
        offences: isEmptyObject(currentRecord.offence)
            ? []
            : [{
                description: '',
                offenceDate: '',
                selectedOffence: currentRecord.offence,
            }]
    };

    console.log('handleAddVehicle newVehicle ', newVehicle );
    // Update the currentRecord.vehicles list
    setCurrentRecord((prevRecord) => ({
      ...prevRecord,
      vehicles: [...prevRecord.vehicles, newVehicle]
    }));
  };  

  const handleRemoveVehicle = (id) => {
    setCurrentRecord((prevRecord) => ({
        ...prevRecord,
        vehicles: prevRecord.vehicles.filter(vehicle => vehicle.id !== id)
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
      "Are you sure you want to delete this vehicle?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleRemoveVehicle(id),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const saveRecord = (vehicleData) => {
    console.log('saveRecord vehicleData', vehicleData);

    setCurrentRecord(prevRecord => {
        const updatedRecord = {
            ...prevRecord,
            vehicles: vehicleData
        };

        // Perform the operations after setting the state within this function, ensuring it uses the latest state
        console.log("Updated currentRecord:", updatedRecord);

        // Check if the currentRecord exists in the offences array
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

        //save to sqlite    
        //save main offence 
        const mainOffenceToSave = {
          ID: currentRecord.id,
          OFFENDER_ID: 0, 
          SUMMONS_ID: summons.ID, 
          SPOTS_ID: summons.SPOTS_ID,
          OFFENCE_TYPE_ID: updatedRecord.offence.code,
          OFFENCE_DATE: null, 
          OFFENCE_TIME: null, 
          REMARKS: updatedRecord.description,
          CREATED_AT: updatedRecord.createdAt? updatedRecord.createdAt : formatTimeStamp(),
          PARENT_ID: 0 //parent offence
        }
        console.log('mainOffenceToSave', mainOffenceToSave);
        Offences.insertOffences(DatabaseService.db, mainOffenceToSave);

        //save offenders
        vehicleData.forEach(offender => {
          console.log('start saving each offender' , offender);
          //save each offenders
          const offenderToSave = {
            ID: offender.id,
            SUMMONS_ID: summons.ID,
            OFFENDER_TYPE_ID: 2,
            REGISTRATION_NO: offender.registrationNo,
            INVOLVEMENT_ID: 2, // Driver's default
            ID_TYPE: 4, // Others
            IDENTIFICATION_NO: "UNKNOWN", // No ID in ECHO
            LOCAL_PLATE: (offender.toggleLocalVehCheckBox? 1 : 0),
            SPECIAL_PLATE: (offender.toggleSpecialPlateCheckBox? 1 : 0),
            TYPE_CODE: offender.selectedVehicleType,
            CATEGORY_CODE: offender.selectedVehicleCategory,
            TRANSMISSION_TYPE: offender.selectedVehicleTransmission,
            ELIGIBLE_CLASS_3C: offender.selectedClass3CEligibility,
            MAKE_CODE: offender.selectedVehicleMake,
            COLOR: (offender.selectedVehicleColor == 99 || offender.selectedVehicleColor == '99') ? offender.vehicleColorOthers : null,
            COLOR_CODE: offender.selectedVehicleColor,
            WEIGHT: offender.vehicleUnladenWeight,
            OPERATION_TYPE: offender.selectedOperationType,
          }
          console.log('offenderToSave' , offenderToSave);
          Offenders.insertVehicle(DatabaseService.db, offenderToSave);

          // delete all offences related to this offender in sqlite
          Offences.deleteOffenderOffences(DatabaseService.db, offender.id, summons.ID);

          //start saving each offender's offence in sqlite
          console.log('start saving each offenders offence size ' , offender.offences.length);
          offender.offences.forEach(offence => {
            console.log('each offence ', offence);
            const offenceToSave = {
              ID: offence.id,
              OFFENDER_ID: offenderToSave.ID, 
              SUMMONS_ID: summons.ID, 
              SPOTS_ID: summons.SPOTS_ID,
              OFFENCE_TYPE_ID: offence.selectedOffence.code,
              OFFENCE_DATE: offence.offenceDate? formatDateToLocaleString(offence.offenceDate) : null, 
              OFFENCE_TIME: offence.offenceDate? formatTimeToString(offence.offenceDate) : null, 
              REMARKS: offence.description,
              CREATED_AT: offence.createdAt? offence.createdAt : formatTimeStamp(),
              PARENT_ID: mainOffenceToSave.ID,
              // speeding
              SPEED_CLOCKED: offender.vehicleSpeedingClocked,
              SPEED_LIMIT: offender.vehicleSpeedLimit,
              ROAD_LIMIT: offender.roadSpeedLimit,
              SPEED_LIMITER_REQUIRED: offender.selectedSpeedLimiterRequired,
              SPEED_DEVICE_ID: offender.selectedSpeedDevice,
              SPEED_LIMITER_INSTALLED: offender.selectedSpeedLimiterInstalled,
              SENT_INSPECTION: offender.selectedSentForInspection

            }
            console.log('offenceToSave' , offenceToSave);

            Offences.insert(DatabaseService.db, offenceToSave);
          });
        })
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

    if (!validateAllVehicles()){
      return false;
    }

    return true;
  }

  const validateAllVehicles = () => {
    for (const ref of vehicleRefs.current) {
        if (ref) {
            const validation = ref.validateForm();
            if (!validation) {
                return false;
            }
        }
    }
    return true;
  };

  const handleSaveDraft = () => {

    const valid = validateForm();
    console.log(`validateForm valid ${valid}`);

    if (valid) {
      let vehicleData = [];
      
      vehicleRefs.current.forEach((ref, index) => {
        if (ref) {
          vehicleData.push(ref.getForm());
        }
      });

      console.log('vehicleData', vehicleData);

      saveRecord(vehicleData); 
    }
  };

  const handleBackToList = () => {
    const valid = validateForm();
    console.log(`validateForm valid ${valid}`);

    if (valid) {
      let vehicleData = [];
      
      vehicleRefs.current.forEach((ref, index) => {
        if (ref) {
          vehicleData.push(ref.getForm());
        }
      });

      console.log('vehicleData', vehicleData);

      saveRecord(vehicleData); 

      hideForm();
      return true;
    }
    return false;
  };
  
  const validateAndSave = () => {
    console.log('validateAndSave showOffenceDetailsComponent', showOffenceDetailsComponent);
    if (showOffenceDetailsComponent){
      //Alert.alert('Validation', 'Please go back to Offence List to save this form.');
      return handleBackToList();
    }
    return !showOffenceDetailsComponent;
  }

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
      <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'flex-end', marginBottom: 13 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center', marginRight: 20 }}
          onPress={() => confirmDeleteRecord(item)}>
          <Text style={[styles.DeleteFont, { marginRight: 5 }]}>Delete</Text>
          <Image style={{ width: 15, height: 17, alignSelf: 'center' }} source={require('../../assets/icon/delete-red.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center' }}
          onPress={() => editRecord(item)}>
          <Text style={[styles.EditFont, { marginRight: 5 }, { alignSelf: 'center' }]}>Edit</Text>
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
                  <Text style={styles.NoItemsRegularFont}> Tap the button below to add a Offence. </Text>
                </View>
              )}
            />
            <View style={[styles.ListContainer, { flex: 1 }]}>
              <BlueButton title="ADD OFFENCE" customClick={addRecord} />
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
                      editable={false}
                      multiline={true}
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
            <View style={{flexDirection: "row", flex: 1}}>
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
                  <Text style={styles.VehicleInvolvedTitleFontStyle}>  Vehicle List ({currentRecord.vehicles?.length})</Text>
                  <TouchableOpacity style={[styles.MainButtonStyle3, {marginRight: 15}]} onPress={handleAddVehicle}>
                      <Text style={styles.Add}>Add</Text>
                      <Image
                          source={require('../../assets/icon/add-white.png')}
                          style={{ width: 12, height: 12, alignSelf:"center" }}
                      />
                  </TouchableOpacity>
              </View>
              {currentRecord.vehicles.map((data, index) => (
                  <View 
                      style={styles.ContainerWhiteBG} 
                      key={data.id}>
                      <Vehicle 
                          ref={el => vehicleRefs.current[index] = el}
                          index={index}
                          vehicleData={data}
                          onRemoveVehicle={confirmDelete}
                      />
                  </View>
              ))}
            </View>
            <View style={styles.FullFrame}>
              <View style={styles.MarginContainer} />
              <WhiteButton title="SAVE AS DRAFT" customClick={handleSaveDraft} />
              <View style={styles.MarginContainerXSmall} />
              <BlueButton title="BACK TO LIST" customClick={handleBackToList} />
            </View>
            <View style={{height: 150}}/>
          </SafeAreaView>
      )}
      <View style={styles.MarginContainerXLarge} />
    </ScrollView>
  );
});

export default SummonsEchoVehicle;
