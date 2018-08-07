import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
 
 
/**
 * Client side data storage manager that offers many conveniences to client-side data storage and manipulation
 */ 
@Injectable()
export class LocalStoreManager {
 
    private static syncListenerInitialised = false;
    private syncKeys: string[] = [];
    private dbEvent = new Subject<string>();
 
    private reservedKeys: string[] = ['sync_keys', 'addToSyncKeys', 'removeFromSyncKeys',
        'getSessionStorage', 'setSessionStorage', 'addToSessionStorage', 'removeFromSessionStorage', 'clearAllSessionsStorage', 'raiseDBEvent'];
 
    public static readonly DBKEY_USER_DATA = "user_data";
    private static readonly DBKEY_SYNC_KEYS = "sync_keys";
 
    /**
     * This is the first thing you have to call before you use any functionality in this library. 
     * You can call this on Page Load. This hooks tab synchronization up
     */
     //Todo: Implement EventListeners for the various event operations and a SessionStorageEvent for specific data keys
    public initialiseStorageSyncListener() {
        if (LocalStoreManager.syncListenerInitialised == true) {
            return;
        }
 
        LocalStoreManager.syncListenerInitialised = true;
        window.addEventListener("storage", this.sessionStorageTransferHandler, false);
        this.syncSessionStorage();
    }
 
    public deinitialiseStorageSyncListener() {
         window.removeEventListener("storage", this.sessionStorageTransferHandler, false);
 
        LocalStoreManager.syncListenerInitialised = false;
    }
  
    private sessionStorageTransferHandler = (event: StorageEvent) => {
         if (!event.newValue)
            return;
 
        if (event.key == 'getSessionStorage') {
 
            if (sessionStorage.length) {
                localStorage.setItem('setSessionStorage', JSON.stringify(sessionStorage));
                localStorage.removeItem('setSessionStorage');
            }
        }
        else if (event.key == 'setSessionStorage') {
 
            if (!this.syncKeys.length)
                this.loadSyncKeys();
 
            let data = JSON.parse(event.newValue);
 
            for (let key in data) {
 
                if (this.syncKeysContains(key))
                    sessionStorage.setItem(key, data[key]);
            }
 
        }
        else if (event.key == 'addToSessionStorage') {
 
            let data = JSON.parse(event.newValue);
            this.addToSessionStorageHelper(data["data"], data["key"]);
        }
        else if (event.key == 'removeFromSessionStorage') {
 
            this.removeFromSessionStorageHelper(event.newValue);
        }
        else if (event.key == 'clearAllSessionsStorage' && sessionStorage.length) {
 
            this.clearInstanceSessionStorage();
        }
        else if (event.key == 'addToSyncKeys') {
 
            this.addToSyncKeysHelper(event.newValue);
        }
        else if (event.key == 'removeFromSyncKeys') {
 
            this.removeFromSyncKeysHelper(event.newValue);
        }
        else if (event.key == 'raiseDBEvent') {
 
            this.raiseDBEventHelper(event.newValue);
        }
    }
  
    private syncSessionStorage() {
        localStorage.setItem('getSessionStorage', '_dummy');
        localStorage.removeItem('getSessionStorage');
    }
 
    /**
     * Clears everything in all data stores
     */
    public clearAllStorage() {
        this.clearAllSessionsStorage();
        this.clearLocalStorage();
    }
  
    /**
     * Clears all session storage in all opened browser tabs. Permanent storage is not affected
     */
    public clearAllSessionsStorage() {
         this.clearInstanceSessionStorage();
        localStorage.removeItem(LocalStoreManager.DBKEY_SYNC_KEYS);
 
        localStorage.setItem('clearAllSessionsStorage', '_dummy');
        localStorage.removeItem('clearAllSessionsStorage');
    }
  
    /**
     * Clears all storage in the current browser tab only
     */
    public clearInstanceSessionStorage() {
        sessionStorage.clear();
        this.syncKeys = [];
    }
  
    /**
     * Clear permanent storage only. Session storage are not affected
     */
    public clearLocalStorage() {
        localStorage.clear();
    }
 
    private addToSessionStorage(data: string, key: string) {
         this.addToSessionStorageHelper(data, key);
        this.addToSyncKeysBackup(key);
 
        localStorage.setItem('addToSessionStorage', JSON.stringify({ key: key, data: data }));
        localStorage.removeItem('addToSessionStorage');
    }
 
    private addToSessionStorageHelper(data: string, key: string) {
         this.addToSyncKeysHelper(key);
        sessionStorage.setItem(key, data);
    }
 
    private removeFromSessionStorage(keyToRemove: string) {
        this.removeFromSessionStorageHelper(keyToRemove);
        this.removeFromSyncKeysBackup(keyToRemove);
 
        localStorage.setItem('removeFromSessionStorage', keyToRemove);
        localStorage.removeItem('removeFromSessionStorage');
    }
 
    private removeFromSessionStorageHelper(keyToRemove: string) {
        sessionStorage.removeItem(keyToRemove);
        this.removeFromSyncKeysHelper(keyToRemove);
    }
 
    private testForInvalidKeys(key: string) {
        if (!key)
            throw new Error("key cannot be empty")
 
        if (this.reservedKeys.some(x => x == key))
            throw new Error(`The storage key "${key}" is reserved and cannot be used. Please use a different key`);
    }
  
    private syncKeysContains(key: string) {
        return this.syncKeys.some(x => x == key);
    }
 
    private loadSyncKeys() {
        if (this.syncKeys.length)
            return;
 
        this.syncKeys = this.getSyncKeysFromStorage();
    }
 
