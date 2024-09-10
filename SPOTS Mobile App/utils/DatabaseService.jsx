import React, { useEffect } from 'react';
import { ToastAndroid } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import IOList from '../models/IOList';
import SynchLog from '../models/SynchLog';
import SystemCode from '../models/SystemCode';
import TIMSCountryCode from '../models/TIMSCountryCode';
import TIMSLocationCode from '../models/TIMSLocationCode';
import TIMSNationalityCode from '../models/TIMSNationalityCode';
import TIMSOffenceCode from '../models/TIMSOffenceCode';
import TIMSVehicleColor from '../models/TIMSVehicleColor';
import TIMSVehicleMake from '../models/TIMSVehicleMake';
import TIMSVehicleType from '../models/TIMSVehicleType';
import AccidentReport from '../models/AccidentReport';
import PartiesInvolved from '../models/PartiesInvolved';
import Summons from '../models/Summons';
import Images from '../models/Images';
import Officer from '../models/Officer';
import Offences from '../models/Offences';
import Offender from '../models/Offenders';
import TransactionLog from '../models/TransactionLog';

const databaseName = 'spots-tr.db';

class DatabaseService {

    initDatabase = async () => {
      try {
        const db = await SQLite.openDatabase(databaseName);
        this.db = db;
        console.log('Database opened successfully!');

        await IOList.createTable(db);
        await SynchLog.createTable(db);
        await TransactionLog.createTable(db);
        await SystemCode.createTable(db);
        await TIMSCountryCode.createTable(db);
        await TIMSLocationCode.createTable(db);
        await TIMSNationalityCode.createTable(db);
        await TIMSOffenceCode.createTable(db);
        await TIMSVehicleColor.createTable(db);
        await TIMSVehicleMake.createTable(db);
        await TIMSVehicleType.createTable(db);

        await Officer.createTable(db);
        await Summons.createTable(db);
        await AccidentReport.createTable(db);
        await PartiesInvolved.createTable(db);
        await Images.createTable(db);
        await Offences.createTable(db);
        await Offender.createTable(db);

      } catch (error) {
        console.error('Error opening database:', error);
      }
    };

    populateList = async () => {
      this.populateIOList();
      this.populateIncidentOccured();
      this.populateSex();
      this.populateLicenseClass();
      this.populateLicenseType();
      this.populateIdTypeCode();
      this.populateYesNo();
      this.populateYesNoUnknown();
      this.populateYesNoUnknown2();
      this.populateYesNoUnknown3();
      this.populateBreathalyserResult();
      this.populateVehicleCategory();
      this.populateHospitalName();
      this.populateAddressType();
      this.populateVehicleType();
      this.populateWeatherCode();
      this.populateRoadSurface();
      this.populateTrafficVolume();
      this.populateTIMSCountryCode();
      this.populateTIMSLocationCode();
      this.populateTIMSNationalityCode();
      this.populateTIMSOffenceCode();
      this.populateTIMSOffenceCodePedestrian();
      this.populateTIMSOffenceCodePedestrianCyclist();
      this.populateTIMSVehicleColor();
      this.populateTIMSVehicleMake();
      this.populateTIMSVehicleType();
      this.populateOperationType();
      this.populateDriverType();
      this.populateVehicleTransmission();
      this.populateSpeedDeviceUsed();
      this.populatePassengerType();
      this.populatePedestrianType();
      this.populateOperationType();

      ToastAndroid.show("Populate success", ToastAndroid.SHORT);
    }

    populateIOList = async () => {
        console.log("populateIOList");
        try {
            const codes = await IOList.getIOList(this.db);
            IOList.ioList = codes;

            console.log("ioList populated: " , IOList.ioList.length);
        } catch (error) {
            console.error('Error fetching iolist:', error);
        }
    };

    populateIncidentOccured = async () => {
      console.log("populateIncidentOccured");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("incidentOccured"));
          SystemCode.incidentOccured = codes;

