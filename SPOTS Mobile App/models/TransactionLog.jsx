export default class TransactionLog {
    
    static tableName = "TRANSACTION_LOG"; 

    static type_info = "information";
    static type_error = "exception";
    static type_transaction = "transaction";

    constructor(id, log_date, officer_id, device_id, type, description) {
        this.id = id;
        this.log_date = log_date;
        this.officer_id = officer_id;
        this.device_id = device_id;
        this.type = type;
        this.description = description;
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id          INTEGER NOT NULL
                                    PRIMARY KEY AUTOINCREMENT
                                    UNIQUE,
                log_date    TEXT    NOT NULL,
                officer_id  INTEGER NOT NULL,
                device_id   TEXT    NOT NULL,
                type        TEXT    NOT NULL,
                description TEXT    NOT NULL
            )`,
            []
          );
        });
        console.log(`${this.tableName} table created successfully!`);
      } catch (error) {
        console.error(`Error creating ${this.tableName} table:`, error);
      }
    }

    static async insert(db, log) {
      try {
        await db.transaction(async tx => {
          await tx.executeSql(
            `INSERT OR REPLACE INTO ${this.tableName} (log_date, officer_id, device_id, type, description) 
            VALUES (?, ?, ?, ?, ?)`,
            [log.log_date, log.officer_id, log.device_id, log.type, log.description]
          );
        });
        console.log(`${this.tableName} with description: ${log.description} inserted successfully!`, log);
      } catch (error) {
        console.error(`Error inserting ${this.tableName} code:`, error);
      }
    }

    static async getAllLogs(db) {
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT * FROM ${this.tableName} ORDER BY id ASC`,
                  [],
                  (tx, results) => {
                      let { rows } = results;

                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push(new TransactionLog(
                            row.id, row.log_date, row.officer_id, row.device_id, row.type, row.description
                          ));
                      });
  
                      console.log("getAllLogs >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getAllLogs SQL query:", error);
                      reject(error); 
                  }
              );
          });
      });
    }
  

}