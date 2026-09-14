export function insertDataToIndexDB(db: IDBDatabase, data: any, storeName: string) {
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  let query = store.put(data);
  query.onerror = function (event) {
    insertDataToIndexDB(db, data, storeName);
  }
  transaction.oncomplete = function () {
    db.close();
  };
}

export function clearStoreIndexDB(db: IDBDatabase, storeName: string) {
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  let query = store.clear();
  query.onerror = function (event) {
    clearStoreIndexDB(db, storeName);
  }
  transaction.oncomplete = function () {
    db.close();
  };
}

export function connectIndexDB(storeName: string, index: string, unique: boolean, resultConnect: { db: IDBDatabase, data: any[] }) {
  const requestIndexDb = window.indexedDB.open(storeName);
  requestIndexDb.onerror = (event) => {
    console.log("IndexDB error");
  }
  requestIndexDb.onupgradeneeded = (event) => {
    //@ts-ignore
    let db = event.target.result;
    let store = db.createObjectStore(storeName, {
      autoIncrement: true
    });
    let indexStore = store.createIndex(index, index, {
      unique
    });
  }

  requestIndexDb.onsuccess = (eventSuccess) => {
    //@ts-ignore
    resultConnect.db = eventSuccess.target.result;
    const transaction = resultConnect.db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    objectStore.openCursor().onsuccess = (event) => {
      //@ts-ignore
      let cursor = event.target.result;
      if (cursor) {
        let item = cursor.value;
        resultConnect.data.push(item);
        cursor.continue();
      }
    };
  }
}