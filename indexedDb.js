class HospitalDatabase {
  constructor(dbName, version, objectStores) {
    this.dbName = dbName;
    this.version = version;
    this.objectStores = objectStores;
    this.db = null;
    this.indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    this.IDBTransaction =
      window.IDBTransaction ||
      window.webkitIDBTransaction ||
      window.msIDBTransaction;
    this.IDBKeyRange =
      window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!this.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
    }
  }

  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open(this.dbName, this.version);

      request.onerror = function (event) {
        reject("Database error: " + event.target.errorCode);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        this.objectStores.forEach((storeConfig) => {
          if (!this.db.objectStoreNames.contains(storeConfig.name)) {
            const objectStore = this.db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath,
            });
            if (storeConfig.indexes) {
              storeConfig.indexes.forEach((indexConfig) => {
                objectStore.createIndex(indexConfig.name, indexConfig.keyPath, {
                  unique: indexConfig.unique,
                });
              });
            }
          }
        });
      };
    });
  }

  searchPatients(query) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["patients"], "readonly");
      const objectStore = transaction.objectStore("patients");
      const request = objectStore.openCursor();

      const patients = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const patient = cursor.value;
          // Check if any field matches the query
          if (
            Object.values(patient).some((value) =>
              value.toString().toLowerCase().includes(query.toLowerCase())
            )
          ) {
            patients.push(patient);
          }
          cursor.continue();
        } else {
          resolve(patients);
        }
      };

      request.onerror = (event) => {
        reject("Error fetching patients: " + event.target.errorCode);
      };
    });
  }

  addPatient(patientData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["patients"], "readwrite");
      const objectStore = transaction.objectStore("patients");
      const request = objectStore.add(patientData);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject("Error adding patient: " + event.target.errorCode);
      };
    });
  }
  addMedicalData(medicalData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["medical"], "readwrite");
      const objectStore = transaction.objectStore("medical");
      const request = objectStore.add(medicalData);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject("Error adding medical data: " + event.target.errorCode);
      };
    });
  }
  updatePatient(serialNo, updatedData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["patients"], "readwrite");
      const objectStore = transaction.objectStore("patients");
      const request = objectStore.get(serialNo);

      request.onsuccess = (event) => {
        const patient = event.target.result;
        if (patient) {
          // Update patient data with the provided updatedData
          Object.assign(patient, updatedData);
          const updateRequest = objectStore.put(patient);
          updateRequest.onsuccess = (event) => {
            resolve(event.target.result);
          };
          updateRequest.onerror = (event) => {
            reject("Error updating patient: " + event.target.errorCode);
          };
        } else {
          reject("Patient not found with serial number: " + serialNo);
        }
      };

      request.onerror = (event) => {
        reject("Error fetching patient: " + event.target.errorCode);
      };
    });
  }

  searchMedicalData(query) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["medical"], "readonly");
      const objectStore = transaction.objectStore("medical");
      const request = objectStore.openCursor();

      const medicalData = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const medicalRecord = cursor.value;
          // Check if any field matches the query
          if (
            Object.values(medicalRecord).some((value) =>
              value.toString().toLowerCase().includes(query.toLowerCase())
            )
          ) {
            medicalData.push(medicalRecord);
          }
          cursor.continue();
        } else {
          resolve(medicalData);
        }
      };

      request.onerror = (event) => {
        reject("Error fetching medical data: " + event.target.errorCode);
      };
    });
  }
  // Add more methods for other operations as needed
}

// Example usage:
const dbName = "HospitalDB";
const version = 1;
const objectStores = [
  {
    name: "patients",
    keyPath: "serialNo",
    indexes: [{ name: "name", keyPath: "name", unique: false }],
  },
  {
    name: "medical",
    keyPath: "patientName",
    indexes: [{ name: "patientName", keyPath: "patientName", unique: false }],
  },
];

const hospitalDB = new HospitalDatabase(dbName, version, objectStores);

// Open the database when the application starts
hospitalDB
  .openDatabase()
  .then(() => {
    console.log("Database opened successfully");
  })
  .catch((error) => {
    console.error("Error opening database:", error);
  });
