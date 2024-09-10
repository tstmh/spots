export default class TIMSLocationCode {
    static tableName = "tims_location_code";
    static timsLocationCode = [];
    
    constructor(code, description, code_type, speed_limit, created, modified, delete_flag, silver_zone, effective_date) {
        this.code = code;
        this.description = description;
        this.code_type = code_type;
        this.speed_limit = speed_limit;
        this.created = created;
        this.modified = modified;
        this.delete_flag = delete_flag;
        this.silver_zone = silver_zone;
        this.effective_date = effective_date;
    }

    static fromRow(row) {
        return new TIMSLocationCode(row.code, row.description, row.code_type, row.speed_limit, row.created,
        row.modified, row.delete_flag, row.silver_zone, row.effective_date);
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                code TEXT PRIMARY KEY,
                description TEXT,
                code_type TEXT,
                speed_limit TEXT,
                created TEXT,
                modified TEXT,
                delete_flag TEXT,
                silver_zone TEXT,
                effective_date TEXT
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
            `INSERT OR REPLACE INTO ${this.tableName} (code, description, code_type, speed_limit, created, modified, delete_flag, silver_zone, effective_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codeData.code, codeData.description, codeData.code_type, codeData.speed_limit, codeData.created, codeData.modified, codeData.delete_flag, codeData.silver_zone, codeData.effective_date]
          );
        });
        //console.log(`${this.tableName} with code: ${codeData.code} inserted successfully!`);
      } catch (error) {
        console.error(`Error inserting ${this.tableName}:`, error);
      }
    }

    static async getTIMSLocationCode(db) {
      console.log("getTIMSLocationCode");
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT code, description FROM ${this.tableName} where delete_flag = 0 order by description asc`,
                  [],
                  (tx, results) => {
                      let { rows } = results;
  
                      //console.log("getTIMSLocationCode >> results: ", rows);
                      //console.log(rows.raw());
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push({
                              value: row.code,
                              label: row.description.toUpperCase()
                          });
                      });
  
                      //console.log("getTIMSLocationCode >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getTIMSLocationCode SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }

    static async getLocationDescByCode(db, code) {
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT description FROM ${this.tableName} WHERE code = ?`,
                  [code],
                  (tx, results) => {
                      if (results.rows.length > 0) {
                          resolve(results.rows.item(0).description);
                      } else {
                          resolve(null); 
                      }
                  },
                  (tx, error) => {
                      console.error("Error executing getLocationDescByCode SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }
}