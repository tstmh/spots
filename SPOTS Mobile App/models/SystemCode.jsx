export default class SystemCode {
    static tableName = "system_code";
    static incidentOccured = [];
    static sex = [];
    static licenseClass = [];
    static licenseType = [];
    static idTypeCode = [];
    static yesNo = [];
    static yesNoUnknown = [];
    static yesNoUnknown2 = [];
    static yesNoUnknown3 = [];
    static breathalyserResult = [];
    static vehicleCategory = [];
    static hospitalName = [];
    static addressType = [];
    static vehicleType = [];
    static weatherCode = [];
    static roadSurface = [];
    static trafficVolume = [];
    static offenderType = [];
    static vehicleTransmission = [];
    static operationType = [];
    static speedDevice = [];
    static driverType = [];
    static passengerType = [];
    static pedestrianType = [];
    static operationType = [];

    constructor(code, key, value, created_by, created_time, modified_time, prefix,
      description, delete_flag, sequence, modified_by) {
        this.code = code;
        this.key = key;
        this.value = value;
        this.created_by = created_by;
        this.created_time = created_time;
        this.modified_time = modified_time;
        this.prefix = prefix;
        this.description = description;
        this.delete_flag = delete_flag;
        this.sequence = sequence;
        this.modified_by = modified_by;
    }
    
    static getCodeValue(name) {
      const codesMapping = {
          "weatherCode": 1,
          "roadSurface": 2,
          "trafficVolume": 3,
          "sex": 4,
          "yesNo": 5,
          "hospitalName": 6,
          "addressType": 7,
          "licenseType": 8,
          "licenseClass": 9,
          "idTypeCode": 10,
          "vehicleTransmission": 11,
          "pedestrianType": 12,
          //"speedLimiter",
          "speedDevice": 14,
          // "speedDummy", 
          "yesNoUnknown": 15,
          "specialZone": 16,
          "yesNoUnknown2": 17,
          "vehicleType": 18,
          "vehicleCategory": 19,
          "yesNoUnknown3": 20,
          "yesNoUnknown4": 21,
          "incidentOccured": 22,
          "summonsType": 23, 
          "driverType": 24,
          "passengerType": 25,
          "breathalyserResult": 26,
          "operationType": 32,
          "offenderType": 34,
          //"vehOwner":34, 
          //"offenderIDType", // added as dummy
          "idTypeCodeOSI": 35
      };

      if (codesMapping.hasOwnProperty(name)) {
          return codesMapping[name];
      } else {
          return null;
      }
  }

    static fromRow(row) {
        return new SystemCode(row.code, row.key, row.value, row.created_by, row.created_time,
        row.modified_time, row.prefix, row.description, row.delete_flag, row.sequence, row.modified_by);
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
              code          TEXT,
              [key]         TEXT,
              value         TEXT,
              created_by    TEXT,
              created_time  TEXT,
              modified_time TEXT,
              prefix        TEXT,
              description   TEXT,
              delete_flag   TEXT,
              sequence      TEXT,
              modified_by   TEXT,
              PRIMARY KEY (code, [key])
          );`,
            []
          );
        });
        console.log(`${this.tableName} table created successfully!`);
      } catch (error) {
        console.error(`Error creating ${this.tableName} table:`, error);
      }
    }

    static async insert(db, codeData) {
      try {
        await db.transaction(async tx => {
          await tx.executeSql(
            `INSERT OR REPLACE INTO ${this.tableName} (code, key, value, created_by, created_time, modified_time, prefix, description, delete_flag, sequence, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codeData.code, codeData.key, codeData.value, codeData.created_by, codeData.created_time, codeData.modified_time, codeData.prefix, codeData.description, codeData.delete_flag, codeData.sequence, codeData.modified_by]
          );
        });
        //console.log(`System code with code: ${codeData.code} inserted successfully!`);
      } catch (error) {
        console.error(`Error inserting system code:`, error);
      }
    }

    static async getSystemCodeByType(db, code) {
      //console.log("getSystemCodeByType >> code: ", code);
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT key, value FROM ${this.tableName} where delete_flag = 0 and code = ? ORDER BY LENGTH(key), key`,
                  [code],
                  (tx, results) => {
                      let { rows } = results;
  
                      //console.log("getSystemCodeByType >> results: ", rows);
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                        list.push({
                              value: row.key,
                              label: row.value.toUpperCase()
                          });
                      });
  
                      //console.log("getSystemCodeByType >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getSystemCodeByType SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }

    static async getSystemCodeByTypeExcludeID(db, code, excludeIds = []) {
      //console.log("getSystemCodeByType >> code: ", code);
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              // Base query
              let query = `SELECT key, value FROM ${this.tableName} WHERE delete_flag = 0 AND code = ?`;
              let queryParams = [code];

              // Check if excludeIds is provided and not empty
              if (excludeIds && excludeIds.length > 0) {
                  // Create a string of placeholders for the ID values
                  const placeholders = excludeIds.map(() => '?').join(',');
                  // Add the NOT IN clause to the query
                  query += ` AND key NOT IN (${placeholders})`;
                  // Add the excludeIds to the query parameters
                  queryParams = queryParams.concat(excludeIds);
              }

              // Complete the query
              query += ` ORDER BY LENGTH(key), key`;

              tx.executeSql(
                  query,
                  queryParams,
                  (tx, results) => {
                      let { rows } = results;
                      let list = [];
  
                      rows.raw().forEach(row => {
                        list.push({
                              value: row.key,
                              label: row.value.toUpperCase()
                          });
                      });
  
                      //console.log("getSystemCodeByType >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getSystemCodeByType SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }

}