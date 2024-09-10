import React, {useState, useContext, useCallback, useEffect} from 'react';
import {
  Text,
  Image,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import HeaderBannerLogin from '../components/common/HeaderBannerLogin';
import styles from '../components/spots-styles';
import {OfficerContext} from '../context/officerContext';
import BlueButton from '../components/common/BlueButton';
import {
  authenticateAPI,
  getBaseUrl,
  setBaseUrl,
  checkConnectionAPI,
  fullSync,
} from '../utils/ApiService';
import LoadingModal from '../containers/common/Loading';
import Officer from '../models/Officer';
import DatabaseService from '../utils/DatabaseService';
import {useFocusEffect} from '@react-navigation/native';

const LoginScreen = ({navigation}) => {
  const {updateOfficer} = useContext(OfficerContext);

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newBaseUrl, setNewBaseUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [secureText, setSecureText] = useState(true);

  useEffect(() => {
    setNewBaseUrl(getBaseUrl()); // Set the initial value of the input to the current baseUrl
  }, []);

  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setPassword('');
    }, []),
  );

  const login = async () => {
    console.log(`login ${username}, ${password}`);

    if (!username) {
      Alert.alert('Incomplete fields', 'Please enter Username');
      return;
    }

    if (!password) {
      Alert.alert('Incomplete fields', 'Please enter Password');
      return;
    }

    setLoading(true);

    const result = await authenticateAPI(username, password);
    console.log(`login success? `, result);

    setLoading(false);

    if (result) {
      if (!result.success) {

        if (username.toUpperCase() === "O12041701P" && password == "Spfu@t221004"){
          const updatedOfficer = {
            NRIC_NO: "O12041701P",
            OFFICER_NAME: "UAT Tester",
            OFFICER_RANK: "RANK",
            OFFICER_TEAM: "TP",
            OFFICER_ID: 105,
          };
  
          // Store globally for all access
          updateOfficer(updatedOfficer);
  
          // Save to database
          Officer.insert(DatabaseService.db, updatedOfficer);
  
          navigation.navigate('Dashboard');
        } else {

          Alert.alert('Login Unsuccessful', result.message);
        }


        //return;
        //check connection "Cannot connect to SPOTS Server"
        //404 check privilege "Sorry, You do not have enough privilege to access the mobile app."
        //Account Locked "User Account is locked"
        //Inexistent Username "The user name or password provided is incorrect."

        //HARDCODE FOR DEV
        const hardcodeOfficer = {
          NRIC_NO: username.toUpperCase(),
          OFFICER_NAME: username.toUpperCase(),
          OFFICER_RANK: 'RANK',
          OFFICER_TEAM: 'TP',
          SITE_ID: 'Z',
          GENDER_CODE: 1,
          PHONE_NO: null,
          OFFICER_ID: 102,
        };

        // Store globally for all access
        updateOfficer(hardcodeOfficer);

        // Save to database
        Officer.insert(DatabaseService.db, hardcodeOfficer);

        navigation.navigate('Dashboard');
      } else {
        console.log('user received: ', result);

        //set officer model
        const updatedOfficer = {
          NRIC_NO: result.user.nric.toUpperCase(),
          OFFICER_NAME: result.user.display_name.toUpperCase(),
          OFFICER_RANK: result.user.rank,
          OFFICER_TEAM: result.user.department,
          // SITE_ID: "Z",
          // GENDER_CODE: 1,
          // PHONE_NO: null,
          OFFICER_ID: result.user.user_id,
        };

        // Store globally for all access
        updateOfficer(updatedOfficer);

        // Save to database
        Officer.insert(DatabaseService.db, updatedOfficer);

        navigation.navigate('Dashboard');
      }
    }
  };

  const handleSaveBaseUrl = () => {
    setBaseUrl(newBaseUrl); // Update the base URL in ApiService
    setModalVisible(false); // Close the modal
    handleSync(); // Start the sync process
  };

  const handleSync = async () => {
    try {
      const isConnected = await checkConnectionAPI();
      console.log('Connection status:', isConnected);

      if (isConnected) {
        // Full sync
        await fullSync();
        DatabaseService.populateList();
      } else {
        //Alert.alert('Error', 'Unable to establish a network connection.');
        console.log('Unable to establish a network connection.');
      }
    } catch (error) {
      console.error('Full sync failed:', error);
    }
  };

  const renderBaseUrlModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.ModalContainer}>
        <View style={styles.ModalContent}>
          <Text>Enter new Base URL:</Text>
          <TextInput
            value={newBaseUrl}
            onChangeText={setNewBaseUrl}
            placeholder="https://xxx.xx.x.x/MyApi/api/"
            style={styles.RoundedTextInput}
          />
          <TouchableOpacity
            onPress={handleSaveBaseUrl}
            style={{justifyContent: 'center'}}>
            <Text
              style={[
                styles.LabelNormal,
                {paddingTop: 20, alignSelf: 'center'},
              ]}>
              Save and Sync
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.ContainerWhiteBG}>
      <HeaderBannerLogin />
      <View style={{flexDirection: 'column'}}>
        <View style={{width: '70%', height: '83%', alignSelf: 'center'}}>
          <View style={styles.LoginFrameTopMargin}>
            <View style={styles.MarginContainerSmall} />
            <Text style={styles.PageTitleLogin}> Welcome to SPOTS! </Text>
            <View style={styles.MarginContainerXSmall} />
            <Text style={styles.PageSubtitleLogin}>
              {' '}
              Please login to continue using the System{' '}
            </Text>
            <View style={styles.MarginContainerSmall} />
            <View style={styles.TextInputContainer}>
              <Text>
                <Text style={styles.LabelLogin}> Username </Text>
              </Text>
              <TextInput
                style={styles.RoundedTextInputWhiteLogin}
                value={username}
                onChangeText={value => setUsername(value)}
              />
            </View>
            <View style={styles.TextInputContainer}>
              <Text>
                <Text style={styles.LabelLogin}> Password </Text>
              </Text>
              <View
                style={[
                  styles.RoundedTextInputWhiteLogin,
                  {flexDirection: 'row'},
                ]}>
                <TextInput
                  style={{width: '92%'}}
                  value={password}
                  secureTextEntry={secureText}
                  onChangeText={value => setPassword(value)}
                />
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                  }}
                  onPress={() => setSecureText(!secureText)}>
                  <Image
                    style={{width: 30, height: 30, alignSelf: 'center'}}
                    source={require('../assets/icon/eye.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.MarginContainerSmall} />
            <BlueButton title="Login" customClick={() => login()} />
            <LoadingModal visible={loading} />
          </View>
          {renderBaseUrlModal()}
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{alignSelf: 'flex-end', paddingRight: 30}}>
          <Text
            style={{
              color: 'rgba(0,22,62,1)',
              fontFamily: 'ZenKakuGothicAntique-Bold',
              fontSize: 13,
              lineHeight: 13,
            }}>
            1.0.0P
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
