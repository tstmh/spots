export default class TIMSOffenceCode {
    static tableName = "tims_offence_code";
    static summonsPedestrian = "7";
    static summonsPedalCyclist = "8";
    static timsOffenceCode = [];
    static timsOffenceCodePedestrian = [];
    static timsOffenceCodePedestrianCyclist = [];


    //6 - Pedestrian
    //7 - Pedal Cyclist
    // 7 = pedestrian ; 8 = pedal cyclist
    
    constructor(code, fine_amount, demerit_point, charge_indicator, caption, offence_type,
    effective_date, created, modified, delete_flag, school_zone_indicator, vehicle_category,
    common_offence, exceeding_minimum_speed, exceeding_maximum_speed, offender_type, road_speed_limit) {
        this.code = code;
        this.fine_amount = fine_amount;
        this.demerit_point = demerit_point;
        this.charge_indicator = charge_indicator;
        this.caption = caption;
        this.offence_type = offence_type;
        this.effective_date = effective_date;
        this.created = created;
        this.modified = modified;
        this.delete_flag = delete_flag;
        this.school_zone_indicator = school_zone_indicator;
        this.vehicle_category = vehicle_category;
        this.common_offence = common_offence;
        this.exceeding_minimum_speed = exceeding_minimum_speed;
        this.exceeding_maximum_speed = exceeding_maximum_speed;
        this.offender_type = offender_type;
        this.road_speed_limit = road_speed_limit;
    }

    static fromRow(row) {
        return new TIMSOffenceCode(row.code, row.fine_amount, row.demerit_point, row.charge_indicator,
        row.caption, row.offence_type, row.effective_date, row.created, row.modified, row.delete_flag,
        row.school_zone_indicator, row.vehicle_category, row.common_offence, row.exceeding_minimum_speed,
        row.exceeding_maximum_speed, row.offender_type, row.road_speed_limit);
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
              code TEXT PRIMARY KEY,
              fine_amount REAL,
              demerit_point INTEGER,
              charge_indicator TEXT,
              caption TEXT,
              offence_type TEXT,
              effective_date DATETIME,
              created DATETIME,
              modified DATETIME,
              delete_flag INTEGER,
              school_zone_indicator TEXT,
              speeding_offence_indicator TEXT,
              vehicle_category TEXT,
              common_offence INTEGER,
              exceeding_minimum_speed INTEGER,
              exceeding_maximum_speed INTEGER,
              offender_type TEXT,
              road_speed_limit INTEGER
            )`,
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
            `INSERT OR REPLACE INTO ${this.tableName} (code, fine_amount, demerit_point, charge_indicator, caption, offence_type, effective_date, 
              created, modified, delete_flag, school_zone_indicator, speeding_offence_indicator, vehicle_category, common_offence, 
              exceeding_minimum_speed, exceeding_maximum_speed, offender_type, road_speed_limit) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codeData.code, codeData.fine_amount, codeData.demerit_point, codeData.charge_indicator, codeData.caption, codeData.offence_type, 
              codeData.effective_date, codeData.created, codeData.modified, codeData.delete_flag, codeData.school_zone_indicator,
              codeData.speeding_offence_indicator, codeData.vehicle_category, codeData.common_offence, codeData.exceeding_minimum_speed, 
              codeData.exceeding_maximum_speed, codeData.offender_type, codeData.road_speed_limit]
          );
        });
        //console.log(`${this.tableName} with code: ${codeData.code} inserted successfully!`);
      } catch (error) {
        console.error(`Error inserting ${this.tableName}:`, error);
      }
    }

    static async getTIMSOffenceCode(db) {
      console.log("getTIMSOffenceCode");
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
                  `SELECT code, caption FROM ${this.tableName} where delete_flag = 0`,
                  [],
                  (tx, results) => {
                      let { rows } = results;
  
                      //console.log("getTIMSOffenceCode >> results: ", rows);
                      //console.log(rows.raw());
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push({
                              value: row.code,
                              label: row.caption.toUpperCase()
                          });
                      });
  
                      //console.log("getTIMSOffenceCode >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getTIMSOffenceCode SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }

    static async getAllTIMSOffenceCode(db) {
      console.log("getAllTIMSOffenceCode");
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
                  `SELECT * FROM ${this.tableName} where delete_flag = 0`,
                  [],
                  (tx, results) => {
                      let { rows } = results;
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push(new TIMSOffenceCode(
                            row.code, row.fine_amount, row.demerit_point, row.charge_indicator,
                            row.caption, row.offence_type, row.effective_date, row.created, row.modified, row.delete_flag,
                            row.school_zone_indicator, row.vehicle_category, row.common_offence, row.exceeding_minimum_speed,
                            row.exceeding_maximum_speed, row.offender_type, row.road_speed_limit
                          ));
                      });
  
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getAllTIMSOffenceCode SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }

    static async getAllTIMSOffenceCodeByCode(db, code) {
      console.log(`getAllTIMSOffenceCodeByCode ${code}`);
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              console.log(`Executing transaction for code: ${code}`);
              tx.executeSql(
                  `SELECT * FROM ${this.tableName} WHERE delete_flag = 0 AND code = ?`,
                  [code],
                  (tx, results) => {
                      console.log(`getAllTIMSOffenceCodeByCode ${code} results >> `, results);
                      let { rows } = results;
                      if (rows.length > 0) {
                          let row = rows.item(0);
                          let offenceCode = new TIMSOffenceCode(
                              row.code, row.fine_amount, row.demerit_point, row.charge_indicator,
                              row.caption, row.offence_type, row.effective_date, row.created, row.modified, row.delete_flag,
                              row.school_zone_indicator, row.vehicle_category, row.common_offence, row.exceeding_minimum_speed,
                              row.exceeding_maximum_speed, row.offender_type, row.road_speed_limit
                          );
                          console.log(`getAllTIMSOffenceCodeByCode ${code} offenceCode >> `, offenceCode);
                          resolve(offenceCode);
                      } else {
                          resolve(null);  
                      }
                  },
                  (tx, error) => {
                      console.error("Error executing getAllTIMSOffenceCodeByCode SQL query:", error);
                      reject(error);
                  }
              );
          }, (transactionError) => {
              console.error("getAllTIMSOffenceCodeByCode Transaction error: ", transactionError);
              reject(transactionError);
          });
      });
    }
  
    static async getAllTIMSOffenceCodePedestrian(db) {
      console.log("getAllTIMSOffenceCodePedestrian");
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
              `SELECT * FROM ${this.tableName} WHERE delete_flag = 0 AND caption NOT LIKE ? AND caption NOT LIKE ?`,
              ['%SPEEDING%', '%DRUG%'],
                  (tx, results) => {
                      let { rows } = results;
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push(new TIMSOffenceCode(
                            row.code, row.fine_amount, row.demerit_point, row.charge_indicator,
                            row.caption, row.offence_type, row.effective_date, row.created, row.modified, row.delete_flag,
                            row.school_zone_indicator, row.vehicle_category, row.common_offence, row.exceeding_minimum_speed,
                            row.exceeding_maximum_speed, row.offender_type, row.road_speed_limit
                          ));
                      });
  
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getAllTIMSOffenceCodePedestrian SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }

    static async getTIMSOffenceCodePedestrianCyclist(db) {
      console.log("getTIMSOffenceCodePedestrianCyclist");
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT * FROM ${this.tableName} where delete_flag = 0 and offender_type in (?, ?)`,
                  [this.summonsPedestrian, this.summonsPedalCyclist],
                  (tx, results) => {
                      let { rows } = results;
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                        list.push(new TIMSOffenceCode(
                          row.code, row.fine_amount, row.demerit_point, row.charge_indicator,
                          row.caption, row.offence_type, row.effective_date, row.created, row.modified, row.delete_flag,
                          row.school_zone_indicator, row.vehicle_category, row.common_offence, row.exceeding_minimum_speed,
                          row.exceeding_maximum_speed, row.offender_type, row.road_speed_limit
                        ));
                      });
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getTIMSOffenceCodePedestrianCyclist SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }

    static async getAllTIMSSpeedingOffenceCodes(db) {
      console.log("getAllTIMSOffenceCodePedestrian");
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
              `SELECT * FROM ${this.tableName} WHERE delete_flag = 0 AND caption LIKE ?`,
              ['%SPEEDING%'],
                  (tx, results) => {
                      let { rows } = results;
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push(new TIMSOffenceCode(
                            row.code, row.fine_amount, row.demerit_point, row.charge_indicator,
                            row.caption, row.offence_type, row.effective_date, row.created, row.modified, row.delete_flag,
                            row.school_zone_indicator, row.vehicle_category, row.common_offence, row.exceeding_minimum_speed,
                            row.exceeding_maximum_speed, row.offender_type, row.road_speed_limit
                          ));
                      });
  
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getAllTIMSOffenceCodePedestrian SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }
}