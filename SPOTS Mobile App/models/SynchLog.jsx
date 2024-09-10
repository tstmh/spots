export default class SynchLog {
    
    static tableName = "SYNCH_LOG"; 
    static synchLog = [];

    constructor(TABLE_NAME, CHANGED_AT) {
        this.TABLE_NAME = TABLE_NAME;
        this.CHANGED_AT = CHANGED_AT;
    }

    static fromRow(row) {
        return new SynchLog(row.TABLE_NAME, row.CHANGED_AT);
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
              TABLE_NAME PRIMARY KEY,
              CHANGED_AT TEXT
            )`,
            []
          );
        });
        console.log(`${this.tableName} table created successfully!`);
      } catch (error) {
        console.error(`Error creating ${this.tableName} table:`, error);
      }
    }

    static async insert(db, tableName, changedAt) {
      try {
        await db.transaction(async tx => {
          await tx.executeSql(
            `INSERT OR REPLACE INTO ${this.tableName} (TABLE_NAME, CHANGED_AT) VALUES (?, ?)`,
            [tableName, changedAt]
          );
        });
        //console.log(`SYNCH_LOG code with code: ${codeData.ID} inserted successfully!`);
      } catch (error) {
        console.error(`Error inserting ${this.tableName} code:`, error);
      }
    }

    static async getSynchLogsFromTable(db, tableName) {
      console.log("getSynchLogsFromTable >> tableName: ", tableName);
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT CHANGED_AT FROM ${this.tableName} WHERE TABLE_NAME = ? ORDER BY CHANGED_AT DESC LIMIT 1`,
                  [tableName],
                  (tx, results) => {
                      let { rows } = results;
  
                      if (rows.length > 0) {
                          const latestRow = rows.item(0); // Get the latest row
                          const changedAt = latestRow.CHANGED_AT; // Retrieve CHANGED_AT value
                          //console.log("Latest CHANGED_AT value: ", changedAt);
                          resolve(changedAt);
                      } else {
                          console.log(`No rows found for the given ${this.tableName}.`);
                          resolve(null); 
                      }
                  },
                  (tx, error) => {
                      console.error("Error executing getSynchLogsFromTable SQL query:", error);
                      reject(error); 
                  }
              );
          });
      });
    }
  

}