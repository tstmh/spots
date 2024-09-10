export default class Images {
    static tableName = "IMAGES"; 

    constructor(ID, ACCIDENT_REPORT_ID, OFFICER_ID, IMAGE_TYPE, CAPTION, IMAGE64, FILE_PATH, CREATED_AT, 
        TYPE_CODE, RAW_METADATA, FRONT_METADATA, LEFT_METADATA, RIGHT_METADATA, REAR_METADATA, TOP_METADATA,
        REGISTRATION_NO, MAKE_CODE, COLOR, COLOR_CODE, PLATE_DISPLAYED, ACCIDENT_DATE, EXAMINATION_DATE,
        INCIDENT_OCCURED, LOCATION_CODE, LOCATION_CODE_2, BOX_METADATA) {
            this.ID=ID;
            this.ACCIDENT_REPORT_ID=ACCIDENT_REPORT_ID;
            this.OFFICER_ID=OFFICER_ID;
            this.IMAGE_TYPE=IMAGE_TYPE;
            this.CAPTION=CAPTION;
            this.IMAGE64=IMAGE64;
            this.FILE_PATH=FILE_PATH;
            this.CREATED_AT=CREATED_AT;
            this.TYPE_CODE=TYPE_CODE;
            this.RAW_METADATA=RAW_METADATA;
            this.FRONT_METADATA=FRONT_METADATA;
            this.LEFT_METADATA=LEFT_METADATA;
            this.RIGHT_METADATA=RIGHT_METADATA;
            this.REAR_METADATA=REAR_METADATA;
            this.TOP_METADATA=TOP_METADATA;
            this.REGISTRATION_NO=REGISTRATION_NO;
            this.MAKE_CODE=MAKE_CODE;
            this.COLOR=COLOR;
            this.COLOR_CODE=COLOR_CODE;
            this.PLATE_DISPLAYED=PLATE_DISPLAYED;
            this.ACCIDENT_DATE=ACCIDENT_DATE;
            this.EXAMINATION_DATE=EXAMINATION_DATE;
            this.INCIDENT_OCCURED=INCIDENT_OCCURED;
            this.LOCATION_CODE=LOCATION_CODE;
            this.LOCATION_CODE_2=LOCATION_CODE_2;
            this.BOX_METADATA=BOX_METADATA;
    }

    static async createTable(db) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                        ID                 TEXT    NOT NULL UNIQUE,
                        ACCIDENT_REPORT_ID TEXT    NOT NULL,
                        OFFICER_ID         INTEGER NOT NULL,
                        IMAGE_TYPE         TEXT    NOT NULL,
                        CAPTION            TEXT,
                        IMAGE64            BLOB    NOT NULL,
                        FILE_PATH          TEXT,
                        CREATED_AT         TEXT    NOT NULL,
                        TYPE_CODE          TEXT,
                        RAW_METADATA       BLOB,
                        FRONT_METADATA     BLOB,
                        LEFT_METADATA      BLOB,
                        RIGHT_METADATA     BLOB,
                        REAR_METADATA      BLOB,
                        TOP_METADATA       BLOB,
                        REGISTRATION_NO    TEXT,
                        MAKE_CODE          TEXT,
                        COLOR              TEXT,
                        PLATE_DISPLAYED    INTEGER,
                        ACCIDENT_DATE      TEXT,
                        EXAMINATION_DATE   TEXT,
                        INCIDENT_OCCURED   INTEGER,
                        LOCATION_CODE      TEXT,
                        LOCATION_CODE_2    TEXT,
                        BOX_METADATA       BLOB,
                        COLOR_CODE         TEXT,
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

    static async insert(db, Images) {
        console.log("insertReplaceImages ", Images.ID);
        console.log("insertReplaceImages ", Images);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID,
                        ACCIDENT_REPORT_ID,
                        OFFICER_ID,
                        IMAGE_TYPE,
                        CAPTION,
                        IMAGE64,
                        FILE_PATH,
                        CREATED_AT,
                        TYPE_CODE,
                        RAW_METADATA,
                        FRONT_METADATA,
                        LEFT_METADATA,
                        RIGHT_METADATA,
                        REAR_METADATA,
                        TOP_METADATA,
                        REGISTRATION_NO,
                        MAKE_CODE,
                        COLOR,
                        PLATE_DISPLAYED,
                        ACCIDENT_DATE,
                        EXAMINATION_DATE,
                        INCIDENT_OCCURED,
                        LOCATION_CODE,
                        LOCATION_CODE_2,
                        BOX_METADATA,
                        COLOR_CODE            
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        Images.ID, Images.ACCIDENT_REPORT_ID, Images.OFFICER_ID, Images.IMAGE_TYPE,
                        Images.CAPTION, Images.IMAGE64, Images.FILE_PATH, Images.CREATED_AT,
                        Images.TYPE_CODE, Images.RAW_METADATA, Images.FRONT_METADATA, Images.LEFT_METADATA,
                        Images.RIGHT_METADATA, Images.REAR_METADATA, Images.TOP_METADATA, 
                        Images.REGISTRATION_NO, Images.MAKE_CODE, Images.COLOR, Images.PLATE_DISPLAYED, 
                        Images.ACCIDENT_DATE, Images.EXAMINATION_DATE, Images.INCIDENT_OCCURED, 
                        Images.LOCATION_CODE, Images.LOCATION_CODE_2, Images.BOX_METADATA, Images.COLOR_CODE
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${Images.ID} inserted successfully!`);
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

    static async deleteImages(db, id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteImages SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getAll(db) {
        console.log("getAllImages");
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName}`,
                    [],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new PartiesInvolved(
                                row.ID, row.ACCIDENT_REPORT_ID, row.OFFICER_ID, row.IMAGE_TYPE, row.CAPTION, row.IMAGE64, row.FILE_PATH, row.CREATED_AT, row.
                                row.TYPE_CODE, row.RAW_METADATA, row.FRONT_METADATA, row.LEFT_METADATA, row.RIGHT_METADATA, row.REAR_METADATA, row.TOP_METADATA,
                                row.REGISTRATION_NO, row.MAKE_CODE, row.COLOR, row.COLOR_CODE, row.PLATE_DISPLAYED, row.ACCIDENT_DATE, row.EXAMINATION_DATE,
                                row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2, row.BOX_METADATA));
                        });

                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getAllImages SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getImagesByAccidentID(db, ACCIDENT_REPORT_ID) {
        console.log("getImagesByAccidentID >> ", ACCIDENT_REPORT_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ACCIDENT_REPORT_ID = ?`,
                    [ACCIDENT_REPORT_ID],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Images(
                                row.ID, row.ACCIDENT_REPORT_ID, row.OFFICER_ID, row.IMAGE_TYPE, row.CAPTION, row.IMAGE64, row.FILE_PATH, row.CREATED_AT,
                                row.TYPE_CODE, row.RAW_METADATA, row.FRONT_METADATA, row.LEFT_METADATA, row.RIGHT_METADATA, row.REAR_METADATA, row.TOP_METADATA,
                                row.REGISTRATION_NO, row.MAKE_CODE, row.COLOR, row.COLOR_CODE, row.PLATE_DISPLAYED, row.ACCIDENT_DATE, row.EXAMINATION_DATE,
                                row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2, row.BOX_METADATA));
                        });
                        console.log(`getImagesByAccidentID list >> ${list.length} retrieved successfully!`);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error(`Error executing getImagesByAccidentID SQL query:`, error);
                        reject(error);
                    }
                );
            }, error => {
                console.error('Transaction error:', error);
                reject(error);
            });
        });
    }

    static async getSketchImagesByID(db, ID) {
        console.log(`getSketchImagesByID >> ${ID}`);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ID = ?`,
                    [ID],
                    (tx, results) => {
                        let { rows } = results;
                        let image = null;
                        if (rows.length > 0) {
                            const row = rows.item(0);
                            image = new Images(
                                row.ID, row.ACCIDENT_REPORT_ID, row.OFFICER_ID, row.IMAGE_TYPE, row.CAPTION, row.IMAGE64, row.FILE_PATH, row.CREATED_AT,
                                row.TYPE_CODE, row.RAW_METADATA, row.FRONT_METADATA, row.LEFT_METADATA, row.RIGHT_METADATA, row.REAR_METADATA, row.TOP_METADATA,
                                row.REGISTRATION_NO, row.MAKE_CODE, row.COLOR, row.COLOR_CODE, row.PLATE_DISPLAYED, row.ACCIDENT_DATE, row.EXAMINATION_DATE,
                                row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2, row.BOX_METADATA
                            );
                        }
                        console.log("sketch >> ", image);
                        resolve(image);
                    },
                    (tx, error) => {
                        console.error(`Error executing getSketchImagesByID SQL query:`, error);
                        reject(error);
                    }
                );
            }, error => {
                console.error('Transaction error:', error);
                reject(error);
            });
        });
    }

    static async getImagesByAccIDImgType(db, ACCIDENT_REPORT_ID, IMAGE_TYPE) {
        console.log(`getImagesByAccIDImgType >> ${ACCIDENT_REPORT_ID}, ${IMAGE_TYPE}`);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ACCIDENT_REPORT_ID = ? AND IMAGE_TYPE = ?`,
                    [ACCIDENT_REPORT_ID, IMAGE_TYPE],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Images(
                                row.ID, row.ACCIDENT_REPORT_ID, row.OFFICER_ID, row.IMAGE_TYPE, row.CAPTION, row.IMAGE64, row.FILE_PATH, row.CREATED_AT,
                                row.TYPE_CODE, row.RAW_METADATA, row.FRONT_METADATA, row.LEFT_METADATA, row.RIGHT_METADATA, row.REAR_METADATA, row.TOP_METADATA,
                                row.REGISTRATION_NO, row.MAKE_CODE, row.COLOR, row.COLOR_CODE, row.PLATE_DISPLAYED, row.ACCIDENT_DATE, row.EXAMINATION_DATE,
                                row.INCIDENT_OCCURED, row.LOCATION_CODE, row.LOCATION_CODE_2, row.BOX_METADATA));
                        });
                        console.log(`getImagesByAccIDImgType list >> ${list.length} retrieved successfully!`);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error(`Error executing getImagesByAccIDImgType SQL query:`, error);
                        reject(error);
                    }
                );
            }, error => {
                console.error('Transaction error:', error);
                reject(error);
            });
        });
    }

    static async insertPhotoUpload(db, photoUpload) {
        //console.log('insertPhotoUpload', photoUpload);
        try {
            await db.transaction(async (tx) => {
                await new Promise((resolve, reject) => {
                    tx.executeSql(
                        `INSERT OR REPLACE INTO ${this.tableName} (
                            ID,
                            ACCIDENT_REPORT_ID,
                            OFFICER_ID,
                            IMAGE_TYPE,
                            CAPTION,
                            IMAGE64,
                            CREATED_AT
                        ) VALUES (?,?,?,?,?,?,?)`,
                        [
                            photoUpload.ID, photoUpload.ACCIDENT_REPORT_ID, photoUpload.OFFICER_ID,
                            photoUpload.IMAGE_TYPE, photoUpload.CAPTION, photoUpload.IMAGE64, photoUpload.CREATED_AT,
                        ],
                        (tx, result) => {
                            console.log(
                                `${this.tableName} entry with ID: ${photoUpload.ID} inserted successfully!`
                            );
                            console.log('Insert result: ', result);
                            resolve(result);
                        },
                        (tx, error) => {
                            console.error( `Error in insertPhotoUpload ${this.tableName}:`, error );
                            reject(error);
                        }
                    );
                });
            });
        } catch (error) {
            console.error(`Error insertPhotoUpload ${this.tableName}:`, error);
        }
    };

    static async insertSketch(db, sketch) {
        //console.log("insertSketch ", sketch);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                 ,
                        ACCIDENT_REPORT_ID ,
                        OFFICER_ID         ,
                        IMAGE_TYPE         ,
                        CAPTION            ,
                        IMAGE64            ,
                        CREATED_AT         ,
                        RAW_METADATA
                    )
                    VALUES (?,?,?,?,?,?,?,?)`,
                    [
                        sketch.ID, sketch.ACCIDENT_REPORT_ID, sketch.OFFICER_ID, sketch.IMAGE_TYPE, 
                        sketch.CAPTION, sketch.IMAGE64, sketch.CREATED_AT, sketch.RAW_METADATA
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${photoUpload.ID} inserted successfully!`);
                        console.log("Insert result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertSketch ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertSketch ${this.tableName}:`, error);
        }
    };

    static async insertVdr(db, vdr) {
        console.log("insertVdr ", vdr);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                 ,
                        ACCIDENT_REPORT_ID ,
                        OFFICER_ID         ,
                        IMAGE_TYPE         ,
                        CAPTION            ,
                        IMAGE64            ,
                        CREATED_AT         ,
                        TYPE_CODE
                    )
                    VALUES (?,?,?,?,?,?,?,?)`,
                    [
                        vdr.ID, vdr.ACCIDENT_REPORT_ID, vdr.OFFICER_ID, vdr.IMAGE_TYPE, 
                        vdr.CAPTION, vdr.IMAGE64, vdr.CREATED_AT, vdr.TYPE_CODE
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${vdr.ID} inserted successfully!`);
                        console.log("Insert result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertVdr ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertVdr ${this.tableName}:`, error);
        }
    };

    static async insertVdrWithImage(db, vdr) {
        //console.log("insertVdrWithImage ", vdr);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID,
                        ACCIDENT_REPORT_ID,
                        OFFICER_ID,
                        IMAGE_TYPE,
                        CAPTION,
                        IMAGE64,
                        CREATED_AT,
                        TYPE_CODE,
                        REGISTRATION_NO,
                        MAKE_CODE,
                        COLOR,
                        COLOR_CODE,
                        PLATE_DISPLAYED,
                        ACCIDENT_DATE,
                        EXAMINATION_DATE,
                        INCIDENT_OCCURED,
                        LOCATION_CODE,
                        LOCATION_CODE_2,
                        FILE_PATH,
                        RAW_METADATA,
                        FRONT_METADATA,
                        LEFT_METADATA,
                        RIGHT_METADATA,
                        REAR_METADATA,
                        TOP_METADATA,
                        BOX_METADATA
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        vdr.ID, vdr.ACCIDENT_REPORT_ID, vdr.OFFICER_ID, vdr.IMAGE_TYPE, vdr.CAPTION, 
                        vdr.IMAGE64, vdr.CREATED_AT, vdr.TYPE_CODE, vdr.REGISTRATION_NO, vdr.MAKE_CODE,
                        vdr.COLOR, vdr.COLOR_CODE, vdr.PLATE_DISPLAYED, vdr.ACCIDENT_DATE, vdr.EXAMINATION_DATE,
                        vdr.INCIDENT_OCCURED, vdr.LOCATION_CODE, vdr.LOCATION_CODE_2, vdr.FILE_PATH,
                        vdr.RAW_METADATA, vdr.FRONT_METADATA, vdr.LEFT_METADATA, vdr.RIGHT_METADATA,
                        vdr.REAR_METADATA, vdr.TOP_METADATA, vdr.BOX_METADATA
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${vdr.ID} inserted successfully!`);
                        console.log("insertVdrWithImage result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertVdrWithImage ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertVdrWithImage ${this.tableName}:`, error);
        }
    };

    static async updateCaption(db, id, accidentReportId, newCaption) {
        console.log(`updateCaption ${id}, ${accidentReportId}, ${newCaption}`)
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `UPDATE ${this.tableName} 
                        SET CAPTION = ? 
                        WHERE ID = ? AND ACCIDENT_REPORT_ID = ?`,
                    [newCaption, id, accidentReportId]
                );
            });
            console.log(`Caption updated successfully for ID: ${id} and ACCIDENT_REPORT_ID: ${accidentReportId}`);
        } catch (error) {
            console.error(`Error updating caption for ID: ${id} and ACCIDENT_REPORT_ID: ${accidentReportId}:`, error);
        }
    };
    

}