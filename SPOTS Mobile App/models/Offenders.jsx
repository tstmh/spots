export default class Offenders {
    static tableName = "OFFENDER";

    constructor(ID,SUMMONS_ID,OFFENDER_TYPE_ID,REGISTRATION_NO,LOCAL_PLATE,SPECIAL_PLATE,UNDER_ARREST,BAIL_GRANTED,BREATH_ANALYZER,FURNISH_INSURANCE,
        NAME,INVOLVEMENT_ID,ID_TYPE,IDENTIFICATION_NO,DATE_OF_BIRTH,GENDER_CODE,LICENSE_TYPE_CODE,LICENSE_EXPIRY_DATE, LICENSE_CLASS_CODE,BIRTH_COUNTRY, NATIONALITY,
        CONTACT_1,CONTACT_2,REMARKS_IDENTIFICATION, ADDRESS_TYPE, SAME_AS_REGISTERED, BLOCK, STREET, FLOOR, UNIT_NO, BUILDING_NAME, POSTAL_CODE,
        REMARKS_ADDRESS, TYPE_CODE, CATEGORY_CODE, TRANSMISSION_TYPE, ELIGIBLE_CLASS_3C, MAKE_CODE, COLOR, WEIGHT, OPERATION_TYPE,
        OTHER_LICENCE, NOT_OFFENDER, COLOR_CODE) {
            this.ID = ID;
            this.SUMMONS_ID = SUMMONS_ID;
            this.OFFENDER_TYPE_ID = OFFENDER_TYPE_ID;
            this.REGISTRATION_NO = REGISTRATION_NO;
            this.LOCAL_PLATE = LOCAL_PLATE;
            this.SPECIAL_PLATE = SPECIAL_PLATE;
            this.UNDER_ARREST = UNDER_ARREST;
            this.BAIL_GRANTED = BAIL_GRANTED;
            this.BREATH_ANALYZER = BREATH_ANALYZER;
            this.FURNISH_INSURANCE = FURNISH_INSURANCE;
            this.NAME = NAME;
            this.INVOLVEMENT_ID = INVOLVEMENT_ID;
            this.ID_TYPE = ID_TYPE;
            this.IDENTIFICATION_NO = IDENTIFICATION_NO;
            this.DATE_OF_BIRTH = DATE_OF_BIRTH;
            this.GENDER_CODE = GENDER_CODE;
            this.LICENSE_TYPE_CODE = LICENSE_TYPE_CODE;
            this.LICENSE_EXPIRY_DATE = LICENSE_EXPIRY_DATE;
            this.LICENSE_CLASS_CODE = LICENSE_CLASS_CODE;
            this.BIRTH_COUNTRY = BIRTH_COUNTRY;
            this.NATIONALITY = NATIONALITY;
            this.CONTACT_1 = CONTACT_1;
            this.CONTACT_2 = CONTACT_2;
            this.REMARKS_IDENTIFICATION = REMARKS_IDENTIFICATION;
            this.ADDRESS_TYPE = ADDRESS_TYPE;
            this.SAME_AS_REGISTERED = SAME_AS_REGISTERED;
            this.BLOCK = BLOCK;
            this.STREET = STREET;
            this.FLOOR = FLOOR;
            this.UNIT_NO = UNIT_NO;
            this.BUILDING_NAME = BUILDING_NAME;
            this.POSTAL_CODE = POSTAL_CODE;
            this.REMARKS_ADDRESS = REMARKS_ADDRESS;
            this.TYPE_CODE = TYPE_CODE;
            this.CATEGORY_CODE = CATEGORY_CODE;
            this.TRANSMISSION_TYPE = TRANSMISSION_TYPE;
            this.ELIGIBLE_CLASS_3C = ELIGIBLE_CLASS_3C;
            this.MAKE_CODE = MAKE_CODE;
            this.COLOR = COLOR;
            this.WEIGHT = WEIGHT;
            this.OPERATION_TYPE = OPERATION_TYPE;
            this.OTHER_LICENCE = OTHER_LICENCE;
            this.NOT_OFFENDER = NOT_OFFENDER;
            this.COLOR_CODE = COLOR_CODE;
        }

    static async createTable(db) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                        ID                     INTEGER NOT NULL UNIQUE,
                        SUMMONS_ID             TEXT    NOT NULL,
                        OFFENDER_TYPE_ID       INTEGER NOT NULL,
                        REGISTRATION_NO        TEXT,
                        LOCAL_PLATE            INTEGER,
                        SPECIAL_PLATE          INTEGER,
                        UNDER_ARREST           INTEGER,
                        BAIL_GRANTED           INTEGER,
                        BREATH_ANALYZER        INTEGER,
                        FURNISH_INSURANCE      TEXT,
                        NAME                   TEXT,
                        INVOLVEMENT_ID         INTEGER NOT NULL,
                        ID_TYPE                INTEGER NOT NULL,
                        IDENTIFICATION_NO      TEXT    NOT NULL,
                        DATE_OF_BIRTH          TEXT,
                        GENDER_CODE            INTEGER,
                        LICENSE_TYPE_CODE      INTEGER,
                        LICENSE_EXPIRY_DATE    TEXT,
                        LICENSE_CLASS_CODE     TEXT,
                        BIRTH_COUNTRY          TEXT,
                        NATIONALITY            TEXT,
                        CONTACT_1              TEXT,
                        CONTACT_2              TEXT,
                        REMARKS_IDENTIFICATION TEXT,
                        ADDRESS_TYPE           INTEGER,
                        SAME_AS_REGISTERED     INTEGER,
                        BLOCK                  TEXT,
                        STREET                 TEXT,
                        FLOOR                  TEXT,
                        UNIT_NO                TEXT,
                        BUILDING_NAME          TEXT,
                        POSTAL_CODE            TEXT,
                        REMARKS_ADDRESS        TEXT,
                        TYPE_CODE              TEXT,
                        CATEGORY_CODE          INTEGER,
                        TRANSMISSION_TYPE      INTEGER,
                        ELIGIBLE_CLASS_3C      INTEGER,
                        MAKE_CODE              TEXT,
                        COLOR                  TEXT,
                        WEIGHT                 TEXT,
                        OPERATION_TYPE         INTEGER,
                        OTHER_LICENCE          TEXT,
                        NOT_OFFENDER           INTEGER,
                        COLOR_CODE             TEXT,
                        PRIMARY KEY (
                            ID
                        )
                    );`,
                    [],
                    (tx, result) => {
                        console.log(`${this.tableName} table created successfully!`);
                            console.log("Insert result: ", result);
                    },
                    (tx, error) => {
                        console.error('Error creating table:', error);
                        throw false;
                    }
                );
            });
            // console.log(`${this.tableName} table created successfully!`);
            } catch (error) {
                console.error(`Error creating ${this.tableName} table:`, error);
            }
        }

    static async insert(db, Offender) {
        console.log("insertReplaceOffender ", Offender);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID,
                        SUMMONS_ID,
                        OFFENDER_TYPE_ID,
                        REGISTRATION_NO,
                        LOCAL_PLATE,
                        SPECIAL_PLATE,
                        UNDER_ARREST,
                        BAIL_GRANTED,
                        BREATH_ANALYZER,
                        FURNISH_INSURANCE,
                        NAME,
                        INVOLVEMENT_ID,
                        ID_TYPE,
                        IDENTIFICATION_NO,
                        DATE_OF_BIRTH,
                        GENDER_CODE,
                        LICENSE_TYPE_CODE,
                        LICENSE_EXPIRY_DATE,
                        LICENSE_CLASS_CODE,
                        BIRTH_COUNTRY,
                        NATIONALITY,
                        CONTACT_1,
                        CONTACT_2,
                        REMARKS_IDENTIFICATION,
                        ADDRESS_TYPE,
                        SAME_AS_REGISTERED,
                        BLOCK,
                        STREET,
                        FLOOR,
                        UNIT_NO,
                        BUILDING_NAME,
                        POSTAL_CODE,
                        REMARKS_ADDRESS,
                        TYPE_CODE,
                        CATEGORY_CODE,
                        TRANSMISSION_TYPE,
                        ELIGIBLE_CLASS_3C,
                        MAKE_CODE,
                        COLOR,
                        WEIGHT,
                        OPERATION_TYPE,
                        OTHER_LICENCE,
                        NOT_OFFENDER,
                        COLOR_CODE
                    )
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        Offender.ID,Offender.SUMMONS_ID,Offender.OFFENDER_TYPE_ID,Offender.REGISTRATION_NO,Offender.LOCAL_PLATE,
                        Offender.SPECIAL_PLATE,Offender.UNDER_ARREST,Offender.BAIL_GRANTED,Offender.BREATH_ANALYZER,
                        Offender.FURNISH_INSURANCE,Offender.NAME,Offender.INVOLVEMENT_ID,Offender.ID_TYPE,Offender.IDENTIFICATION_NO,
                        Offender.DATE_OF_BIRTH,Offender.GENDER_CODE,Offender.LICENSE_TYPE_CODE,Offender.LICENSE_EXPIRY_DATE,
                        Offender.LICENSE_CLASS_CODE,Offender.BIRTH_COUNTRY,Offender.NATIONALITY,Offender.CONTACT_1,Offender.CONTACT_2,
                        Offender.REMARKS_IDENTIFICATION,Offender.ADDRESS_TYPE,Offender.SAME_AS_REGISTERED,Offender.BLOCK,Offender.STREET,
                        Offender.FLOOR,Offender.UNIT_NO,Offender.BUILDING_NAME,Offender.POSTAL_CODE,Offender.REMARKS_ADDRESS,
                        Offender.TYPE_CODE,Offender.CATEGORY_CODE,Offender.TRANSMISSION_TYPE,Offender.ELIGIBLE_CLASS_3C,Offender.MAKE_CODE,
                        Offender.COLOR,Offender.WEIGHT,Offender.OPERATION_TYPE,Offender.OTHER_LICENCE,Offender.NOT_OFFENDER,Offender.COLOR_CODE
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${Offender.ID} inserted successfully!`);
                            console.log("Insert result: ", result);
                    },
                    (tx, error) => {
                        console.error('Error inserting offender:', error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error('Error inserting offender:', error);
        }
    };

    static async deleteOffender(db, id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteOffender SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async deleteOffenderBySummonId(db, id, summonId) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ? AND SUMMONS_ID = ?`,
                    [id, summonId],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteOffenderBySummonId SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async deleteOffenderByRegNo(db, SUMMONS_ID, REGISTRATION_NO) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE SUMMONS_ID = ? AND REGISTRATION_NO = ?`,
                    [SUMMONS_ID, REGISTRATION_NO],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteOffenderByRegNo SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async deleteOffenderByOffenceId(db, summonsId, offenceId) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                const query = `DELETE 
                    FROM OFFENDER AS OFR
                    WHERE OFR.ID IN (
                        SELECT DISTINCT OFR.ID
                        FROM OFFENCES as OFS 
                        LEFT JOIN OFFENDER AS OFR ON OFS.OFFENDER_ID = OFR.ID
                        WHERE OFR.SUMMONS_ID = ? AND OFS.PARENT_ID = ?
                    )`;
                tx.executeSql(
                    query,
                    [summonsId, offenceId],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deleteOffenderBySummonId SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async getOffendersCountBySummonsID(db, SUMMONS_ID) {
        console.log("getOffendersCountBySummonsID >> ", SUMMONS_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT count(*) as count FROM ${this.tableName} WHERE SUMMONS_ID = ?`,
                    [SUMMONS_ID],
                    (tx, results) => {
                        let { rows } = results;
                        console.log(`getOffendersCountBySummonsID rows.raw >>  `, rows.raw());
                        
                        if (rows.length > 0) {
                            const count = rows.item(0).count;
                            console.log(`getOffendersCountBySummonsID ${SUMMONS_ID} count >>  `, count);
                            resolve(count);
                        } else {
                            console.log(`getOffendersCountBySummonsID ${SUMMONS_ID} count >> 0`);
                            resolve(0);
                        }
                    },
                    (tx, error) => {
                        console.error("Error executing getOffendersCountBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }    

    static async getOffendersListBySummonsID(db, SUMMONS_ID) {
        console.log("getOffendersListBySummonsID >> ", SUMMONS_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE SUMMONS_ID = ?`,
                    [SUMMONS_ID],
                    (tx, results) => {
                        let { rows } = results;
                        console.log('getOffendersListBySummonsID' , rows.raw());
                        let list = rows.raw().map(row => ({
                            registrationNo: row.REGISTRATION_NO,
                            name: row.OFFENDER_TYPE_ID === 1 ? row.NAME : null,
                            offenderType: row.OFFENDER_TYPE_ID,
                        }));
                        console.log(`getOffendersListBySummonsID ${SUMMONS_ID} list ${list.length} >> `, list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.log("Error executing getOffendersListBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getOffendersReportBySummonsID (db, SUMMONS_ID) {
        console.log("getOffendersReportBySummonsID >> ", SUMMONS_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE SUMMONS_ID = ? AND (NOT_OFFENDER = 'false' or NOT_OFFENDER is null or NOT_OFFENDER = 0)`,
                    [SUMMONS_ID],
                    (tx, results) => {
                        let {rows} = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Offenders(
                                row.ID, row.SUMMONS_ID, row.OFFENDER_TYPE_ID, row.REGISTRATION_NO, row.LOCAL_PLATE, row.SPECIAL_PLATE, row.UNDER_ARREST, row.BAIL_GRANTED,
                                row.BREATH_ANALYZER, row.FURNISH_INSURANCE, row.NAME, row.INVOLVEMENT_ID, row.ID_TYPE, row.IDENTIFICATION_NO, row.DATE_OF_BIRTH, row.GENDER_CODE,
                                row.LICENSE_TYPE_CODE, row.LICENSE_EXPIRY_DATE, row.LICENSE_CLASS_CODE, row.BIRTH_COUNTRY, row.NATIONALITY, row.CONTACT_1, row.CONTACT_2, row.REMARKS_IDENTIFICATION,
                                row.ADDRESS_TYPE, row.SAME_AS_REGISTERED, row.BLOCK, row.STREET, row.FLOOR, row.UNIT_NO, row.BUILDING_NAME, row.POSTAL_CODE, row.REMARKS_ADDRESS, row.TYPE_CODE,
                                row.CATEGORY_CODE, row.TRANSMISSION_TYPE, row.ELIGIBLE_CLASS_3C, row.MAKE_CODE, row.COLOR, row.WEIGHT, row.OPERATION_TYPE, row.OTHER_LICENCE, row.NOT_OFFENDER, row.COLOR_CODE));
                        });
                        console.log(`getOffenderBySummonsID ${SUMMONS_ID} list >> `, list.length);
                        resolve(list);
                    },
                    (tx,error) => {
                        console.log("Error executing getOffenderBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };
    
    static async getOffendersBySummonsID (db, SUMMONS_ID) {
        console.log("getOffendersBySummonsID >> ", SUMMONS_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE SUMMONS_ID = ?`,
                    [SUMMONS_ID],
                    (tx, results) => {
                        let {rows} = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Offenders(
                                row.ID, row.SUMMONS_ID, row.OFFENDER_TYPE_ID, row.REGISTRATION_NO, row.LOCAL_PLATE, row.SPECIAL_PLATE, row.UNDER_ARREST, row.BAIL_GRANTED,
                                row.BREATH_ANALYZER, row.FURNISH_INSURANCE, row.NAME, row.INVOLVEMENT_ID, row.ID_TYPE, row.IDENTIFICATION_NO, row.DATE_OF_BIRTH, row.GENDER_CODE,
                                row.LICENSE_TYPE_CODE, row.LICENSE_EXPIRY_DATE, row.LICENSE_CLASS_CODE, row.BIRTH_COUNTRY, row.NATIONALITY, row.CONTACT_1, row.CONTACT_2, row.REMARKS_IDENTIFICATION,
                                row.ADDRESS_TYPE, row.SAME_AS_REGISTERED, row.BLOCK, row.STREET, row.FLOOR, row.UNIT_NO, row.BUILDING_NAME, row.POSTAL_CODE, row.REMARKS_ADDRESS, row.TYPE_CODE,
                                row.CATEGORY_CODE, row.TRANSMISSION_TYPE, row.ELIGIBLE_CLASS_3C, row.MAKE_CODE, row.COLOR, row.WEIGHT, row.OPERATION_TYPE, row.OTHER_LICENCE, row.NOT_OFFENDER, row.COLOR_CODE));
                        });
                        console.log(`getOffenderBySummonsID ${SUMMONS_ID} list >> `, list.length);
                        resolve(list);
                    },
                    (tx,error) => {
                        console.log("Error executing getOffenderBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async getOffendersBySummonsOffenderType (db, SUMMONS_ID, OFFENDER_TYPE_ID ) {
        console.log("getOffendersBySummonsID >> ", SUMMONS_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE SUMMONS_ID = ? AND OFFENDER_TYPE_ID = ?`,
                    [SUMMONS_ID, OFFENDER_TYPE_ID],
                    (tx, results) => {
                        let {rows} = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new Offenders(
                                row.ID, row.SUMMONS_ID, row.OFFENDER_TYPE_ID, row.REGISTRATION_NO, row.LOCAL_PLATE, row.SPECIAL_PLATE, row.UNDER_ARREST, row.BAIL_GRANTED,
                                row.BREATH_ANALYZER, row.FURNISH_INSURANCE, row.NAME, row.INVOLVEMENT_ID, row.ID_TYPE, row.IDENTIFICATION_NO, row.DATE_OF_BIRTH, row.GENDER_CODE,
                                row.LICENSE_TYPE_CODE, row.LICENSE_EXPIRY_DATE, row.LICENSE_CLASS_CODE, row.BIRTH_COUNTRY, row.NATIONALITY, row.CONTACT_1, row.CONTACT_2, row.REMARKS_IDENTIFICATION,
                                row.ADDRESS_TYPE, row.SAME_AS_REGISTERED, row.BLOCK, row.STREET, row.FLOOR, row.UNIT_NO, row.BUILDING_NAME, row.POSTAL_CODE, row.REMARKS_ADDRESS, row.TYPE_CODE,
                                row.CATEGORY_CODE, row.TRANSMISSION_TYPE, row.ELIGIBLE_CLASS_3C, row.MAKE_CODE, row.COLOR, row.WEIGHT, row.OPERATION_TYPE, row.OTHER_LICENCE, row.NOT_OFFENDER, row.COLOR_CODE));
                        });
                        console.log(`getOffenderBySummonsID ${SUMMONS_ID} list >> `, list.length);
                        resolve(list);
                    },
                    (tx,error) => {
                        console.log("Error executing getOffenderBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    static async getOffendersByOffence(db, SUMMONS_ID, offenceCode) {
        console.log("getOffendersByOffence >> ", SUMMONS_ID, offenceCode);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                let query = `SELECT OFR.* 
                    FROM OFFENDER AS OFR
                    WHERE OFR.ID IN (
                        SELECT DISTINCT OFR.ID
                        FROM OFFENCES as OFS 
                        LEFT JOIN OFFENDER AS OFR ON OFS.OFFENDER_ID = OFR.ID
                        WHERE OFR.SUMMONS_ID = ? AND OFS.OFFENCE_TYPE_ID = ?
                    )`;
                let params = [SUMMONS_ID, offenceCode];
    
                tx.executeSql(
                    query,
                    params,
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach((row, index) => {
                            try {
                                list.push(new Offenders(
                                    row.ID, row.SUMMONS_ID, row.OFFENDER_TYPE_ID, row.REGISTRATION_NO, row.LOCAL_PLATE, row.SPECIAL_PLATE, row.UNDER_ARREST, row.BAIL_GRANTED,
                                    row.BREATH_ANALYZER, row.FURNISH_INSURANCE, row.NAME, row.INVOLVEMENT_ID, row.ID_TYPE, row.IDENTIFICATION_NO, row.DATE_OF_BIRTH,
                                    row.GENDER_CODE, row.LICENSE_TYPE_CODE, row.LICENSE_EXPIRY_DATE, row.LICENSE_CLASS_CODE, row.BIRTH_COUNTRY, row.NATIONALITY,
                                    row.CONTACT_1, row.CONTACT_2, row.REMARKS_IDENTIFICATION, row.ADDRESS_TYPE, row.SAME_AS_REGISTERED, row.BLOCK, row.STREET, row.FLOOR,
                                    row.UNIT_NO, row.BUILDING_NAME, row.POSTAL_CODE, row.REMARKS_ADDRESS, row.TYPE_CODE, row.CATEGORY_CODE, row.TRANSMISSION_TYPE,
                                    row.ELIGIBLE_CLASS_3C, row.MAKE_CODE, row.COLOR, row.WEIGHT, row.OPERATION_TYPE, row.OTHER_LICENCE, row.NOT_OFFENDER, row.COLOR_CODE
                                ));
                            } catch (error) {
                                console.error(`Error processing row ${index}: `, error);
                            }
                        });
                        console.log(`getOffenderBySummonsID ${SUMMONS_ID} list >> ${list.length}`);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.log("Error executing getOffenderBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            }, (transactionError) => {
                console.error("Transaction error: ", transactionError);
                reject(transactionError);
            });
        });
    }
    

    static async insertOffender (db, offender) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                              ,
                        SUMMONS_ID                      ,
                        OFFENDER_TYPE_ID                ,
                        NAME                            ,
                        INVOLVEMENT_ID                  ,
                        ID_TYPE                         ,
                        IDENTIFICATION_NO               ,
                        DATE_OF_BIRTH                   ,
                        GENDER_CODE                     ,
                        BIRTH_COUNTRY                   ,
                        NATIONALITY                     ,
                        CONTACT_1                       ,
                        CONTACT_2                       ,
                        REMARKS_IDENTIFICATION          ,
                        ADDRESS_TYPE                    ,
                        SAME_AS_REGISTERED              ,
                        BLOCK                           ,
                        STREET                          ,
                        FLOOR                           ,
                        UNIT_NO                         ,
                        BUILDING_NAME                   ,
                        POSTAL_CODE                     ,
                        REMARKS_ADDRESS                 
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        offender.ID,offender.SUMMONS_ID,offender.OFFENDER_TYPE_ID,offender.NAME,offender.INVOLVEMENT_ID,offender.ID_TYPE,
                        offender.IDENTIFICATION_NO,offender.DATE_OF_BIRTH,offender.GENDER_CODE,offender.BIRTH_COUNTRY,offender.NATIONALITY,
                        offender.CONTACT_1,offender.CONTACT_2,offender.REMARKS_IDENTIFICATION,offender.ADDRESS_TYPE,offender.SAME_AS_REGISTERED,
                        offender.BLOCK,offender.STREET,offender.FLOOR,offender.UNIT_NO,offender.BUILDING_NAME,offender.POSTAL_CODE,offender.REMARKS_ADDRESS
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${offender.ID} inserted successfully!`);
                        console.log("insertOffender result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertOffender ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertOffender ${this.tableName}:`, error);
        }
    };

    static async insertPassenger (db, offender) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                              ,
                        SUMMONS_ID                      ,
                        REGISTRATION_NO                 ,
                        OFFENDER_TYPE_ID                ,
                        TYPE_CODE                       ,
                        OPERATION_TYPE                  ,
                        NAME                            ,
                        INVOLVEMENT_ID                  ,
                        ID_TYPE                         ,
                        IDENTIFICATION_NO               ,
                        DATE_OF_BIRTH                   ,
                        GENDER_CODE                     ,
                        BIRTH_COUNTRY                   ,
                        NATIONALITY                     ,
                        CONTACT_1                       ,
                        CONTACT_2                       ,
                        REMARKS_IDENTIFICATION          ,
                        ADDRESS_TYPE                    ,
                        SAME_AS_REGISTERED              ,
                        BLOCK                           ,
                        STREET                          ,
                        FLOOR                           ,
                        UNIT_NO                         ,
                        BUILDING_NAME                   ,
                        POSTAL_CODE                     ,
                        REMARKS_ADDRESS                 
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        offender.ID,offender.SUMMONS_ID,offender.REGISTRATION_NO,offender.OFFENDER_TYPE_ID,offender.TYPE_CODE,offender.OPERATION_TYPE,
                        offender.NAME,offender.INVOLVEMENT_ID,offender.ID_TYPE,offender.IDENTIFICATION_NO,offender.DATE_OF_BIRTH,offender.GENDER_CODE,
                        offender.BIRTH_COUNTRY,offender.NATIONALITY,offender.CONTACT_1,offender.CONTACT_2,offender.REMARKS_IDENTIFICATION,
                        offender.ADDRESS_TYPE,offender.SAME_AS_REGISTERED,offender.BLOCK,offender.STREET,offender.FLOOR,offender.UNIT_NO,
                        offender.BUILDING_NAME,offender.POSTAL_CODE,offender.REMARKS_ADDRESS
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${offender.ID} inserted successfully!`);
                        console.log("insertOffender result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertOffender ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertOffender ${this.tableName}:`, error);
        }
    };

    static async insertPassengerNew (db, offender) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                              ,
                        SUMMONS_ID                      ,
                        REGISTRATION_NO                 ,
                        OFFENDER_TYPE_ID                ,
                        TYPE_CODE                       ,
                        OPERATION_TYPE                  ,
                        MAKE_CODE                       ,
                        CATEGORY_CODE                   ,
                        TRANSMISSION_TYPE               ,
                        ELIGIBLE_CLASS_3C               ,
                        COLOR                           ,
                        COLOR_CODE                      ,
                        WEIGHT                          ,
                        NAME                            ,
                        INVOLVEMENT_ID                  ,
                        ID_TYPE                         ,
                        IDENTIFICATION_NO               ,
                        DATE_OF_BIRTH                   ,
                        GENDER_CODE                     ,
                        BIRTH_COUNTRY                   ,
                        NATIONALITY                     ,
                        CONTACT_1                       ,
                        CONTACT_2                       ,
                        REMARKS_IDENTIFICATION          ,
                        ADDRESS_TYPE                    ,
                        SAME_AS_REGISTERED              ,
                        BLOCK                           ,
                        STREET                          ,
                        FLOOR                           ,
                        UNIT_NO                         ,
                        BUILDING_NAME                   ,
                        POSTAL_CODE                     ,
                        REMARKS_ADDRESS                 
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        offender.ID,offender.SUMMONS_ID,offender.REGISTRATION_NO,offender.OFFENDER_TYPE_ID,offender.TYPE_CODE,offender.OPERATION_TYPE,
                        offender.MAKE_CODE,offender.CATEGORY_CODE,offender.TRANSMISSION_TYPE,offender.ELIGIBLE_CLASS_3C,offender.COLOR,offender.COLOR_CODE,
                        offender.WEIGHT,offender.NAME,offender.INVOLVEMENT_ID,offender.ID_TYPE,offender.IDENTIFICATION_NO,offender.DATE_OF_BIRTH,
                        offender.GENDER_CODE,offender.BIRTH_COUNTRY,offender.NATIONALITY,offender.CONTACT_1,offender.CONTACT_2,offender.REMARKS_IDENTIFICATION,
                        offender.ADDRESS_TYPE,offender.SAME_AS_REGISTERED,offender.BLOCK,offender.STREET,offender.FLOOR,offender.UNIT_NO,
                        offender.BUILDING_NAME,offender.POSTAL_CODE,offender.REMARKS_ADDRESS
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${offender.ID} inserted successfully!`);
                        console.log("insertOffender result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertOffender ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertOffender ${this.tableName}:`, error);
        }
    };

    static async insertVehicle (db, offender) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                              ,
                        SUMMONS_ID                      ,
                        OFFENDER_TYPE_ID                ,
                        REGISTRATION_NO                 ,
                        INVOLVEMENT_ID                  ,
                        ID_TYPE                         ,
                        IDENTIFICATION_NO               ,
                        LOCAL_PLATE                     ,
                        SPECIAL_PLATE                   ,
                        TYPE_CODE                       ,
                        CATEGORY_CODE                   ,
                        TRANSMISSION_TYPE               ,
                        ELIGIBLE_CLASS_3C               ,
                        MAKE_CODE                       ,
                        COLOR                           ,
                        COLOR_CODE                      ,
                        WEIGHT                          ,
                        OPERATION_TYPE               
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        offender.ID,offender.SUMMONS_ID,offender.OFFENDER_TYPE_ID,offender.REGISTRATION_NO,
                        offender.INVOLVEMENT_ID,offender.ID_TYPE,offender.IDENTIFICATION_NO,offender.LOCAL_PLATE,
                        offender.SPECIAL_PLATE,offender.TYPE_CODE,offender.CATEGORY_CODE,offender.TRANSMISSION_TYPE,
                        offender.ELIGIBLE_CLASS_3C,offender.MAKE_CODE,offender.COLOR,offender.COLOR_CODE,offender.WEIGHT,
                        offender.OPERATION_TYPE
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${offender.ID} inserted successfully!`);
                        console.log("insertVehicle result: ", result);
                    },
                    (tx, error) => {
                        console.error(`Error insertVehicle ${this.tableName}:`, error);
                        throw false;
                    }
                );
            });
        } catch (error) {
            console.error(`Error insertVehicle ${this.tableName}:`, error);
        }
    };

    static async getOperationTypeBySummonsID(db, SUMMONS_ID, SPOTS_ID) {
        console.log("getOperationTypeBySummonsID >> ", SUMMONS_ID, SPOTS_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT OPERATION_TYPE FROM ${this.tableName} WHERE SUMMONS_ID = ?`,
                    [SUMMONS_ID],
                    (tx, results) => {
                        let { rows } = results;
                        console.log(" getOperationTypeBySummonsID rows.raw() >> ", rows.raw());
                        
                        const operationType = rows.raw().length > 0 ? rows.raw()[0].OPERATION_TYPE : null;
                        resolve(operationType);
                    },
                    (tx, error) => {
                        console.error("Error executing getOperationTypeBySummonsID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

}
