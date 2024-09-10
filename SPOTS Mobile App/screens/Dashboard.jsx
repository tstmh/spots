import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useContext, useCallback } from "react"
import { Text, View, TouchableOpacity, Modal, TextInput, RefreshControl, ScrollView, ToastAndroid } from "react-native"
import HeaderBannerDashboard from '../components/common/HeaderBannerDashboard';
import styles from '../components/spots-styles';
import dbService from '../utils/DatabaseService';
import { checkConnectionAPI, fullSync, getBaseUrl, setBaseUrl } from '../utils/ApiService';
import AccidentReport from "../models/AccidentReport";
import { OfficerContext } from "../context/officerContext";
import Summons from "../models/Summons";
import { SummonsContext } from "../context/summonsContext";
import { formatTimeStamp, generateSpotsId } from "../utils/Formatter";

const DashboardScreen = ({ navigation }) => {

  const [refreshing, setRefreshing] = useState(false);

  const [draftOSICount, setDraftOSICount] = useState(0);
  const [submittedOSICount, setSubmittedOSICount] = useState(0);
  const { officer } = useContext(OfficerContext);
  const { summons, updateSummons, resetSummons } = useContext(SummonsContext);

  //console.log("officer >> ", officer);

  const [draftSummonsCount, setDraftSummonsCount] = useState(0);
  const [submittedSummonsCount, setSubmittedSummonsCount] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [newBaseUrl, setNewBaseUrl] = useState('');
  
  useEffect(() => {
    setNewBaseUrl(getBaseUrl()); // Set the initial value of the input to the current baseUrl
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDraftOSICount();
      fetchDraftSummonsCount();
      fetchIssuedOSICount();
      fetchIssuedSummonsCount();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDraftOSICount();
      await fetchDraftSummonsCount();
      await fetchIssuedOSICount();
      await fetchIssuedSummonsCount();
      await populateLists();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  }, []);

  const handlePressSummon = (isEcho) => {
    console.log('handlePressSummon ', summons);

    resetSummons();

    const timestamp = formatTimeStamp();
    const type = isEcho ? 'M401E' : 'M401'

    const newSummon = {
      ID: timestamp,
      SPOTS_ID: generateSpotsId(type),
      DEVICE_ID: "", 
      OFFICER_ID: officer.OFFICER_ID,
      STATUS_ID: 1,
      TYPE: type,
      CREATED_AT: timestamp,
      INCIDENT_OCCURED: 1,
      LOCATION_CODE: null,
      LOCATION_CODE_2: null,
      SPECIAL_ZONE: 0,
      REMARKS_LOCATION: null,
      SCHOOL_NAME: null,
    };

    console.log("handlePressSummon newSummon", newSummon);
    updateSummons(newSummon);

    if (isEcho) {
        navigation.navigate('SummonsEchoMainScreen');
    } else {
        navigation.navigate('SummonsMainScreen');
    }
  };

  const fetchDraftOSICount = async () => {
    try {
      const count = await AccidentReport.getDraftCountAccidents(dbService.db);
      console.log("setDraftOSICount >> ", count);
      setDraftOSICount(count);
    } catch (error) {
      console.error("Failed to fetch draft osi count:", error);
    }
  }

  const fetchDraftSummonsCount = async () => {
    try {
      const count = await Summons.getDraftCountSummons(dbService.db);
      console.log("setDraftSummonsCount >> ", count);
      setDraftSummonsCount(count);
    } catch (error) {
      console.error("Failed to fetch draft summon count:", error);
    }
  }

  const fetchIssuedOSICount = async () => {
    try {
      const count = await AccidentReport.getIssuedOSICount(dbService.db);
      console.log("setSubmittedOSICount >> ", count);
      setSubmittedOSICount(count);
    } catch (error) {
      console.error("Failed to fetch issued osi count:", error);
    }
  }

  const fetchIssuedSummonsCount = async () => {
    try {
      const count = await Summons.getIssuedCountSummons(dbService.db);
      console.log("setSubmittedSummonsCount >> ", count);
      setSubmittedSummonsCount(count);
    } catch (error) {
      console.error("Failed to fetch issued summon count:", error);
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      
      //populateLists();
      fetchDraftOSICount();
      fetchDraftSummonsCount();
      fetchIssuedOSICount();
      fetchIssuedSummonsCount();
    };
    
    initializeData();
  }, []);

  const handleSync = async () => {
    try {

      const isConnected = await checkConnectionAPI();
      console.log("Connection status:", isConnected);

      if (isConnected) {
        // Full sync
        await fullSync();
        populateLists();
      } else {
        //Alert.alert('Error', 'Unable to establish a network connection.');
        console.log('Unable to establish a network connection.');
        ToastAndroid.show("Unable to establish a network connection.", ToastAndroid.SHORT);
      }

    } catch (error) {
      console.error("Full sync failed:", error);
    }
  };

  const handleSaveBaseUrl = () => {
    setBaseUrl(newBaseUrl); // Update the base URL in ApiService
    setModalVisible(false); // Close the modal
    handleSync(); // Start the sync process
  };

  const renderBaseUrlModal = () => (
    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.ModalContainer}>
          <View style={styles.ModalContent}>
                <Text>Enter new Base URL:</Text>
                <TextInput
                    value={newBaseUrl}
                    onChangeText={setNewBaseUrl}
                    placeholder="https://xxx.xx.x.x/MyApi/api/"
                    style={styles.RoundedTextInput}
                />
                <TouchableOpacity onPress={handleSaveBaseUrl} style={{justifyContent: 'center'}}>
                    <Text style={[styles.LabelNormal, {paddingTop: 20, alignSelf: 'center'}]}>Save and Sync</Text>
                </TouchableOpacity>
          </View>
      </View>
    </Modal>
  );

  populateLists = async () => {
        console.log("populateLists");
        dbService.populateList();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.ContainerWhiteBG}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <HeaderBannerDashboard title="What do you want to do today?" officerName={officer.OFFICER_NAME} navigation={navigation} />
      <View>
        <View style={{ width: "70%", alignSelf: "center", flexDirection: "column" }}>
          <Text style={styles.CategoryFont}>Summons</Text>
          <View style={styles.DashboardCaptionFrame}>
            <TouchableOpacity style={styles.BlueBox} onPress={() => handlePressSummon(false)}>
              <Text style={styles.LabelWhite}>M401</Text>
              <Text style={styles.LabelWhiteSmall}>Summons</Text>
              <View style={styles.MarginContainer} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.BlueBox} onPress={() => handlePressSummon(true)}>
              <Text style={styles.LabelWhite}>M401</Text>
              <Text style={styles.LabelWhiteSmall}>Summons</Text>
              <Text style={styles.LabelWhiteSmall}>(Echo)</Text>
              <View style={styles.MarginContainerXSmall} />
            </TouchableOpacity>
          </View>
          <View style={styles.DashboardCaptionFrame}>
            <TouchableOpacity style={styles.BlueBox} onPress={() => navigation.navigate('SummonsDraftSummonsScreen')}>
              <Text style={styles.LabelWhite}>DRAFT</Text>
              <Text style={styles.LabelWhiteSmall}>Summons</Text>
              <View style={styles.MarginContainerXSmall} />
              <Text style={styles.LabelWhiteMini}>{draftSummonsCount}</Text>
              <Text style={styles.LabelWhiteTiny}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BlueBox} onPress={() => navigation.navigate('SummonsIssuedSummonsScreen')}>
              <Text style={styles.LabelWhite}>ISSUED</Text>
              <Text style={styles.LabelWhiteSmall}>Summons</Text>
              <View style={styles.MarginContainerXSmall} />
              <Text style={styles.LabelWhiteMini}>{submittedSummonsCount}</Text>
              <Text style={styles.LabelWhiteTiny}>Submitted</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.MarginContainerSmall} />
          <Text style={[styles.CategoryFont, {width: "95%"}]}>Reports</Text>
          <View style={styles.DashboardCaptionFrame}>
            <TouchableOpacity style={styles.BlueBox} onPress={() => navigation.navigate('AccidentAddAccidentScreen')}>
              <Text style={styles.LabelWhite}>(OSI)</Text>
              <Text style={styles.LabelWhiteSmall}>On-Scene Investigation Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BlueBox} onPress={() => navigation.navigate('AccidentDraftAccidentScreen')}>
              <Text style={styles.LabelWhite}>DRAFT</Text>
              <Text style={styles.LabelWhiteSmall}>On-Scene Investigation Report</Text>
              <Text style={styles.LabelWhiteMini}>{draftOSICount}</Text>
              <Text style={styles.LabelWhiteTiny}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BlueBox} onPress={() => navigation.navigate('AccidentIssuedAccidentScreen')}>
              <Text style={styles.LabelWhite}>SUBMITTED</Text>
              <Text style={styles.LabelWhiteSmall}>On-Scene Investigation Report</Text>
              <Text style={styles.LabelWhiteMini}>{submittedOSICount}</Text>
              <Text style={styles.LabelWhiteTiny}>Submitted</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 75}} />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {/* Versioning */}
          <Text style={{
              color: "rgba(129,129,129,1)",
            fontFamily: "ZenKakuGothicAntique-Bold",
            fontSize: 13,
            lineHeight: 13,
            alignSelf: 'flex-end',
            marginRight: 30,
          }}>1.0.1U</Text>
        </TouchableOpacity>
        {renderBaseUrlModal()}
        <View style={styles.WhiteBoxForVehInvolved} />
      </View>
    </ScrollView>
  )
}

export default DashboardScreen;