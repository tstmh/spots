export default class PartiesInvolved {
    static tableName = "PARTIES_INVOLVED"; 

    constructor(ID, ACCIDENT_REPORT_ID, PERSON_TYPE_ID, REGISTRATION_NO, TYPE_CODE, LOCAL_PLATE, SPECIAL_PLATE,
        MAKE_CODE, MODEL, COLOR, COLOR_CODE, IN_FLAME, ALCOHOL_BREATH, BREATHALYZER_NO, BREATHALYZER_RESULT,
        NAME, ID_TYPE, IDENTIFICATION_NO, DATE_OF_BIRTH, GENDER_CODE, LICENSE_TYPE_CODE, LICENSE_EXPIRY_DATE,
        LICENSE_CLASS_CODE, BIRTH_COUNTRY, NATIONALITY, CONTACT_1, CONTACT_2, REMARKS_DEGREE_INJURY,
        REMARKS_IDENTIFICATION, ADDRESS_TYPE, SAME_AS_REGISTERED, BLOCK, STREET, FLOOR, UNIT_NO, BUILDING_NAME,
        POSTAL_CODE, REMARKS_ADDRESS, AMBULANCE_NO, AMBULANCE_AO_ID, AMBULANCE_ARRIVAL, AMBULANCE_DEPARTURE,
        HOSPITAL_ID, HOSPITAL_OTHER, INVOLVEMENT_ID, REMARKS_VEHICLE, VEHICLE_SEQUENCE, OTHER_LICENCE, CATEGORY_CODE) {
            this.ID=ID;
            this.ACCIDENT_REPORT_ID=ACCIDENT_REPORT_ID;
            this.PERSON_TYPE_ID=PERSON_TYPE_ID;
            this.REGISTRATION_NO=REGISTRATION_NO;
            this.TYPE_CODE=TYPE_CODE;
            this.LOCAL_PLATE=LOCAL_PLATE;
            this.SPECIAL_PLATE=SPECIAL_PLATE;
            this.MAKE_CODE=MAKE_CODE;
            this.MODEL=MODEL;
            this.COLOR=COLOR;
            this.COLOR_CODE=COLOR_CODE;
            this.IN_FLAME=IN_FLAME;
            this.ALCOHOL_BREATH=ALCOHOL_BREATH;
            this.BREATHALYZER_NO=BREATHALYZER_NO;
            this.BREATHALYZER_RESULT=BREATHALYZER_RESULT;
            this.NAME=NAME;
            this.ID_TYPE=ID_TYPE;
            this.IDENTIFICATION_NO=IDENTIFICATION_NO;
            this.DATE_OF_BIRTH=DATE_OF_BIRTH;
            this.GENDER_CODE=GENDER_CODE;
            this.LICENSE_TYPE_CODE=LICENSE_TYPE_CODE;
            this.LICENSE_EXPIRY_DATE=LICENSE_EXPIRY_DATE;
            this.LICENSE_CLASS_CODE=LICENSE_CLASS_CODE;
            this.BIRTH_COUNTRY=BIRTH_COUNTRY;
            this.NATIONALITY=NATIONALITY;
            this.CONTACT_1=CONTACT_1;
            this.CONTACT_2=CONTACT_2;
            this.REMARKS_DEGREE_INJURY=REMARKS_DEGREE_INJURY;
            this.REMARKS_IDENTIFICATION=REMARKS_IDENTIFICATION;
            this.ADDRESS_TYPE=ADDRESS_TYPE;
            this.SAME_AS_REGISTERED=SAME_AS_REGISTERED;
            this.BLOCK=BLOCK;
            this.STREET=STREET;
            this.FLOOR=FLOOR;
            this.UNIT_NO=UNIT_NO;
            this.BUILDING_NAME=BUILDING_NAME;
            this.POSTAL_CODE=POSTAL_CODE;
            this.REMARKS_ADDRESS=REMARKS_ADDRESS;
            this.AMBULANCE_NO=AMBULANCE_NO;
            this.AMBULANCE_AO_ID=AMBULANCE_AO_ID;
            this.AMBULANCE_ARRIVAL=AMBULANCE_ARRIVAL;
            this.AMBULANCE_DEPARTURE=AMBULANCE_DEPARTURE;
            this.HOSPITAL_ID=HOSPITAL_ID;
            this.HOSPITAL_OTHER=HOSPITAL_OTHER;
            this.INVOLVEMENT_ID=INVOLVEMENT_ID;
            this.REMARKS_VEHICLE=REMARKS_VEHICLE;
            this.VEHICLE_SEQUENCE=VEHICLE_SEQUENCE;
            this.OTHER_LICENCE=OTHER_LICENCE;
            this.CATEGORY_CODE=CATEGORY_CODE;
    }

    static async createTable(db) {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                        ID                     INTEGER NOT NULL UNIQUE,
                        ACCIDENT_REPORT_ID     TEXT    NOT NULL,
                        PERSON_TYPE_ID         INTEGER NOT NULL,
                        REGISTRATION_NO        TEXT,
                        TYPE_CODE              TEXT,
                        LOCAL_PLATE            INTEGER,
                        SPECIAL_PLATE          INTEGER,
                        MAKE_CODE              TEXT,
                        MODEL                  TEXT,
                        COLOR                  TEXT,
                        IN_FLAME               INTEGER,
                        ALCOHOL_BREATH         INTEGER,
                        BREATHALYZER_NO        TEXT,
                        BREATHALYZER_RESULT    INTEGER,
                        NAME                   TEXT,
                        ID_TYPE                INTEGER NOT NULL,
                        IDENTIFICATION_NO      TEXT,
                        DATE_OF_BIRTH          TEXT,
                        GENDER_CODE            INTEGER,
                        LICENSE_TYPE_CODE      INTEGER,
                        LICENSE_EXPIRY_DATE    TEXT,
                        LICENSE_CLASS_CODE     TEXT,
                        BIRTH_COUNTRY          TEXT,
                        NATIONALITY            TEXT,
                        CONTACT_1              TEXT,
                        CONTACT_2              TEXT,
                        REMARKS_DEGREE_INJURY  TEXT,
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
                        AMBULANCE_NO           TEXT,
                        AMBULANCE_AO_ID        TEXT,
                        AMBULANCE_ARRIVAL      TEXT,
                        AMBULANCE_DEPARTURE    TEXT,
                        HOSPITAL_ID            INTEGER,
                        HOSPITAL_OTHER         TEXT,
                        INVOLVEMENT_ID         INTEGER,
                        REMARKS_VEHICLE        TEXT,
                        VEHICLE_SEQUENCE       INTEGER,
                        OTHER_LICENCE          TEXT,
                        COLOR_CODE             TEXT,
                        CATEGORY_CODE          TEXT,
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

    static async insert(db, PartiesInvolved) {
        console.log("insertReplacePartiesInvolved ", PartiesInvolved);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID,
                        ACCIDENT_REPORT_ID,
                        PERSON_TYPE_ID,
                        REGISTRATION_NO,
                        TYPE_CODE,
                        LOCAL_PLATE,
                        SPECIAL_PLATE,
                        MAKE_CODE,
                        MODEL,
                        COLOR,
                        COLOR_CODE,
                        IN_FLAME,
                        ALCOHOL_BREATH,
                        BREATHALYZER_NO,
                        BREATHALYZER_RESULT,
                        NAME,
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
                        REMARKS_DEGREE_INJURY,
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
                        AMBULANCE_NO,
                        AMBULANCE_AO_ID,
                        AMBULANCE_ARRIVAL,
                        AMBULANCE_DEPARTURE,
                        HOSPITAL_ID,
                        HOSPITAL_OTHER,
                        INVOLVEMENT_ID,
                        REMARKS_VEHICLE,
                        VEHICLE_SEQUENCE,
                        OTHER_LICENCE,
                        CATEGORY_CODE          
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        PartiesInvolved.ID, PartiesInvolved.ACCIDENT_REPORT_ID, PartiesInvolved.PERSON_TYPE_ID, PartiesInvolved.REGISTRATION_NO, 
                        PartiesInvolved.TYPE_CODE, PartiesInvolved.LOCAL_PLATE, PartiesInvolved.SPECIAL_PLATE, PartiesInvolved.MAKE_CODE, 
                        PartiesInvolved.MODEL, PartiesInvolved.COLOR, PartiesInvolved.COLOR_CODE, PartiesInvolved.IN_FLAME, PartiesInvolved.ALCOHOL_BREATH, 
                        PartiesInvolved.BREATHALYZER_NO, PartiesInvolved.BREATHALYZER_RESULT, PartiesInvolved.NAME, PartiesInvolved.ID_TYPE, 
                        PartiesInvolved.IDENTIFICATION_NO, PartiesInvolved.DATE_OF_BIRTH, PartiesInvolved.GENDER_CODE, PartiesInvolved.LICENSE_TYPE_CODE, 
                        PartiesInvolved.LICENSE_EXPIRY_DATE, PartiesInvolved.LICENSE_CLASS_CODE, PartiesInvolved.BIRTH_COUNTRY, PartiesInvolved.NATIONALITY, 
                        PartiesInvolved.CONTACT_1, PartiesInvolved.CONTACT_2, PartiesInvolved.REMARKS_DEGREE_INJURY, PartiesInvolved.REMARKS_IDENTIFICATION, 
                        PartiesInvolved.ADDRESS_TYPE, PartiesInvolved.SAME_AS_REGISTERED, PartiesInvolved.BLOCK, PartiesInvolved.STREET, PartiesInvolved.FLOOR, 
                        PartiesInvolved.UNIT_NO, PartiesInvolved.BUILDING_NAME, PartiesInvolved.POSTAL_CODE, PartiesInvolved.REMARKS_ADDRESS, PartiesInvolved.AMBULANCE_NO, 
                        PartiesInvolved.AMBULANCE_AO_ID, PartiesInvolved.AMBULANCE_ARRIVAL, PartiesInvolved.AMBULANCE_DEPARTURE, PartiesInvolved.HOSPITAL_ID, 
                        PartiesInvolved.HOSPITAL_OTHER, PartiesInvolved.INVOLVEMENT_ID, PartiesInvolved.REMARKS_VEHICLE, PartiesInvolved.VEHICLE_SEQUENCE, 
                        PartiesInvolved.OTHER_LICENCE, PartiesInvolved.CATEGORY_CODE
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${PartiesInvolved.ID} inserted successfully!`);
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

    static async deletePartiesInvolved(db, id) {
        console.log(`deletePartiesInvolved >> id: ${id}`);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${this.tableName} WHERE ID = ?`,
                    [id],
                    (tx, results) => {
                        resolve(true);
                    },
                    (tx, error) => {
                        console.error("Error executing deletePartiesInvolved SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getAll(db) {
        console.log("getAllPartiesInvolved");
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
                                row.ID, row.ACCIDENT_REPORT_ID, row.PERSON_TYPE_ID, row.REGISTRATION_NO, row.TYPE_CODE, row.LOCAL_PLATE, row.SPECIAL_PLATE,
                                row.MAKE_CODE, row.MODEL, row.COLOR, row.COLOR_CODE, row.IN_FLAME, row.ALCOHOL_BREATH, row.BREATHALYZER_NO, row.BREATHALYZER_RESULT,
                                row.NAME, row.ID_TYPE, row.IDENTIFICATION_NO, row.DATE_OF_BIRTH, row.GENDER_CODE, row.LICENSE_TYPE_CODE, row.LICENSE_EXPIRY_DATE,
                                row.LICENSE_CLASS_CODE, row.BIRTH_COUNTRY, row.NATIONALITY, row.CONTACT_1, row.CONTACT_2, row.REMARKS_DEGREE_INJURY,
                                row.REMARKS_IDENTIFICATION, row.ADDRESS_TYPE, row.SAME_AS_REGISTERED, row.BLOCK, row.STREET, row.FLOOR, row.UNIT_NO, row.BUILDING_NAME,
                                row.POSTAL_CODE, row.REMARKS_ADDRESS, row.AMBULANCE_NO, row.AMBULANCE_AO_ID, row.AMBULANCE_ARRIVAL, row.AMBULANCE_DEPARTURE,
                                row.HOSPITAL_ID, row.HOSPITAL_OTHER, row.INVOLVEMENT_ID, row.REMARKS_VEHICLE, row.VEHICLE_SEQUENCE, row.OTHER_LICENCE, row.CATEGORY_CODE));
                        });

                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getAllPartiesInvolved SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getPartiesInvolvedByAccIDPerson(db, ACCIDENT_REPORT_ID, PERSON_TYPE_ID) {
        console.log("getPartiesInvolvedByAccIDPerson >> ACCIDENT_REPORT_ID: " + ACCIDENT_REPORT_ID + ", PERSON_TYPE_ID: " + PERSON_TYPE_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ACCIDENT_REPORT_ID = ? and PERSON_TYPE_ID = ?`,
                    [ACCIDENT_REPORT_ID, PERSON_TYPE_ID],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new PartiesInvolved(
                                row.ID, row.ACCIDENT_REPORT_ID, row.PERSON_TYPE_ID, row.REGISTRATION_NO, row.TYPE_CODE, row.LOCAL_PLATE, row.SPECIAL_PLATE,
                                row.MAKE_CODE, row.MODEL, row.COLOR, row.COLOR_CODE, row.IN_FLAME, row.ALCOHOL_BREATH, row.BREATHALYZER_NO, row.BREATHALYZER_RESULT,
                                row.NAME, row.ID_TYPE, row.IDENTIFICATION_NO, row.DATE_OF_BIRTH, row.GENDER_CODE, row.LICENSE_TYPE_CODE, row.LICENSE_EXPIRY_DATE,
                                row.LICENSE_CLASS_CODE, row.BIRTH_COUNTRY, row.NATIONALITY, row.CONTACT_1, row.CONTACT_2, row.REMARKS_DEGREE_INJURY,
                                row.REMARKS_IDENTIFICATION, row.ADDRESS_TYPE, row.SAME_AS_REGISTERED, row.BLOCK, row.STREET, row.FLOOR, row.UNIT_NO, row.BUILDING_NAME,
                                row.POSTAL_CODE, row.REMARKS_ADDRESS, row.AMBULANCE_NO, row.AMBULANCE_AO_ID, row.AMBULANCE_ARRIVAL, row.AMBULANCE_DEPARTURE,
                                row.HOSPITAL_ID, row.HOSPITAL_OTHER, row.INVOLVEMENT_ID, row.REMARKS_VEHICLE, row.VEHICLE_SEQUENCE, row.OTHER_LICENCE, row.CATEGORY_CODE));
                        });
                        console.log(`getPartiesInvolvedByAccIDPerson ${ACCIDENT_REPORT_ID} ${PERSON_TYPE_ID}: list >> ` , list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getPartiesInvolvedByAccIDPerson SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async getPartiesInvolvedByAccidentID(db, ACCIDENT_REPORT_ID) {
        console.log("getPartiesInvolvedByAccidentID >> ACCIDENT_REPORT_ID: " + ACCIDENT_REPORT_ID);
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${this.tableName} WHERE ACCIDENT_REPORT_ID = ?`,
                    [ACCIDENT_REPORT_ID],
                    (tx, results) => {
                        let { rows } = results;
                        let list = [];
                        rows.raw().forEach(row => {
                            list.push(new PartiesInvolved(
                                row.ID, row.ACCIDENT_REPORT_ID, row.PERSON_TYPE_ID, row.REGISTRATION_NO, row.TYPE_CODE, row.LOCAL_PLATE, row.SPECIAL_PLATE,
                                row.MAKE_CODE, row.MODEL, row.COLOR, row.COLOR_CODE, row.IN_FLAME, row.ALCOHOL_BREATH, row.BREATHALYZER_NO, row.BREATHALYZER_RESULT,
                                row.NAME, row.ID_TYPE, row.IDENTIFICATION_NO, row.DATE_OF_BIRTH, row.GENDER_CODE, row.LICENSE_TYPE_CODE, row.LICENSE_EXPIRY_DATE,
                                row.LICENSE_CLASS_CODE, row.BIRTH_COUNTRY, row.NATIONALITY, row.CONTACT_1, row.CONTACT_2, row.REMARKS_DEGREE_INJURY,
                                row.REMARKS_IDENTIFICATION, row.ADDRESS_TYPE, row.SAME_AS_REGISTERED, row.BLOCK, row.STREET, row.FLOOR, row.UNIT_NO, row.BUILDING_NAME,
                                row.POSTAL_CODE, row.REMARKS_ADDRESS, row.AMBULANCE_NO, row.AMBULANCE_AO_ID, row.AMBULANCE_ARRIVAL, row.AMBULANCE_DEPARTURE,
                                row.HOSPITAL_ID, row.HOSPITAL_OTHER, row.INVOLVEMENT_ID, row.REMARKS_VEHICLE, row.VEHICLE_SEQUENCE, row.OTHER_LICENCE, row.CATEGORY_CODE));
                        });
                        console.log(`getPartiesInvolvedByAccidentID ${ACCIDENT_REPORT_ID}: list >> ` , list);
                        resolve(list);
                    },
                    (tx, error) => {
                        console.error("Error executing getPartiesInvolvedByAccidentID SQL query:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    static async insertPedestrian(db, pedestrian) {
        console.log("insertPedestrian ", pedestrian);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                     ,
                        ACCIDENT_REPORT_ID     ,
                        PERSON_TYPE_ID         ,
                        NAME                   ,
                        ID_TYPE                ,
                        IDENTIFICATION_NO      ,
                        DATE_OF_BIRTH          ,
                        GENDER_CODE            ,
                        CONTACT_1              ,
                        CONTACT_2              ,
                        REMARKS_DEGREE_INJURY  ,
                        REMARKS_IDENTIFICATION ,
                        ADDRESS_TYPE           ,
                        SAME_AS_REGISTERED     ,
                        BLOCK                  ,
                        STREET                 ,
                        FLOOR                  ,
                        UNIT_NO                ,
                        BUILDING_NAME          ,
                        POSTAL_CODE            ,
                        REMARKS_ADDRESS        ,
                        AMBULANCE_NO           ,
                        AMBULANCE_AO_ID        ,
                        AMBULANCE_ARRIVAL      ,
                        AMBULANCE_DEPARTURE    ,
                        HOSPITAL_ID            ,
                        HOSPITAL_OTHER         
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        pedestrian.ID, pedestrian.ACCIDENT_REPORT_ID, pedestrian.PERSON_TYPE_ID, pedestrian.NAME, pedestrian.ID_TYPE, pedestrian.IDENTIFICATION_NO, 
                        pedestrian.DATE_OF_BIRTH, pedestrian.GENDER_CODE, pedestrian.CONTACT_1, pedestrian.CONTACT_2, pedestrian.REMARKS_DEGREE_INJURY,
                        pedestrian.REMARKS_IDENTIFICATION, pedestrian.ADDRESS_TYPE, pedestrian.SAME_AS_REGISTERED, pedestrian.BLOCK, pedestrian.STREET, pedestrian.FLOOR, pedestrian.UNIT_NO, pedestrian.BUILDING_NAME,
                        pedestrian.POSTAL_CODE, pedestrian.REMARKS_ADDRESS, pedestrian.AMBULANCE_NO, pedestrian.AMBULANCE_AO_ID, pedestrian.AMBULANCE_ARRIVAL, pedestrian.AMBULANCE_DEPARTURE,
                        pedestrian.HOSPITAL_ID, pedestrian.HOSPITAL_OTHER
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${pedestrian.ID} inserted successfully!`);
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

    static async insertWitness(db, witness) {
        console.log("insertWitness ", witness);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                     ,
                        ACCIDENT_REPORT_ID     ,
                        PERSON_TYPE_ID         ,
                        NAME                   ,
                        ID_TYPE                ,
                        IDENTIFICATION_NO      ,
                        DATE_OF_BIRTH          ,
                        GENDER_CODE            ,
                        CONTACT_1              ,
                        CONTACT_2              ,
                        ADDRESS_TYPE           ,
                        SAME_AS_REGISTERED     ,
                        BLOCK                  ,
                        STREET                 ,
                        FLOOR                  ,
                        UNIT_NO                ,
                        BUILDING_NAME          ,
                        POSTAL_CODE            ,
                        REMARKS_ADDRESS        
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        witness.ID, witness.ACCIDENT_REPORT_ID, witness.PERSON_TYPE_ID, witness.NAME, witness.ID_TYPE, witness.IDENTIFICATION_NO, 
                        witness.DATE_OF_BIRTH, witness.GENDER_CODE, witness.CONTACT_1, witness.CONTACT_2, witness.ADDRESS_TYPE, witness.SAME_AS_REGISTERED, 
                        witness.BLOCK, witness.STREET, witness.FLOOR, witness.UNIT_NO, witness.BUILDING_NAME, witness.POSTAL_CODE, witness.REMARKS_ADDRESS
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${witness.ID} inserted successfully!`);
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

    static async insertVehicle(db, vehicle) {
        console.log("insertVehicle ", vehicle);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID,
                        ACCIDENT_REPORT_ID,
                        PERSON_TYPE_ID,
                        REGISTRATION_NO,
                        TYPE_CODE,
                        LOCAL_PLATE,
                        SPECIAL_PLATE,
                        MAKE_CODE,
                        MODEL,
                        COLOR,
                        IN_FLAME,
                        ALCOHOL_BREATH,
                        BREATHALYZER_NO,
                        BREATHALYZER_RESULT,
                        NAME,
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
                        REMARKS_DEGREE_INJURY,
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
                        AMBULANCE_NO,
                        AMBULANCE_AO_ID,
                        AMBULANCE_ARRIVAL,
                        AMBULANCE_DEPARTURE,
                        HOSPITAL_ID,
                        HOSPITAL_OTHER,
                        INVOLVEMENT_ID,
                        REMARKS_VEHICLE,
                        VEHICLE_SEQUENCE,
                        OTHER_LICENCE,
                        COLOR_CODE,
                        CATEGORY_CODE        
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        witness.ID, witness.ACCIDENT_REPORT_ID, witness.PERSON_TYPE_ID, witness.NAME, witness.ID_TYPE, witness.IDENTIFICATION_NO, 
                        witness.DATE_OF_BIRTH, witness.GENDER_CODE, witness.CONTACT_1, witness.CONTACT_2, witness.ADDRESS_TYPE, witness.SAME_AS_REGISTERED, 
                        witness.BLOCK, witness.STREET, witness.FLOOR, witness.UNIT_NO, witness.BUILDING_NAME, witness.POSTAL_CODE
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${witness.ID} inserted successfully!`);
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

    static async insertPassenger(db, passenger) {
        console.log("insertPassenger ", passenger);
        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    `INSERT OR REPLACE INTO ${this.tableName} (
                        ID                     ,
                        ACCIDENT_REPORT_ID     ,
                        PERSON_TYPE_ID         ,
                        REGISTRATION_NO        ,
                        VEHICLE_SEQUENCE       ,
                        NAME                   ,
                        ID_TYPE                ,
                        INVOLVEMENT_ID         ,
                        IDENTIFICATION_NO      ,
                        DATE_OF_BIRTH          ,
                        GENDER_CODE            ,
                        BIRTH_COUNTRY          ,
                        NATIONALITY            ,
                        CONTACT_1              ,
                        CONTACT_2              ,
                        REMARKS_DEGREE_INJURY  ,
                        REMARKS_IDENTIFICATION ,
                        ADDRESS_TYPE           ,
                        SAME_AS_REGISTERED     ,
                        BLOCK                  ,
                        STREET                 ,
                        FLOOR                  ,
                        UNIT_NO                ,
                        BUILDING_NAME          ,
                        POSTAL_CODE            ,
                        REMARKS_ADDRESS        ,
                        AMBULANCE_NO           ,
                        AMBULANCE_AO_ID        ,
                        AMBULANCE_ARRIVAL      ,
                        AMBULANCE_DEPARTURE    ,
                        HOSPITAL_ID            ,
                        HOSPITAL_OTHER         
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        passenger.ID, passenger.ACCIDENT_REPORT_ID, passenger.PERSON_TYPE_ID, passenger.REGISTRATION_NO, passenger.VEHICLE_SEQUENCE, passenger.NAME, 
                        passenger.ID_TYPE, passenger.INVOLVEMENT_ID, passenger.IDENTIFICATION_NO, passenger.DATE_OF_BIRTH, passenger.GENDER_CODE, passenger.BIRTH_COUNTRY,
                        passenger.NATIONALITY, passenger.CONTACT_1, passenger.CONTACT_2, passenger.REMARKS_DEGREE_INJURY, passenger.REMARKS_IDENTIFICATION, 
                        passenger.ADDRESS_TYPE, passenger.SAME_AS_REGISTERED, passenger.BLOCK, passenger.STREET, passenger.FLOOR, passenger.UNIT_NO, passenger.BUILDING_NAME, 
                        passenger.POSTAL_CODE, passenger.REMARKS_ADDRESS, passenger.AMBULANCE_NO, passenger.AMBULANCE_AO_ID, passenger.AMBULANCE_ARRIVAL, 
                        passenger.AMBULANCE_DEPARTURE, passenger.HOSPITAL_ID, passenger.HOSPITAL_OTHER
                    ],
                    (tx, result) => {
                        console.log(`${this.tableName} entry with ID: ${passenger.ID} inserted successfully!`);
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

}