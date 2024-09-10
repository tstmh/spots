export default class TIMSCountryCode {
    static tableName = "tims_country_code";
    static timsCountryCode = [];

    constructor(code, description, created, modified, delete_flag, sequence) {
        this.code = code;
        this.description = description;
        this.created = created;
        this.modified = modified;
        this.delete_flag = delete_flag;
        this.sequence = sequence;
    }

    static fromRow(row) {
        return new TIMSCountryCode(row.code, row.description, row.created, row.modified, row.delete_flag, row.sequence);
    }

    static async createTable(db) {
      try{
        await db.transaction(async tx => {
          await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                code TEXT PRIMARY KEY,
                description TEXT,
                created TEXT,
                modified TEXT,
                delete_flag TEXT,
                sequence INTEGER
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
            `INSERT OR REPLACE INTO ${this.tableName} (code, description, created, modified, delete_flag, sequence) VALUES (?, ?, ?, ?, ?, ?)`,
            [codeData.code, codeData.description, codeData.created, codeData.modified, codeData.delete_flag, codeData.sequence]
          );
        });
        //console.log(`${this.tableName} with code: ${codeData.code} inserted successfully!`);
      } catch (error) {
        console.error(`Error inserting ${this.tableName}:`, error);
      }
    }

    static async getTIMSCountryCode(db) {
      console.log("getTIMSCountryCode");
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT code, description FROM ${this.tableName} where delete_flag = 0 order by description asc`,
                  [],
                  (tx, results) => {
                      let { rows } = results;
  
                      // console.log("getTIMSCountryCode >> results: ", rows);
                      // console.log("getTIMSCountryCode >>", rows.raw());
  
                      let list = [];
  
                      rows.raw().forEach(row => {
                          list.push({
                              value: row.code,
                              label: row.description.toUpperCase()
                          });
                      });

                      // Sort list to make 'SINGAPORE' the first item
                      list.sort((a, b) => {
                        if (a.label === "SINGAPORE") return -1; // Move SINGAPORE to the top
                        if (b.label === "SINGAPORE") return 1;  // Keep SINGAPORE at the top
                        return a.label.localeCompare(b.label);   // Default sorting
                      });
  
                      //console.log("getTIMSCountryCode >> ", list);
                      resolve(list);
                  },
                  (tx, error) => {
                      console.error("Error executing getTIMSCountryCode SQL query:", error);
                      reject(error);
                  }
              );
          });
      });
    }
}