    private getSyncKeysFromStorage(defaultValue: string[] = []): string[] {
        let data = localStorage.getItem(LocalStoreManager.DBKEY_SYNC_KEYS);
 
        if (data == null)
            return defaultValue;
        else
            return <string[]>JSON.parse(data);
    }
 
    private addToSyncKeys(key: string) {
        this.addToSyncKeysHelper(key);
        this.addToSyncKeysBackup(key);
 
        localStorage.setItem('addToSyncKeys', key);
        localStorage.removeItem('addToSyncKeys');
    }
  
    private addToSyncKeysBackup(key: string) {
         let storedSyncKeys = this.getSyncKeysFromStorage();
 
        if (!storedSyncKeys.some(x => x == key)) {
 
            storedSyncKeys.push(key);
            localStorage.setItem(LocalStoreManager.DBKEY_SYNC_KEYS, JSON.stringify(storedSyncKeys));
        }
    }
 
    private removeFromSyncKeysBackup(key: string) {
         let storedSyncKeys = this.getSyncKeysFromStorage();
 
        let index = storedSyncKeys.indexOf(key);
 
        if (index > -1) {
            storedSyncKeys.splice(index, 1);
            localStorage.setItem(LocalStoreManager.DBKEY_SYNC_KEYS, JSON.stringify(storedSyncKeys));
        }
    }
  
    private addToSyncKeysHelper(key: string) {
        if (!this.syncKeysContains(key))
            this.syncKeys.push(key);
    }
  
    private removeFromSyncKeys(key: string) {
        this.removeFromSyncKeysHelper(key);
        this.removeFromSyncKeysBackup(key);
 
        localStorage.setItem('removeFromSyncKeys', key);
        localStorage.removeItem('removeFromSyncKeys');
    }
 
    private removeFromSyncKeysHelper(key: string) {
         let index = this.syncKeys.indexOf(key);
 
        if (index > -1) {
            this.syncKeys.splice(index, 1);
        }
    }
  
    /**
     * Save data into a single tab. Stuff you save with this is not available in other tabs
     * @param data 
     * @param key 
     */
    public saveSessionData(data: string, key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        this.removeFromSyncKeys(key);
        //localStorage.removeItem(key);
        sessionStorage.setItem(key, data);
    }
  
    /**
     * Whatever you save with this function is available in all opened tabs. 
     * This is what you’ll use to save a user's Authentication Token when the user chooses not to "Remember Me"
     * @param data 
     * @param key 
     */
    public saveSyncedSessionData(data: string, key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        //localStorage.removeItem(key);
        this.addToSessionStorage(data, key);
    }
  
    /**
     * Whatever you save with this is permanently saved on disk and is available in all opened tabs. 
     * This is what you’ll use to save the Authentication token of a user who chooses to "Remember Me"
     * @param data 
     * @param key 
     */
    public savePermanentData(data: string, key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        //this.removeFromSessionStorage(key);
        localStorage.setItem(key, data);
    }
  
    /**
     * Moves data that is in other storage locations (i.e. permanent storage, synced session storage) to session storage. 
     * In session storage each tab has its data independent of other tabs
     */
    public moveDataToSessionStorage(key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        let data = this.getData(key);
 
        if (data == null)
            return;
 
        this.saveSessionData(data, key);
    }
  
    /**
     * Moves data in other storage locations (i.e. permanent storage, session storage) to SyncedSessionStorage. 
     * Whatever is saved here is available in all opened tabs
     * @param key 
     */
    public moveDataToSyncedSessionStorage(key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        let data = this.getData(key);
 
        if (data == null)
            return;
 
        this.saveSyncedSessionData(data, key);
    }
  
    /**
     * Moves data in other storage locations (i.e. session storage, synced session storage) to permanent storage
     * @param key 
     */
    public moveDataToPermanentStorage(key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        let data = this.getData(key);
 
        if (data == null)
            return;
 
        this.savePermanentData(data, key);
    }
 
    /**
     * Used to retrieve data from the data store
     * @param key 
     */
    public getData(key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        let data = sessionStorage.getItem(key);
 
        if (data == null)
            data = localStorage.getItem(key);
 
        return data;
    }
 
    /**
     * Used to retrieve data from the data store. This method returns an object of type T. 
     * Use this when you saved an object to the data store, to have it return the object back to you
     * @param key 
     */
    public getDataObject<T>(key = LocalStoreManager.DBKEY_USER_DATA): T {
        let data = this.getData(key);
 
        if (data != null)
            return <T>JSON.parse(data);
        else
            return null;
    }
 
    public getLocalDataObject<T>(key = LocalStoreManager.DBKEY_USER_DATA): T {
        let data = localStorage.getItem(key);

        if (data != null) {
            return <T>JSON.parse(data);
        }
        else {
            return null;
        }
    }

    public getSessionDataObject<T>(key = LocalStoreManager.DBKEY_USER_DATA): T {
        let data = sessionStorage.getItem(key);

        if (data != null) {
            return <T>JSON.parse(data);
        }
        else {
            return null;
        }
    }

    /**
     * Deletes data from the data store
     * @param key 
     */
    public deleteData(key = LocalStoreManager.DBKEY_USER_DATA) {
        this.testForInvalidKeys(key);
 
        this.removeFromSessionStorage(key);
        localStorage.removeItem(key);
    }
  
    raiseDBEvent(event: string) {
        this.raiseDBEventHelper(event);
 
        localStorage.setItem('raiseDBEvent', event);
        localStorage.removeItem('raiseDBEvent');
    }
 
    private raiseDBEventHelper(event: string) {
        this.dbEvent.next(event);
    }
  
    getDBEventListener(): Observable<string> {
        return this.dbEvent.asObservable();
    }
}