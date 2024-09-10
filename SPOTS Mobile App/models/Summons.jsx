export default class Summons {
    static tableName = "SUMMONS";

    constructor(ID, SPOTS_ID, DEVICE_ID, OFFICER_ID, STATUS_ID, TYPE, CREATED_AT, 
        INCIDENT_OCCURED,LOCATION_CODE,LOCATION_CODE_2,
        SPECIAL_ZONE,REMARKS_LOCATION,SCHOOL_NAME) {
            this.ID = ID;
            this.SPOTS_ID = SPOTS_ID;
            this.DEVICE_ID = DEVICE_ID;
            this.OFFICER_ID = OFFICER_ID;
            this.STATUS_ID = STATUS_ID;
            this.TYPE = TYPE;
            this.CREATED_AT = CREATED_AT;
            this.INCIDENT_OCCURED = INCIDENT_OCCURED;
            this.LOCATION_CODE = LOCATION_CODE;
            this.LOCATION_CODE_2 = LOCATION_CODE_2;
            this.SPECIAL_ZONE = SPECIAL_ZONE;
            this.REMARKS_LOCATION = REMARKS_LOCATION;
            this.SCHOOL_NAME = SCHOOL_NAME;
        }

static async createTable(db) {
    try {
        await db.transaction(async tx => {
            await tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                ID               TEXT    NOT NULL UNIQUE,
                SPOTS_ID         TEXT    NOT NULL UNIQUE,
                DEVICE_ID        TEXT    NOT NULL,
                OFFICER_ID       INTEGER NOT NULL,
                STATUS_ID        INTEGER NOT NULL,
                TYPE             TEXT    NOT NULL,
                CREATED_AT       TEXT    NOT NULL,
                INCIDENT_OCCURED INTEGER,
                LOCATION_CODE    TEXT,
                LOCATION_CODE_2  TEXT,
                SPECIAL_ZONE     INTEGER,
                REMARKS_LOCATION TEXT,
                SCHOOL_NAME      TEXT,
                PRIMARY KEY (
                    ID
                )
            );`,
            []
        );
    });
    console.log(`${this.tableName} table created successfully!`);
}
    catch (error) {
        console.error(`Error creating ${this.tableName} table`, error);
    }
}

static async insert(db, Summons) {
    console.log("insertReplaceSummons ", Summons);
        console.log("Values to be inserted: ", [
            Summons.ID,Summons.SPOTS_ID,Summons.DEVICE_ID,Summons.OFFICER_ID,Summons.STATUS_ID,
                Summons.TYPE,Summons.CREATED_AT,Summons.INCIDENT_OCCURED,Summons.LOCATION_CODE,Summons.LOCATION_CODE_2,
                Summons.SPECIAL_ZONE,Summons.REMARKS_LOCATION,Summons.SCHOOL_NAME
        ]);
    try {
        await db.transaction(async tx => {
            await tx.executeSql(
                `INSERT OR REPLACE INTO ${this.tableName} (
                    ID,
                    SPOTS_ID,
                    DEVICE_ID,
                    OFFICER_ID,
                    STATUS_ID,
                    TYPE,
                    CREATED_AT,
                    INCIDENT_OCCURED,
                    LOCATION_CODE,
                    LOCATION_CODE_2,
                    SPECIAL_ZONE,
                    REMARKS_LOCATION,
                    SCHOOL_NAME
                )
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [Summons.ID,Summons.SPOTS_ID,Summons.DEVICE_ID,Summons.OFFICER_ID,Summons.STATUS_ID,
                Summons.TYPE,Summons.CREATED_AT,Summons.INCIDENT_OCCURED,Summons.LOCATION_CODE,Summons.LOCATION_CODE_2,
                Summons.SPECIAL_ZONE,Summons.REMARKS_LOCATION,Summons.SCHOOL_NAME
            ],
            (tx, result) => {
                console.log(`${this.tableName} entry with ID: ${Summons.ID} inserted successfully!`);
                console.log("Insert result: ", result);
            },
            (tx, error) => {
                console.error('Error inserting summons:', error);
                throw false;
            }
            );
        });
        }   catch (error) {
        console.error('Error inserting summons', error);
        }
    };

    static async deleteSummons(db, id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteSummons SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getAll(db) {
        console.log("getAllSummons");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName}`,
                    [],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Summons(
                                row.ID, row.SPOTS_ID, row.DEVICE_ID, row.OFFICER_ID, row.STATUS_ID, row.TYPE,
                                row.CREATED_AT, row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2,
                                row.SPECIAL_ZONE, row.REMARKS_LOCATION, row.SCHOOL_NAME));
                        });

                        resolve(list);
                    },
                    (tx,error) => {
                        console.error("Error executing getAllSummons SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getIssuedSummons(db) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                const sQueryOld = `SELECT DISTINCT (S.ID) AS ID, S.DEVICE_ID AS DEVICE_ID, S.STATUS_ID AS STATUS_ID, 
                S.OFFICER_ID AS OFFICER_ID, S.SPOTS_ID AS SPOTS_ID, S.INCIDENT_OCCURED, S.TYPE, 
                O.OFFENDER_TYPE_ID AS OFFENDER_TYPE, S.LOCATION_CODE, S.LOCATION_CODE_2, 
                O.NAME, O.REGISTRATION_NO, S.CREATED_AT 
                FROM SUMMONS AS S JOIN OFFENDER AS O ON S.ID = O.SUMMONS_ID 
                WHERE S.STATUS_ID > 2 ORDER BY S.SPOTS_ID, O.OFFENDER_TYPE_ID `;

                const sQuery = `SELECT 
                        S.ID AS ID, 
                        MAX(S.DEVICE_ID) AS DEVICE_ID, 
                        MAX(S.STATUS_ID) AS STATUS_ID, 
                        MAX(S.OFFICER_ID) AS OFFICER_ID, 
                        MAX(S.SPOTS_ID) AS SPOTS_ID, 
                        MAX(S.INCIDENT_OCCURED) AS INCIDENT_OCCURED, 
                        MAX(S.TYPE) AS TYPE, 
                        MAX(O.OFFENDER_TYPE_ID) AS OFFENDER_TYPE, 
                        MAX(S.LOCATION_CODE) AS LOCATION_CODE, 
                        MAX(S.LOCATION_CODE_2) AS LOCATION_CODE_2, 
                        MAX(O.NAME) AS NAME, 
                        MAX(O.REGISTRATION_NO) AS REGISTRATION_NO, 
                        MAX(S.CREATED_AT) AS CREATED_AT
                    FROM SUMMONS AS S 
                    JOIN OFFENDER AS O ON S.ID = O.SUMMONS_ID 
                    WHERE S.STATUS_ID > 2 
                    GROUP BY S.ID
                    ORDER BY S.SPOTS_ID, O.OFFENDER_TYPE_ID; `;

                // 1 - Drafts, 2 - Pending, 3 - Submitted
                tx.executeSql(
                    sQuery, 
                    [],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        console.log(`getIssuedSummons`, rows.raw());
                        rows.raw().forEach(row => {
                            list.push(row);
                        });
                        console.log("getIssuedSummons list >> ", list.length);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getIssuedSummons SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getDraftSummons(db) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE STATUS_ID = ? ORDER BY CREATED_AT ASC`,
                    [1],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            console.log("row >> " , row);
                            list.push(new Summons(
                                row.ID, row.SPOTS_ID, row.DEVICE_ID, row.OFFICER_ID, row.STATUS_ID, row.TYPE,
                                row.CREATED_AT, row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2,
                                row.SPECIAL_ZONE, row.REMARKS_LOCATION, row.SCHOOL_NAME));
                        });
                        console.log("list >> " , list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getDraftSummons SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getDraftCountSummons(db) {
        console.log("getDraftCountSummons ");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT count(*) as count FROM ${this.tableName} WHERE STATUS_ID = ?`,
                    [1], 
                    // 1 - Drafts, 2 - Pending, 3 - Submitted
                    (tx, results) => {
                        let { rows } = results;
                        
                        if (rows.length > 0) {
                            const count = rows.item(0).count;
                            console.log("getDraftCountSummons >> ", count);
                            resolve(count);
                        } else {
                            console.log("getDraftCountSummons >> 0");
                            resolve(0);
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getDraftCountSummons SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getIssuedCountSummons(db) {
        console.log("getIssuedCountSummons ");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT count(*) as count FROM ${this.tableName} WHERE STATUS_ID > ?`,
                    [2],
                    (tx, results) => {
                        let { rows } = results;
                        
                        if (rows.length > 0) {
                            const count = rows.item(0).count;
                            console.log("getIssuedCountSummons >> ", count);
                            resolve(count);
                        } else {
                            console.log("getIssuedCountSummons >> 0");
                            resolve(0);
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getIssuedCountSummons SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getCountSummonsByStatus(db, STATUS_ID) {
        console.log("getCountSummonsByStatus ");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT count(*) as count FROM ${this.tableName} WHERE STATUS_ID < ?`,
                    [STATUS_ID],
                    (tx, results) => {
                        let { rows } = results;
                        
                        if (rows.length > 0) {
                            const count = rows.item(0).count;
                            console.log("getCountSummonsByStatus >> ", count);
                            resolve(count);
                        } else {
                            console.log("getCountSummonsByStatus >> 0");
                            resolve(0);
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getCountSummonsByStatus SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getSummonsById(db, id) {
        console.log("getSummonsById >> " , id);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        
                        rows.raw().forEach(row => {
                            list.push(new Summons(
                                row.ID, row.SPOTS_ID, row.DEVICE_ID, row.OFFICER_ID, row.STATUS_ID, row.TYPE,
                                row.CREATED_AT, row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2,
                                row.SPECIAL_ZONE, row.REMARKS_LOCATION, row.SCHOOL_NAME));
                        });
    
                        console.log("Summons >> ", list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getSummonsById SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }
    
    static async getSummonsReportById(db, id) {
        console.log("getSummonsReportById >> " , id);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        let { rows } = results;
                        let report = null;
                        if (rows.length > 0) {
                            const row = rows.item(0);
                            report = new Summons(
                                row.ID, row.SPOTS_ID, row.DEVICE_ID, row.OFFICER_ID, row.STATUS_ID, row.TYPE,
                                row.CREATED_AT, row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2,
                                row.SPECIAL_ZONE, row.REMARKS_LOCATION, row.SCHOOL_NAME
                            );
                        }
    
                        console.log("Summons >> ", report);
                        resolve(report);
                    },
                    (tx, error) => {
                        console.error("Error executing getSummonsReportById SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getVehicleSummary(db, SPOTS_ID, OFFENDER_TYPE_ID) {
        console.log("getVehicleSummary >> " , SPOTS_ID, OFFENDER_TYPE_ID);
        return new Promise((resolve, reject) => {
            const vehicleQuery = (OFFENDER_TYPE_ID === 2) ? "OFR.REGISTRATION_NO AS VEHICLE_NO, " : "";
            const query = "SELECT DISTINCT S.ID, OFR.ID AS OFFENDER_ID, OFS.ID AS OFFENCE_ID, S.INCIDENT_OCCURED, " +
                "TLOC.description AS LOCATION_CODE, TLOC2.description AS LOCATION_CODE_2, " +
                "OFR.NAME, OFR.IDENTIFICATION_NO, OFR.ID AS OFFENDER_ID, " +
                "OFS.CREATED_AT, TOC.caption AS OFFENCE_TYPE, " + vehicleQuery +
                "OFS.OFFENCE_DATE, OFS.OFFENCE_TIME FROM " +
                "SUMMONS AS S " +
                "LEFT JOIN OFFENDER AS OFR ON OFR.SUMMONS_ID = S.ID " +
                "LEFT JOIN OFFENCES AS OFS ON OFR.ID = OFS.OFFENDER_ID " +
                "LEFT JOIN tims_offence_code AS TOC ON OFS.OFFENCE_TYPE_ID = TOC.code " +
                "LEFT JOIN tims_location_code AS TLOC ON S.LOCATION_CODE = TLOC.code " +
                "LEFT JOIN tims_location_code AS TLOC2 ON S.LOCATION_CODE_2 = TLOC2.code " +
                "WHERE S.SPOTS_ID = ? AND OFR.OFFENDER_TYPE_ID = ? AND TOC.caption != '' ORDER BY OFS.OFFENCE_TIME ASC";
            console.log('getVehicleSummary ' , query);

            db.transaction(tx => {
                tx.executeSql(
                    query,
                    [SPOTS_ID, OFFENDER_TYPE_ID],
                    (tx, results) => {
                        let { rows } = results;
                        console.log(`getVehicleSummary rows ${rows.raw().length} >> `, rows.raw());
                        let list = [];
                        
                        rows.raw().forEach(row => {
                            list.push(row);
                        });
    
                        console.log("getVehicleSummary >> ", list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getVehicleSummary SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getSummonsVehicleSummary(db, SPOTS_ID, OFFENDER_TYPE_ID) {
        console.log("getSummonsVehicleSummary >> " , SPOTS_ID, OFFENDER_TYPE_ID);
        return new Promise((resolve, reject) => {
            const vehicleQuery = (OFFENDER_TYPE_ID === 2) ? "OFR.REGISTRATION_NO AS VEHICLE_NO, " : "";
            const query = "SELECT DISTINCT S.ID, OFR.ID AS OFFENDER_ID, OFS.ID AS OFFENCE_ID, S.INCIDENT_OCCURED, " +
                "TLOC.description AS LOCATION_CODE, TLOC2.description AS LOCATION_CODE_2, " +
                "OFR.NAME, OFR.IDENTIFICATION_NO, OFR.ID AS OFFENDER_ID, " +
                "OFS.CREATED_AT, TOC.caption AS OFFENCE_TYPE, " + vehicleQuery +
                "OFS.OFFENCE_DATE, OFS.OFFENCE_TIME FROM " +
                "SUMMONS AS S " +
                "LEFT JOIN OFFENDER AS OFR ON OFR.SUMMONS_ID = S.ID " +
                "LEFT JOIN OFFENCES AS OFS ON OFR.ID = OFS.OFFENDER_ID " +
                "LEFT JOIN tims_offence_code AS TOC ON OFS.OFFENCE_TYPE_ID = TOC.code " +
                "LEFT JOIN tims_location_code AS TLOC ON S.LOCATION_CODE = TLOC.code " +
                "LEFT JOIN tims_location_code AS TLOC2 ON S.LOCATION_CODE_2 = TLOC2.code " +
                "WHERE S.SPOTS_ID = ? AND OFR.OFFENDER_TYPE_ID >= ? ORDER BY OFS.OFFENCE_TIME ASC";
            console.log('getSummonsVehicleSummary ' , query);

            db.transaction(tx => {
                tx.executeSql(
                    query,
                    [SPOTS_ID, OFFENDER_TYPE_ID],
                    (tx, results) => {
                        let { rows } = results;
                        console.log(`getSummonsVehicleSummary rows ${rows.raw().length} >> `, rows.raw());
                        let list = [];
                        
                        rows.raw().forEach(row => {
                            list.push(row);
                        });
    
                        console.log("getSummonsVehicleSummary >> ", list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getSummonsVehicleSummary SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getSummonsVehicleSummaryTest(db, SPOTS_ID, OFFENDER_TYPE_ID) {
        console.log("getSummonsVehicleSummary >> " , SPOTS_ID, OFFENDER_TYPE_ID);
        return new Promise((resolve, reject) => {
            const vehicleQuery = (OFFENDER_TYPE_ID === 2) ? "OFR.REGISTRATION_NO AS VEHICLE_NO, " : "";
            const query = "SELECT DISTINCT S.ID, OFR.ID AS OFFENDER_ID, OFS.ID AS OFFENCE_ID, S.INCIDENT_OCCURED, " +
                "TLOC.description AS LOCATION_CODE, TLOC2.description AS LOCATION_CODE_2, " +
                "OFR.NAME, OFR.IDENTIFICATION_NO, OFR.ID AS OFFENDER_ID, " +
                "OFS.CREATED_AT, TOC.caption AS OFFENCE_TYPE, " + vehicleQuery +
                "OFS.OFFENCE_DATE, OFS.OFFENCE_TIME FROM " +
                "SUMMONS AS S " +
                "LEFT JOIN OFFENDER AS OFR ON OFR.SUMMONS_ID = S.ID " +
                "LEFT JOIN OFFENCES AS OFS ON OFR.ID = OFS.OFFENDER_ID " +
                "LEFT JOIN tims_offence_code AS TOC ON OFS.OFFENCE_TYPE_ID = TOC.code " +
                "LEFT JOIN tims_location_code AS TLOC ON S.LOCATION_CODE = TLOC.code " +
                "LEFT JOIN tims_location_code AS TLOC2 ON S.LOCATION_CODE_2 = TLOC2.code " +
                "WHERE S.SPOTS_ID = ? AND OFR.OFFENDER_TYPE_ID >= ? and OFR.IDENTIFICATION_NO != '' ORDER BY OFS.OFFENCE_TIME ASC";
            console.log('getSummonsVehicleSummary ' , query);

            db.transaction(tx => {
                tx.executeSql(
                    query,
                    [SPOTS_ID, OFFENDER_TYPE_ID],
                    (tx, results) => {
                        let { rows } = results;
                        console.log(`getSummonsVehicleSummary rows ${rows.raw().length} >> `, rows.raw());
                        let list = [];
                        
                        rows.raw().forEach(row => {
                            list.push(row);
                        });
    
                        console.log("getSummonsVehicleSummary >> ", list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getSummonsVehicleSummary SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async updateStatus(db, id, newStatusId) {
        console.log(`Updating STATUS_ID for ID: ${id} to ${newStatusId}`);
        
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `UPDATE ${this.tableName} 
                        SET STATUS_ID = ? 
                        WHERE ID = ?`,
                    [newStatusId, id],
                    (tx, result) => {
                        console.log(`STATUS_ID updated successfully for ID: ${id}`);
                        console.log("Update result: ", result);
                    },
                    (tx, error) => {
                        console.error('Error updating STATUS_ID:', error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error('Error updating STATUS_ID:', error);
        }
    }
}