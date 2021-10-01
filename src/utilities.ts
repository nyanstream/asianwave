export const storageChangesChecker = (changes: { [key: string]: chrome.storage.StorageChange }, item: string) => {
    return item in changes && 'newValue' in changes[item];
};
