export default class TIMSVehicleMake {
    static tableName = "tims_vehicle_make";
    static timsVehicleMake = [];

    constructor(code, description, created, modified, delete_flag, sequence) {
        this.code = code;
        this.description = description;
        this.created = created;
        this.modified = modified;
        this.delete_flag = delete_flag;
        this.sequence = sequence;
    }

    static fromRow(row) {
        return new TIMSVehicleMake(row.code, row.description, row.created, row.modified, row.delete_flag, row.sequence);
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
              code        TEXT    PRIMARY KEY,
              description TEXT,
              created     TEXT,
              modified    TEXT,
              delete_flag TEXT,
              sequence    INTEGER
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
            `INSERT OR REPLACE INTO ${this.tableName} (code, description, created, modified, delete_flag, sequence) VALUES (?, ?, ?, ?, ?, ?)`,
            [codeData.code, codeData.description, codeData.created, codeData.modified, codeData.delete_flag, codeData.sequence]
          );
        });
        //console.log(`${this.tableName} with code: ${codeData.code} inserted successfully!`);
      } catch (error) {
        console.error(`Error inserting ${this.tableName}:`, error);
      }
    }

    static async getTIMSVehicleMake(db) {
      console.log("getTIMSVehicleMake");
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT code, description FROM ${this.tableName} where delete_flag = 0 order by description asc`,
                  [],
                  (tx, results) => {
                      let { rows } = results;
  
                      //console.log("getTIMSVehicleMake >> results: ", rows);
                      //console.log(rows.raw());
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push({
                              value: row.code,
                              label: row.description.toUpperCase()
                          });
                      });
  
                      //console.log("getTIMSVehicleMake >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getTIMSVehicleMake SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }
}