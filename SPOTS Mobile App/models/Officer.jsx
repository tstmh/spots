export default class Officer {
    static tableName = "OFFICER"; 

    constructor(NRIC_NO, OFFICER_NAME, OFFICER_RANK, OFFICER_TEAM, SITE_ID, GENDER_CODE,
        PHONE_NO, OFFICER_ID) {
        this.NRIC_NO = NRIC_NO;
        this.OFFICER_NAME = OFFICER_NAME;
        this.OFFICER_RANK = OFFICER_RANK;
        this.OFFICER_TEAM = OFFICER_TEAM;
        this.SITE_ID = SITE_ID;
        this.GENDER_CODE = GENDER_CODE;
        this.PHONE_NO = PHONE_NO;
        this.OFFICER_ID = OFFICER_ID;
    }

    static async createTable(db) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `CREATE TABLE ${this.tableName} (
                        NRIC_NO      TEXT    NOT NULL UNIQUE,
                        OFFICER_NAME TEXT    NOT NULL,
                        OFFICER_RANK TEXT,
                        OFFICER_TEAM TEXT,
                        SITE_ID      BLOB    NOT NULL,
                        GENDER_CODE  INTEGER,
                        PHONE_NO     TEXT,
                        OFFICER_ID   INTEGER,
                        PRIMARY KEY (
                            NRIC_NO
                        )
                    ); ` ,
                    []
                );
            });
            console.log(`${this.tableName} table created successfully!`);
        } catch (error) {
            console.error(`Error creating ${this.tableName} table:`, error);
        }
    }

    static async insert(db, Officer) {
        console.log("insertReplaceOfficer ", Officer);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        NRIC_NO,
                        OFFICER_NAME,
                        OFFICER_RANK,
                        OFFICER_TEAM,
                        SITE_ID,
                        GENDER_CODE,
                        PHONE_NO,
                        OFFICER_ID
                    )
                    VALUES (?,?,?,?,?,?,?,?)`,
                    [
                        Officer.NRIC_NO, Officer.OFFICER_NAME, Officer.OFFICER_RANK, Officer.OFFICER_TEAM, 
                        Officer.SITE_ID, Officer.GENDER_CODE, Officer.PHONE_NO, Officer.OFFICER_ID
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${Officer.NRIC_NO} inserted successfully!`);
                        console.log("Insert result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error inserting ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error inserting ${this.tableName}:`, error);
        }
    };

    static async deleteOfficer(db, id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE NRIC = ?`,
                    [id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteOfficer SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getAll(db) {
        console.log("getAllOfficers");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName}`,
                    [],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Officer(
                                row.NRIC_NO, row.OFFICER_NAME, row.OFFICER_RANK, row.OFFICER_TEAM, 
                                row.SITE_ID, row.GENDER_CODE, row.PHONE_NO, row.OFFICER_ID));
                        });

                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getAllOfficers SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

}