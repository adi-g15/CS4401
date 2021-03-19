interface FileList {
    storedFiles: Array<{
        name: string,
        link: Promise<string>,
        meta: Promise<Object>
    }>,
    zipped: Array<{
        name: string,
        link: Promise<string>,
        meta: Promise<{
            size: number,
            timeCreated: string,
            updated: string
        }>
    }>
}

export function GetListService(storageRef: firebase.storage.Reference): Promise<FileList> {
    return new Promise((resolve, reject) => {
        try{
            storageRef.listAll().then(result => {
                console.debug("Received: ", result.items);
                const today = new Date();
                const date = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear() % 100}`;
                const zippedFiles = result.items.filter(item => item.name.endsWith('zip')).map(zip_file => {
                    return ({
                        name: zip_file.name.startsWith('CS4401_COA_Unit_') ? zip_file.name.slice('CS4401_COA_'.length): 'Download All as zip',
                        link: zip_file.getDownloadURL(),
                        meta: zip_file.getMetadata()
                    })
                });

                return resolve({
                    storedFiles: result.items.filter(item => item.name.endsWith('.pdf')).map(item => {
                            return({
                                name: item.name,
                                link: item.getDownloadURL(),
                                meta: item.getMetadata()
                            });
                        }),
                    zipped: zippedFiles
                });
            });
        } catch {
            return reject();
        }
    })
  // future -> Use node fs module to get list
}
