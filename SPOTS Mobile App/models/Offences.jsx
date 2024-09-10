export default class Offences {
    static tableName = "OFFENCES";

    constructor(ID,OFFENDER_ID,SUMMONS_ID,SPOTS_ID,OFFENCE_TYPE_ID,OFFENCE_DATE,OFFENCE_TIME,REMARKS,
        SPEED_CLOCKED,SPEED_LIMIT,ROAD_LIMIT,SPEED_LIMITER_REQUIRED,SPEED_DEVICE_ID,SPEED_LIMITER_INSTALLED,
        SENT_INSPECTION,CREATED_AT,PARENT_ID) {
            this.ID = ID;
            this.OFFENDER_ID = OFFENDER_ID;
            this.SUMMONS_ID = SUMMONS_ID;
            this.SPOTS_ID = SPOTS_ID;
            this.OFFENCE_TYPE_ID = OFFENCE_TYPE_ID;
            this.OFFENCE_DATE = OFFENCE_DATE;
            this.OFFENCE_TIME = OFFENCE_TIME;
            this.REMARKS = REMARKS;
            this.SPEED_CLOCKED = SPEED_CLOCKED;
            this.SPEED_LIMIT = SPEED_LIMIT;
            this.ROAD_LIMIT = ROAD_LIMIT;
            this.SPEED_LIMITER_REQUIRED = SPEED_LIMITER_REQUIRED;
            this.SPEED_DEVICE_ID = SPEED_DEVICE_ID;
            this.SPEED_LIMITER_INSTALLED = SPEED_LIMITER_INSTALLED;
            this.SENT_INSPECTION = SENT_INSPECTION;
            this.CREATED_AT = CREATED_AT;
            this.PARENT_ID = PARENT_ID;
    };

    static async createTable(db) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                        ID                      INTEGER NOT NULL UNIQUE,
                        OFFENDER_ID             INTEGER NOT NULL,
                        SUMMONS_ID              TEXT    NOT NULL,
                        SPOTS_ID                TEXT    NOT NULL,
                        OFFENCE_TYPE_ID         TEXT    NOT NULL,
                        OFFENCE_DATE            TEXT,
                        OFFENCE_TIME            TEXT,
                        REMARKS                 TEXT,
                        SPEED_CLOCKED           TEXT,
                        SPEED_LIMIT             TEXT,
                        ROAD_LIMIT              TEXT,
                        SPEED_LIMITER_REQUIRED  INTEGER,
                        SPEED_DEVICE_ID         INTEGER,
                        SPEED_LIMITER_INSTALLED INTEGER,
                        SENT_INSPECTION         INTEGER,
                        CREATED_AT              TEXT,
                        PARENT_ID               INTEGER NOT NULL,
                        PRIMARY KEY (
                            ID
                        )
                    );`,
                    []
                );
            });
            console.log(`${this.tableName} table created successfully!`);
        } catch (error) {
            console.error(`Error creating ${this.tableName} table:`, error);
        }
    }

    static async insert(db, Offences) {
        console.log("insert Offences >>", Offences);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID,
                        OFFENDER_ID,
                        SUMMONS_ID,
                        SPOTS_ID,
                        OFFENCE_TYPE_ID,
                        OFFENCE_DATE,
                        OFFENCE_TIME,
                        REMARKS,
                        SPEED_CLOCKED,
                        SPEED_LIMIT,
                        ROAD_LIMIT,
                        SPEED_LIMITER_REQUIRED,
                        SPEED_DEVICE_ID,
                        SPEED_LIMITER_INSTALLED,
                        SENT_INSPECTION,
                        CREATED_AT,
                        PARENT_ID
                    )
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        Offences.ID,Offences.OFFENDER_ID,Offences.SUMMONS_ID,Offences.SPOTS_ID,Offences.OFFENCE_TYPE_ID,Offences.OFFENCE_DATE,
                        Offences.OFFENCE_TIME,Offences.REMARKS,Offences.SPEED_CLOCKED,Offences.SPEED_LIMIT,Offences.ROAD_LIMIT,
                        Offences.SPEED_LIMITER_REQUIRED,Offences.SPEED_DEVICE_ID,Offences.SPEED_LIMITER_INSTALLED,
                        Offences.SENT_INSPECTION,Offences.CREATED_AT,Offences.PARENT_ID
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${Offences.ID} inserted successfully!`);
                        console.log("Insert result: ", result);
                    },
                    (tx, error) => {
                        console.error('Error inserting offence:', error);
                        throw false;
                    }
                );
            });
        }   catch (error) {
            console.error('Error inserting offence:', error);
        }
    };

    static async insertMasterOffence(db, Offences) {
        console.log("insertMasterOffence >>", Offences);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                    ID,
                    OFFENDER_ID,
                    SUMMONS_ID,
                    SPOTS_ID,
                    OFFENCE_TYPE_ID,
                    OFFENCE_DATE,
                    OFFENCE_TIME,
                    REMARKS,
                    CREATED_AT,
                    PARENT_ID
                    )
                    VALUES(?,?,?,?,?,?,?,?,?,?)`,
                    [
                        Offences.ID,Offences.OFFENDER_ID,Offences.SUMMONS_ID,Offences.SPOTS_ID,
                        Offences.OFFENCE_TYPE_ID,Offences.OFFENCE_DATE,Offences.OFFENCE_TIME,
                        Offences.REMARKS,Offences.CREATED_AT,Offences.PARENT_ID
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${Offences.ID} inserted successfully!`);
                        console.log("insertMasterOffence result: ", result);
                    },
                    (tx, error) => {
                        console.error('Error insertMasterOffence:', error);
                        throw false;
                    }
                );
            });
        }   catch (error) {
            console.error('Error insertMasterOffence:', error);
        }
    };

    static async deleteOffences(db, id) {
        console.log('deleteOffences' , id);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteOffences SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };
    
    // delete all offences related to this offender
    static async deleteOffenderOffences(db, offenderId, summonId) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE OFFENDER_ID = ? AND SUMMONS_ID = ?`,
                    [offenderId, summonId],
                    (tx, results) => {
                        console.log(`Success deleteOffenderOffences ${offenderId} SQL query:`, results);
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteOffenderOffences SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async deleteAllOffences(db, id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ? OR PARENT_ID = ?`,
                    [id, id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteAllOffences SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async getOffencesBySummonsID (db, SUMMONS_ID, isMaster) {
        console.log("getOffencesBySummonsID >> ", SUMMONS_ID, isMaster);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                let query = `SELECT * FROM ${this.tableName} WHERE SUMMONS_ID = ?`;
                let params = [SUMMONS_ID];

                if (isMaster) {
                    query += ' AND OFFENDER_ID = 0';
                }

                tx.executeSql(
                    query,
                    params,
                    (tx, results) => {
                        let {rows} = results;
                        console.log(`getOffencesBySummonsID rows.raw() >>`, rows.raw());
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Offences(
                                row.ID, row.OFFENDER_ID, row.SUMMONS_ID, row.SPOTS_ID, row.OFFENCE_TYPE_ID,
                                row.OFFENCE_DATE, row.OFFENCE_TIME, row.REMARKS, row.SPEED_CLOCKED,
                                row.SPEED_LIMIT, row.ROAD_LIMIT, row.SPEED_LIMITER_REQUIRED, row.SPEED_DEVICE_ID,
                                row.SPEED_LIMITER_INSTALLED, row.SENT_INSPECTION, row.CREATED_AT, row.PARENT_ID));
                        });
                        console.log(`getOffencesBySummonsID list ${list.length} >>`, list);
                        resolve(list);
                    },
                    (tx,error) => {
                        console.log("Error executing getOffencesBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async insertOffences (db, offences) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                              ,
                        OFFENDER_ID                     ,
                        SUMMONS_ID                      ,
                        SPOTS_ID                        ,
                        OFFENCE_TYPE_ID                 ,
                        OFFENCE_DATE                    ,
                        OFFENCE_TIME                    ,
                        REMARKS                         ,
                        CREATED_AT                      ,
                        PARENT_ID                       
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?)`,
                    [
                        offences.ID, offences.OFFENDER_ID, offences.SUMMONS_ID, offences.SPOTS_ID,
                        offences.OFFENCE_TYPE_ID, offences.OFFENCE_DATE, offences.OFFENCE_TIME,
                        offences.REMARKS, offences.CREATED_AT, offences.PARENT_ID
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${offences.ID} inserted successfully!`);
                        console.log("insertOffences result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertOffences ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertOffences ${this.tableName}:`, error);
        }
    };

    static async getOffenceByOffender(db, SUMMONS_ID, offenceCode, offenderId) {
        console.log("getOffenceByOffender >> ", SUMMONS_ID, offenceCode, offenderId);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                let query = `SELECT OFS.* FROM OFFENCES as OFS 
                    INNER JOIN OFFENDER AS OFR ON OFS.OFFENDER_ID = OFR.ID
                    WHERE OFR.SUMMONS_ID = ? AND OFS.OFFENCE_TYPE_ID = ? AND OFS.OFFENDER_ID = ?`;
                let params = [SUMMONS_ID, offenceCode, offenderId];
    
                tx.executeSql(
                    query,
                    params,
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        console.log('getOffenceByOffender rows.raw() ', rows.raw());
                        rows.raw().forEach((row, index) => {
                            try {
                                list.push(new Offences(
                                    row.ID, row.OFFENDER_ID, row.SUMMONS_ID, row.SPOTS_ID, row.OFFENCE_TYPE_ID,
                                    row.OFFENCE_DATE, row.OFFENCE_TIME, row.REMARKS, row.SPEED_CLOCKED,
                                    row.SPEED_LIMIT, row.ROAD_LIMIT,row.SPEED_LIMITER_REQUIRED, 
                                    row.SPEED_LIMITER_INSTALLED, row.SENT_INSPECTION, row.CREATED_AT, row.PARENT_ID));
                            } catch (error) {
                                console.error(`Error processing row ${index}: `, error);
                            }
                        });
                        console.log(`getOffenceByOffender ${SUMMONS_ID} list >> ${list.length}`, list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.log("Error executing getOffenceByOffender SQL query:", error);
                        reject(error);
                    }
                );
            }, (transactionError) => {
                console.error("Transaction error: ", transactionError);
                reject(transactionError);
            });
        });
    };

    static async getSubOffenceByOffender(db, SUMMONS_ID, offenceCode, offenderId) {
        console.log("getSubOffenceByOffender >> ", SUMMONS_ID, offenceCode, offenderId);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                let query = `SELECT OFS.* FROM OFFENCES as OFS 
                    WHERE OFS.SUMMONS_ID = ? AND OFS.PARENT_ID = ? AND OFS.OFFENDER_ID = ?`;
                let params = [SUMMONS_ID, offenceCode, offenderId];
    
                tx.executeSql(
                    query,
                    params,
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        console.log('getSubOffenceByOffender rows.raw() ', rows.raw());
                        rows.raw().forEach((row, index) => {
                            try {
                                list.push(new Offences(
                                    row.ID,row.OFFENDER_ID,row.SUMMONS_ID,row.SPOTS_ID,row.OFFENCE_TYPE_ID,
                                    row.OFFENCE_DATE,row.OFFENCE_TIME,row.REMARKS,row.SPEED_CLOCKED,row.SPEED_LIMIT, 
                                    row.ROAD_LIMIT,row.SPEED_LIMITER_REQUIRED,row.SPEED_DEVICE_ID,row.SPEED_LIMITER_INSTALLED, 
                                    row.SENT_INSPECTION,row.CREATED_AT,row.PARENT_ID));
                            } catch (error) {
                                console.error(`Error processing row ${index}: `, error);
                            }
                        });
                        console.log(`getSubOffenceByOffender ${SUMMONS_ID} list >> ${list.length}`, list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.log("Error executing getSubOffenceByOffender SQL query:", error);
                        reject(error);
                    }
                );
            }, (transactionError) => {
                console.error("Transaction error: ", transactionError);
                reject(transactionError);
            });
        });
    };

    static async getSubOffenceByVehicleOffender(db, SUMMONS_ID, offenderId) {
        console.log("getSubOffenceByVehicleOffender >> ", SUMMONS_ID, offenderId);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                let query = `SELECT OFS.* FROM OFFENCES as OFS 
                    WHERE OFS.SUMMONS_ID = ? AND OFS.OFFENDER_ID = ?`;
                let params = [SUMMONS_ID, offenderId];
    
                tx.executeSql(
                    query,
                    params,
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        console.log('getSubOffenceByVehicleOffender rows.raw() ', rows.raw());
                        rows.raw().forEach((row, index) => {
                            try {
                                list.push(new Offences(
                                    row.ID,row.OFFENDER_ID,row.SUMMONS_ID,row.SPOTS_ID,row.OFFENCE_TYPE_ID,
                                    row.OFFENCE_DATE,row.OFFENCE_TIME,row.REMARKS,row.SPEED_CLOCKED,row.SPEED_LIMIT, 
                                    row.ROAD_LIMIT,row.SPEED_LIMITER_REQUIRED,row.SPEED_DEVICE_ID,row.SPEED_LIMITER_INSTALLED, 
                                    row.SENT_INSPECTION,row.CREATED_AT,row.PARENT_ID));
                            } catch (error) {
                                console.error(`Error processing row ${index}: `, error);
                            }
                        });
                        console.log(`getSubOffenceByVehicleOffender ${SUMMONS_ID} list >> ${list.length}`, list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.log("Error executing getSubOffenceByVehicleOffender SQL query:", error);
                        reject(error);
                    }
                );
            }, (transactionError) => {
                console.error("Transaction error: ", transactionError);
                reject(transactionError);
            });
        });
    };

    static async getOffenceDateTimeByOffender(db, SUMMONS_ID, SPOTS_ID) {
        console.log("getOffenceDateTimeByOffender >> ", SUMMONS_ID, SPOTS_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                let query = `SELECT OFS.OFFENCE_DATE, OFS.OFFENCE_TIME FROM OFFENCES as OFS 
                    INNER JOIN OFFENDER AS OFR ON OFS.OFFENDER_ID = OFR.ID
                    WHERE OFR.SUMMONS_ID = ? AND OFS.SPOTS_ID = ?`;
                let params = [SUMMONS_ID, SPOTS_ID];
    
                tx.executeSql(
                    query,
                    params,
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        console.log('getOffenceDateTimeByOffender rows.raw() ', rows.raw());
                        if (rows.length > 0) {                            
                            resolve({ 
                                OFFENCE_DATE: rows.item(0).OFFENCE_DATE, 
                                OFFENCE_TIME: rows.item(0).OFFENCE_TIME 
                            });
                        } else {
                            console.log('getOffenceDateTimeByOffender: No results found');
                            resolve(null);  // Resolve with null if no results are found
                        }
                    },
                    (tx, error) => {
                        console.log("Error executing getOffenceDateTimeByOffender SQL query:", error);
                        reject(error);
                    }
                );
            }, (transactionError) => {
                console.error("Transaction error: ", transactionError);
                reject(transactionError);
            });
        });
    };

}
