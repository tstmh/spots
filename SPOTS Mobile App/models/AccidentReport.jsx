export default class AccidentReport {
    static tableName = "ACCIDENT_REPORT"; 

    constructor(ID, INCIDENT_NO, DEVICE_ID, OFFICER_ID, IO_NAME, IO_EXTENSION_NO,
        INCIDENT_OCCURED, LOCATION_CODE, LOCATION_CODE_2, SPECIAL_ZONE,
        REMARKS_LOCATION, CREATED_AT, STATUS_ID, STRUCTURE_DAMAGES, WEATHER_CODE,
        WEATHER_OTHER_CODE, ROAD_SURFACE_CODE, ROAD_SURFACE_OTHER, TRAFFIC_VOLUME_CODE,
        DECLARATION_INDICATOR, OFFICER_RANK, DIVISION, DECLARATION_DATE, PRESERVE_DATE,
        SCHOOL_NAME, ACCIDENT_TIME, PO_ARRIVAL_TIME, PO_RESUME_DUTY_TIME) {
        this.ID = ID;
        this.INCIDENT_NO = INCIDENT_NO;
        this.DEVICE_ID = DEVICE_ID;
        this.OFFICER_ID = OFFICER_ID;
        this.IO_NAME = IO_NAME;
        this.IO_EXTENSION_NO = IO_EXTENSION_NO;
        this.INCIDENT_OCCURED = INCIDENT_OCCURED;
        this.LOCATION_CODE = LOCATION_CODE;
        this.LOCATION_CODE_2 = LOCATION_CODE_2;
        this.SPECIAL_ZONE = SPECIAL_ZONE;
        this.REMARKS_LOCATION = REMARKS_LOCATION;
        this.CREATED_AT = CREATED_AT;
        this.STATUS_ID = STATUS_ID;
        this.STRUCTURE_DAMAGES = STRUCTURE_DAMAGES;
        this.WEATHER_CODE = WEATHER_CODE;
        this.WEATHER_OTHER_CODE = WEATHER_OTHER_CODE;
        this.ROAD_SURFACE_CODE = ROAD_SURFACE_CODE;
        this.ROAD_SURFACE_OTHER = ROAD_SURFACE_OTHER;
        this.TRAFFIC_VOLUME_CODE = TRAFFIC_VOLUME_CODE;
        this.DECLARATION_INDICATOR = DECLARATION_INDICATOR;
        this.OFFICER_RANK = OFFICER_RANK;
        this.DIVISION = DIVISION;
        this.DECLARATION_DATE = DECLARATION_DATE;
        this.PRESERVE_DATE = PRESERVE_DATE;
        this.SCHOOL_NAME = SCHOOL_NAME;
        this.ACCIDENT_TIME = ACCIDENT_TIME;
        this.PO_ARRIVAL_TIME = PO_ARRIVAL_TIME;
        this.PO_RESUME_DUTY_TIME = PO_RESUME_DUTY_TIME;
    }

    static async createTable(db) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                        ID                    TEXT    NOT NULL UNIQUE,
                        INCIDENT_NO           TEXT    NOT NULL,
                        DEVICE_ID             TEXT    NOT NULL,
                        OFFICER_ID            INTEGER NOT NULL,
                        IO_NAME               INTEGER NOT NULL,
                        IO_EXTENSION_NO       TEXT    NOT NULL,
                        INCIDENT_OCCURED      INTEGER,
                        LOCATION_CODE         TEXT,
                        LOCATION_CODE_2       TEXT,
                        SPECIAL_ZONE          INTEGER,
                        REMARKS_LOCATION      TEXT,
                        CREATED_AT            TEXT,
                        STATUS_ID             INTEGER,
                        STRUCTURE_DAMAGES     TEXT,
                        WEATHER_CODE          INTEGER,
                        WEATHER_OTHER_CODE    TEXT,
                        ROAD_SURFACE_CODE     INTEGER,
                        ROAD_SURFACE_OTHER    TEXT,
                        TRAFFIC_VOLUME_CODE   INTEGER,
                        DECLARATION_INDICATOR INTEGER,
                        OFFICER_RANK          TEXT,
                        DIVISION              TEXT,
                        DECLARATION_DATE      TEXT,
                        PRESERVE_DATE         TEXT,
                        SCHOOL_NAME           TEXT,
                        ACCIDENT_TIME         TEXT,
                        PO_ARRIVAL_TIME       TEXT,
                        PO_RESUME_DUTY_TIME   TEXT,
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

    static async insert(db, AccidentReport) {
        console.log("insertReplaceAccidentReports ", AccidentReport);
        console.log("Values to be inserted: ", [
            AccidentReport.ID, AccidentReport.INCIDENT_NO, AccidentReport.DEVICE_ID, AccidentReport.OFFICER_ID, AccidentReport.IO_NAME, AccidentReport.IO_EXTENSION_NO,
            AccidentReport.INCIDENT_OCCURED, AccidentReport.LOCATION_CODE, AccidentReport.LOCATION_CODE_2, AccidentReport.SPECIAL_ZONE, AccidentReport.REMARKS_LOCATION, 
            AccidentReport.CREATED_AT, AccidentReport.STATUS_ID, AccidentReport.STRUCTURE_DAMAGES, AccidentReport.WEATHER_CODE, AccidentReport.WEATHER_OTHER_CODE, 
            AccidentReport.ROAD_SURFACE_CODE, AccidentReport.ROAD_SURFACE_OTHER, AccidentReport.TRAFFIC_VOLUME_CODE, AccidentReport.DECLARATION_INDICATOR, 
            AccidentReport.OFFICER_RANK, AccidentReport.DIVISION, AccidentReport.DECLARATION_DATE, AccidentReport.PRESERVE_DATE, AccidentReport.SCHOOL_NAME, 
            AccidentReport.ACCIDENT_TIME, AccidentReport.PO_ARRIVAL_TIME, AccidentReport.PO_RESUME_DUTY_TIME
        ]);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID,
                        INCIDENT_NO,
                        DEVICE_ID,
                        OFFICER_ID,
                        IO_NAME,
                        IO_EXTENSION_NO,
                        INCIDENT_OCCURED,
                        LOCATION_CODE,
                        LOCATION_CODE_2,
                        SPECIAL_ZONE,
                        REMARKS_LOCATION,
                        CREATED_AT,
                        STATUS_ID,
                        STRUCTURE_DAMAGES,
                        WEATHER_CODE,
                        WEATHER_OTHER_CODE,
                        ROAD_SURFACE_CODE,
                        ROAD_SURFACE_OTHER,
                        TRAFFIC_VOLUME_CODE,
                        DECLARATION_INDICATOR,
                        OFFICER_RANK,
                        DIVISION,
                        DECLARATION_DATE,
                        PRESERVE_DATE,
                        SCHOOL_NAME,
                        ACCIDENT_TIME,
                        PO_ARRIVAL_TIME,
                        PO_RESUME_DUTY_TIME
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        AccidentReport.ID, AccidentReport.INCIDENT_NO, AccidentReport.DEVICE_ID, AccidentReport.OFFICER_ID, AccidentReport.IO_NAME, 
                        AccidentReport.IO_EXTENSION_NO, AccidentReport.INCIDENT_OCCURED, AccidentReport.LOCATION_CODE, AccidentReport.LOCATION_CODE_2, 
                        AccidentReport.SPECIAL_ZONE, AccidentReport.REMARKS_LOCATION, AccidentReport.CREATED_AT, AccidentReport.STATUS_ID, 
                        AccidentReport.STRUCTURE_DAMAGES, AccidentReport.WEATHER_CODE, AccidentReport.WEATHER_OTHER_CODE, AccidentReport.ROAD_SURFACE_CODE,
                        AccidentReport.ROAD_SURFACE_OTHER, AccidentReport.TRAFFIC_VOLUME_CODE, AccidentReport.DECLARATION_INDICATOR, AccidentReport.OFFICER_RANK, 
                        AccidentReport.DIVISION, AccidentReport.DECLARATION_DATE, AccidentReport.PRESERVE_DATE, AccidentReport.SCHOOL_NAME, 
                        AccidentReport.ACCIDENT_TIME, AccidentReport.PO_ARRIVAL_TIME, AccidentReport.PO_RESUME_DUTY_TIME
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${AccidentReport.ID} inserted successfully!`);
                        console.log("Insert result: ", result);
                    },
                    (tx, error) => {
                        console.error('Error insert accident report:', error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error('Error inserting accident report:', error);
        }
    };

    static async deleteAccident(db, id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteAccident SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getAll(db) {
        console.log("getAllAccidentReports");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName}`,
                    [],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new AccidentReport(
                                row.ID, row.INCIDENT_NO, row.DEVICE_ID, row.OFFICER_ID, row.IO_NAME, row.IO_EXTENSION_NO,
                                row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2, row.SPECIAL_ZONE,
                                row.REMARKS_LOCATION, row.CREATED_AT, row.STATUS_ID, row.STRUCTURE_DAMAGES, row.WEATHER_CODE,
                                row.WEATHER_OTHER_CODE, row.ROAD_SURFACE_CODE, row.ROAD_SURFACE_OTHER, row.TRAFFIC_VOLUME_CODE,
                                row.DECLARATION_INDICATOR, row.OFFICER_RANK, row.DIVISION, row.DECLARATION_DATE, row.PRESERVE_DATE,
                                row.SCHOOL_NAME, row.ACCIDENT_TIME, row.PO_ARRIVAL_TIME, row.PO_RESUME_DUTY_TIME));
                        });

                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getAllAccidentReports SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getIssuedOSI(db) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                // SQL query
                const sQuery = `SELECT osi.ID, osi.INCIDENT_NO, osi.CREATED_AT, 
                    CASE WHEN LENGTH(im.INCIDENT_OCCURED) > 0 THEN im.INCIDENT_OCCURED ELSE osi.INCIDENT_OCCURED END as INCIDENT_OCCURED, 
                    CASE WHEN LENGTH(im.LOCATION_CODE) > 0 THEN im.LOCATION_CODE ELSE osi.LOCATION_CODE END as LOCATION_CODE, 
                    CASE WHEN LENGTH(im.LOCATION_CODE_2) > 0 THEN im.LOCATION_CODE_2 ELSE osi.LOCATION_CODE_2 END as LOCATION_CODE_2, 
                    im.IMAGE_TYPE 
                    FROM ${this.tableName} as osi 
                    LEFT JOIN IMAGES as im ON im.ACCIDENT_REPORT_ID = osi.ID 
                    WHERE STATUS_ID >= 2`;

                const sQuery1 = `SELECT osi.ID, osi.INCIDENT_NO, osi.CREATED_AT, 
                                COALESCE(im.INCIDENT_OCCURED, osi.INCIDENT_OCCURED) as INCIDENT_OCCURED, 
                                COALESCE(im.LOCATION_CODE, osi.LOCATION_CODE) as LOCATION_CODE, 
                                COALESCE(im.LOCATION_CODE_2, osi.LOCATION_CODE_2) as LOCATION_CODE_2, 
                                im.IMAGE_TYPE 
                            FROM ${this.tableName} as osi 
                            LEFT JOIN (
                                SELECT im1.* 
                                FROM IMAGES im1
                                INNER JOIN (
                                    SELECT ACCIDENT_REPORT_ID, MIN(IMAGE_TYPE) as MinImageType
                                    FROM IMAGES
                                    GROUP BY ACCIDENT_REPORT_ID
                                ) im2
                                ON im1.ACCIDENT_REPORT_ID = im2.ACCIDENT_REPORT_ID AND im1.IMAGE_TYPE = im2.MinImageType
                            ) as im ON im.ACCIDENT_REPORT_ID = osi.ID 
                            WHERE STATUS_ID >= 2`;

                tx.executeSql(
                    sQuery1, 
                    [],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push({
                                ID: row.ID,
                                INCIDENT_NO: row.INCIDENT_NO,
                                CREATED_AT: row.CREATED_AT,
                                INCIDENT_OCCURED: row.INCIDENT_OCCURED,
                                LOCATION_CODE: row.LOCATION_CODE,
                                LOCATION_CODE_2: row.LOCATION_CODE_2,
                                IMAGE_TYPE: row.IMAGE_TYPE
                            });
                        });
                        console.log("getIssuedOSI list >> ", list.length);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getIssuedOSI SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getIssuedOSICount(db) {
        console.log("getIssuedOSICount ");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT count(*) as count FROM ${this.tableName} WHERE STATUS_ID >= ?`,
                    [2],
                    (tx, results) => {
                        let { rows } = results;
                        
                        if (rows.length > 0) {
                            const count = rows.item(0).count;
                            console.log("getIssuedOSICount count >> ", count);
                            resolve(count);
                        } else {
                            console.log("getIssuedOSICount count >> 0");
                            resolve(0);
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getIssuedOSICount SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }    

    static async getDraftAccidents(db) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE STATUS_ID < ? ORDER BY CREATED_AT ASC`,
                    [4],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new AccidentReport(
                                row.ID, row.INCIDENT_NO, row.DEVICE_ID, row.OFFICER_ID, row.IO_NAME, row.IO_EXTENSION_NO,
                                row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2, row.SPECIAL_ZONE,
                                row.REMARKS_LOCATION, row.CREATED_AT, row.STATUS_ID, row.STRUCTURE_DAMAGES, row.WEATHER_CODE,
                                row.WEATHER_OTHER_CODE, row.ROAD_SURFACE_CODE, row.ROAD_SURFACE_OTHER, row.TRAFFIC_VOLUME_CODE,
                                row.DECLARATION_INDICATOR, row.OFFICER_RANK, row.DIVISION, row.DECLARATION_DATE, row.PRESERVE_DATE,
                                row.SCHOOL_NAME, row.ACCIDENT_TIME, row.PO_ARRIVAL_TIME, row.PO_RESUME_DUTY_TIME));
                        });
                        console.log("getDraftAccidents list >> " , list.length);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getDraftAccidents SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getDraftCountAccidents(db) {
        console.log("getDraftCountAccidents ");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT count(*) as count FROM ${this.tableName} WHERE STATUS_ID < ?`,
                    [4],
                    (tx, results) => {
                        let { rows } = results;
                        
                        if (rows.length > 0) {
                            const count = rows.item(0).count;
                            console.log("getDraftCountAccidents count >> ", count);
                            resolve(count);
                        } else {
                            console.log("getDraftCountAccidents count >> 0");
                            resolve(0);
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getDraftCountAccidents SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }    

    static async getCountAccidentsByStatus(db, STATUS_ID) {
        console.log("getCountAccidentsByStatus ");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT count(*) as count FROM ${this.tableName} WHERE STATUS_ID <= ?`,
                    [STATUS_ID],
                    (tx, results) => {
                        let { rows } = results;
                        
                        if (rows.length > 0) {
                            const count = rows.item(0).count;
                            console.log("getCountAccidentsByStatus count >> ", count);
                            resolve(count);
                        } else {
                            console.log("getCountAccidentsByStatus count >> 0");
                            resolve(0);
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getCountAccidentsByStatus SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }    

    static async getAccidentsById(db, id) {
        console.log("getAccidentsById >> " , id);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        let { rows } = results;
                        let accidentReport = null;
                        if (rows.length > 0) {
                            const row = rows.item(0);
                            accidentReport = new AccidentReport(
                                row.ID, row.INCIDENT_NO, row.DEVICE_ID, row.OFFICER_ID, row.IO_NAME, row.IO_EXTENSION_NO,
                                row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2, row.SPECIAL_ZONE,
                                row.REMARKS_LOCATION, row.CREATED_AT, row.STATUS_ID, row.STRUCTURE_DAMAGES, row.WEATHER_CODE,
                                row.WEATHER_OTHER_CODE, row.ROAD_SURFACE_CODE, row.ROAD_SURFACE_OTHER, row.TRAFFIC_VOLUME_CODE,
                                row.DECLARATION_INDICATOR, row.OFFICER_RANK, row.DIVISION, row.DECLARATION_DATE, row.PRESERVE_DATE,
                                row.SCHOOL_NAME, row.ACCIDENT_TIME, row.PO_ARRIVAL_TIME, row.PO_RESUME_DUTY_TIME
                            );
                        }
    
                        console.log("AccidentReport >> ", accidentReport);
                        resolve(accidentReport);
                    },
                    (tx, error) => {
                        console.error("Error executing getAccidentsById SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async updateStatus(db, id, incidentNo, newStatusId) {
        console.log(`Updating STATUS_ID for ID: ${id} and INCIDENT_NO: ${incidentNo} to ${newStatusId}`);
        
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `UPDATE ${this.tableName} 
                        SET STATUS_ID = ? 
                        WHERE ID = ? AND INCIDENT_NO = ?`,
                    [newStatusId, id, incidentNo],
                    (tx, result) => {
                        console.log(`STATUS_ID updated successfully for ID: ${id} and INCIDENT_NO: ${incidentNo}`);
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