          console.log("incidentOccured populated: " , SystemCode.incidentOccured.length);
      } catch (error) {
          console.error('Error fetching incidentOccured:', error);
      }
    };

    populateSex = async () => {
      console.log("populateSex");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("sex"));
          SystemCode.sex = codes;

          console.log("sex populated: " , SystemCode.sex.length);
      } catch (error) {
          console.error('Error fetching sex:', error);
      }
    };

    populateLicenseClass = async () => {
      console.log("populateLicenseClass");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("licenseClass"));
          SystemCode.licenseClass = codes;

          console.log("licenseClass populated: " , SystemCode.licenseClass.length);
      } catch (error) {
          console.error('Error fetching licenseClass:', error);
      }
    };

    populateLicenseType = async () => {
      console.log("populateLicenseType");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("licenseType"));
          SystemCode.licenseType = codes;

          console.log("licenseType populated: " , SystemCode.licenseType.length);
      } catch (error) {
          console.error('Error fetching licenseType:', error);
      }
    };

    populateIdTypeCode = async () => {
      console.log("populateIdTypeCode");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("idTypeCode"));
          SystemCode.idTypeCode = codes;

          console.log("idTypeCode populated: " , SystemCode.idTypeCode.length);
      } catch (error) {
          console.error('Error fetching idTypeCode:', error);
      }
    };

    populateYesNo = async () => {
      console.log("populateYesNo");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("yesNo"));
          SystemCode.yesNo = codes;

          console.log("yesNo populated: " , SystemCode.yesNo.length);
      } catch (error) {
          console.error('Error fetching yesNo:', error);
      }
    };

    populateYesNoUnknown2 = async () => {
      console.log("populateYesNoUnknown2");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("yesNoUnknown2"));
          SystemCode.yesNoUnknown2 = codes;

          console.log("populateYesNoUnknown2 populated: " , SystemCode.yesNoUnknown2.length);
      } catch (error) {
          console.error('Error fetching populateYesNoUnknown2:', error);
      }
    };

    populateYesNoUnknown3 = async () => {
      console.log("populateYesNoUnknown3");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("yesNoUnknown3"));
          SystemCode.yesNoUnknown3 = codes;

          console.log("populateYesNoUnknown3 populated: " , SystemCode.yesNoUnknown3.length);
      } catch (error) {
          console.error('Error fetching populateYesNoUnknown3:', error);
      }
    };

    populateYesNoUnknown = async () => {
      console.log("populateYesNoUnknown");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("yesNoUnknown"));
          SystemCode.yesNoUnknown = codes;

          console.log("yesNoUnknown populated: " , SystemCode.yesNoUnknown.length);
      } catch (error) {
          console.error('Error fetching yesNoUnknown:', error);
      }
    };

    populateBreathalyserResult = async () => {
      console.log("populateBreathalyserResult");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("breathalyserResult"));
          SystemCode.breathalyserResult = codes;

          console.log("breathalyserResult populated: " , SystemCode.breathalyserResult.length);
      } catch (error) {
          console.error('Error fetching breathalyserResult:', error);
      }
    };

    populateVehicleCategory = async () => {
      console.log("populateVehicleCategory");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("vehicleCategory"));
          SystemCode.vehicleCategory = codes;

          console.log("vehicleCategory populated: " , SystemCode.vehicleCategory.length);
      } catch (error) {
          console.error('Error fetching vehicleCategory:', error);
      }
    };

    populateHospitalName = async () => {
      console.log("populateHospitalName");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("hospitalName"));
          SystemCode.hospitalName = codes;

          console.log("hospitalName populated: " , SystemCode.hospitalName.length);
      } catch (error) {
          console.error('Error fetching hospitalName:', error);
      }
    };

    populateAddressType = async () => {
      console.log("populateAddressType");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("addressType"));
          SystemCode.addressType = codes;

          console.log("addressType populated: " , SystemCode.addressType.length);
      } catch (error) {
          console.error('Error fetching addressType:', error);
      }
    };

    populateWeatherCode = async () => {
      console.log("populateWeatherCode");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("weatherCode"));
          SystemCode.weatherCode = codes;

          console.log("weatherCode populated: " , SystemCode.weatherCode.length);
      } catch (error) {
          console.error('Error fetching weatherCode:', error);
      }
    };

    populateRoadSurface = async () => {
      console.log("populateRoadSurface");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("roadSurface"));
          SystemCode.roadSurface = codes;

          console.log("roadSurface populated: " , SystemCode.roadSurface.length);
      } catch (error) {
          console.error('Error fetching roadSurface:', error);
      }
    };

    populateTrafficVolume = async () => {
      console.log("populateTrafficVolume");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("trafficVolume"));
          SystemCode.trafficVolume = codes;

          console.log("trafficVolume populated: " , SystemCode.roadSurface.length);
      } catch (error) {
          console.error('Error fetching trafficVolume:', error);
      }
    };

    populateTIMSCountryCode = async () => {
      console.log("populateTIMSCountryCode");
      try {
          const codes = await TIMSCountryCode.getTIMSCountryCode(this.db);
          TIMSCountryCode.timsCountryCode = codes;

          console.log("timsCountryCode populated: " , TIMSCountryCode.timsCountryCode.length);
      } catch (error) {
          console.error('Error fetching timsCountryCode:', error);
      }
    };

    populateTIMSLocationCode = async () => {
      console.log("populateTIMSLocationCode");
      try {
          const codes = await TIMSLocationCode.getTIMSLocationCode(this.db);
          TIMSLocationCode.timsLocationCode = codes;

          console.log("timsLocationCode populated: " , TIMSLocationCode.timsLocationCode.length);
      } catch (error) {
          console.error('Error fetching timsLocationCode:', error);
      }
    };

    populateTIMSNationalityCode = async () => {
      console.log("populateTIMSNationalityCode");
      try {
          const codes = await TIMSNationalityCode.getTIMSNationalityCode(this.db);
          TIMSNationalityCode.timsNationalityCode = codes;

          console.log("timsNationalityCode populated: " , TIMSNationalityCode.timsNationalityCode.length);
      } catch (error) {
          console.error('Error fetching timsNationalityCode:', error);
      }
    };

    populateTIMSOffenceCode = async () => {
      console.log("populateTIMSOffenceCode");
      try {
          const codes = await TIMSOffenceCode.getAllTIMSOffenceCode(this.db);
          TIMSOffenceCode.timsOffenceCode = codes;

          console.log("timsOffenceCode populated: " , TIMSOffenceCode.timsOffenceCode.length);
      } catch (error) {
          console.error('Error fetching timsOffenceCode:', error);
      }
    };

    populateTIMSOffenceCodePedestrian = async () => {
      console.log("populateTIMSOffenceCodePedestrian");
      try {
          const codes = await TIMSOffenceCode.getAllTIMSOffenceCodePedestrian(this.db);
          TIMSOffenceCode.timsOffenceCodePedestrian = codes;

          console.log("timsOffenceCodePedestrian populated: " , TIMSOffenceCode.timsOffenceCodePedestrian.length);
      } catch (error) {
          console.error('Error fetching timsOffenceCodePedestrian:', error);
      }
    };

    populateTIMSOffenceCodePedestrianCyclist = async () => {
      console.log("populateTIMSOffenceCodeSummons");
      try {
          const codes = await TIMSOffenceCode.getTIMSOffenceCodePedestrianCyclist(this.db);
          TIMSOffenceCode.timsOffenceCodePedestrianCyclist = codes;

          console.log("timsOffenceCodeSummons populated: " , TIMSOffenceCode.timsOffenceCode.length);
      } catch (error) {
          console.error('Error fetching timsOffenceCodeSummons:', error);
      }
    };

    populateTIMSVehicleColor = async () => {
      console.log("populateTIMSVehicleColor");
      try {
          const codes = await TIMSVehicleColor.getTIMSVehicleColor(this.db);
          TIMSVehicleColor.timsVehicleColor = codes;

          console.log("timsVehicleColor populated: " , TIMSVehicleColor.timsVehicleColor.length);
      } catch (error) {
          console.error('Error fetching timsVehicleColor:', error);
      }
    };

    populateTIMSVehicleMake = async () => {
      console.log("populateTIMSVehicleMake");
      try {
          const codes = await TIMSVehicleMake.getTIMSVehicleMake(this.db);
          TIMSVehicleMake.timsVehicleMake = codes;

          console.log("timsVehicleMake populated: " , TIMSVehicleMake.timsVehicleMake.length);
      } catch (error) {
          console.error('Error fetching timsVehicleMake:', error);
      }
    };

    populateTIMSVehicleType = async () => {
      console.log("populateTIMSVehicleType");
      try {
          const codes = await TIMSVehicleType.getTIMSVehicleType(this.db);
          TIMSVehicleType.timsVehicleType = codes;

          console.log("timsVehicleType populated: " , TIMSVehicleType.timsVehicleType.length);
      } catch (error) {
          console.error('Error fetching timsVehicleType:', error);
      }
    };

    populateVehicleType = async () => {
      console.log("populateVehicleType");

      //use this instead
      //const excludeIds = [4, 5, 7, 10, 12, 16];

      //added for AM Novel Devices (TEST)
      const excludeIds = [4, 5, 7, 10, 12, 16, 20,21,22,23,24,25];

      try {
          const codes = await SystemCode.getSystemCodeByTypeExcludeID(this.db, SystemCode.getCodeValue("vehicleType"), excludeIds);
          SystemCode.vehicleType = codes;

          console.log("vehicleType populated: " , SystemCode.vehicleType.length);
      } catch (error) {
          console.error('Error fetching vehicleType:', error);
      }
    };

    populateOperationType = async () => {
      console.log("populateOperationType");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("operationType"));
          SystemCode.operationType = codes;

          console.log("operationType populated: " , SystemCode.operationType.length);
      } catch (error) {
          console.error('Error fetching operationType:', error);
      }
    };

    populateDriverType = async () => {
      console.log("populateDriverType");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("driverType"));
          SystemCode.driverType = codes;

          console.log("populateDriverType populated: " , SystemCode.driverType.length);
      } catch (error) {
          console.error('Error fetching populateDriverType:', error);
      }
    };

    populateVehicleTransmission = async () => {
      console.log("populateVehicleTransmission");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("vehicleTransmission"));
          SystemCode.vehicleTransmission = codes;

          console.log("vehicleTransmission populated: " , SystemCode.vehicleTransmission.length);
      } catch (error) {
          console.error('Error fetching vehicleTransmission:', error);
      }
    };

    populateSpeedDeviceUsed = async () => {
      console.log("populateSpeedDeviceUsed");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("speedDevice"));
          SystemCode.speedDevice = codes;

          console.log("populateSpeedDeviceUsed populated: " , SystemCode.speedDevice.length);
      } catch (error) {
          console.error('Error fetching populateSpeedDeviceUsed:', error);
      }
    };

    populatePassengerType = async () => {
      console.log("populatePassengerType");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("passengerType"));
          SystemCode.passengerType = codes;

          console.log("populatePassengerType populated: " , SystemCode.passengerType.length);
      } catch (error) {
          console.error('Error fetching populatePassengerType:', error);
      }
    };

    populatePedestrianType = async () => {
      console.log("populatePedestrianType");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("pedestrianType"));
          SystemCode.pedestrianType = codes;

          console.log("populatePedestrianType populated: " , SystemCode.pedestrianType.length);
      } catch (error) {
          console.error('Error fetching populatePedestrianType:', error);
      }
    };

    populateOperationType = async () => {
      console.log("populateOperationType");
      try {
          const codes = await SystemCode.getSystemCodeByType(this.db, SystemCode.getCodeValue("operationType"));
          SystemCode.operationType = codes;

          console.log("populateOperationType populated: " , SystemCode.operationType.length);
      } catch (error) {
          console.error('Error fetching populateOperationType:', error);
      }
    };

    wipeOutTransactional = async () => {
      console.log(`wipeOutTransactional`);

      const aTables = [
        "ACCIDENT_REPORT",
        "IMAGES",
        "OFFENCES",
        "OFFENDER",
        "OFFICER",
        "PARTIES_INVOLVED",
        "SUMMONS",
        "TRANSACTION_LOG"
      ];

      for (let tableName of aTables) {
        try {
            console.log(`deleteRecordsFromTable ${tableName}`);
            await this.deleteRecordsFromTable(this.db, tableName);
        } catch (error) {
            console.error(`Failed to delete records from table ${tableName}:`, error);
            return false;
        }
      }

      console.log("All specified tables have been wiped out.");
      return true;
    }

    async deleteRecordsFromTable(db, tableName) {
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `DELETE FROM ${tableName}`, // Delete all records from the table
                  [],
                  (tx, results) => {
                      console.log(`All records deleted from ${tableName}`);
                      resolve(true);
                  },
                  (tx, error) => {
                      console.error(`Error executing delete on table ${tableName}:`, error);
                      reject(error);
                  }
              );
          });
      });
    }
}

export default new DatabaseService();