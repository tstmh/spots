export default class IOList {

    static tableName = "io_list"; 
    static ioList = [];

    constructor(io_id, io_name, io_name_email, modified) {
        this.io_id = io_id;
        this.io_name = io_name;
        this.io_name_email = io_name_email;
        this.modified = modified;
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                io_id INTEGER PRIMARY KEY,
                io_name TEXT,
                io_name_email TEXT,
                modified TEXT
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
            `INSERT OR REPLACE INTO ${this.tableName} (io_id, io_name, io_name_email, modified) VALUES (?, ?, ?, ?)`,
            [codeData.io_id, codeData.io_name, codeData.io_name_email, codeData.modified]
          );
        });
        //console.log(`IO entry with ID: ${codeData.io_id} inserted successfully!`);
      } catch (error) {
        console.error('Error inserting IO entry:', error);
      }
    }

    static async getIOList(db) {
      console.log("getIOList");
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT io_id, io_name_email FROM ${this.tableName} order by io_name_email asc`,
                  [],
                  (tx, results) => {
                      let { rows } = results;
  
                      //console.log("getIOList >> results: ", rows);
                      //console.log(rows.raw());
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push({
                              value: row.io_id,
                              label: row.io_name_email.toUpperCase()
                          });
                      });
  
                      console.log("getIOList ioList >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getIOList SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }
  
    static async getIONameById(db, io_id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT io_name FROM ${this.tableName} WHERE io_id = ?`,
                    [io_id],
                    (tx, results) => {
                        if (results.rows.length > 0) {
                            resolve(results.rows.item(0).io_name);
                        } else {
                            resolve(null); 
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getIONameById SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

}