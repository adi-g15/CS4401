interface FileList {
    storedFiles: Array<{
        name: string,
        link: Promise<string>,
        meta: Promise<Object>
    }>,
    zipped?: {
        link: Promise<string>,
        meta: Promise<{
            size: number,
            timeCreated: string
        }>
    }
}

export function GetListService(storageRef: firebase.storage.Reference): Promise<FileList> {
    return new Promise((resolve, reject) => {
        try{
            storageRef.listAll().then(result => {
                console.debug("Received: ", result.items);
                const zippedFile = result.items.find(item => item.name.endsWith('zip'));

                return resolve({
                    storedFiles: result.items.filter(item => item.name.endsWith('.pdf')).map(item => {
                            return({
                                name: item.name,
                                link: item.getDownloadURL(),
                                meta: item.getMetadata()
                            });
                        }),
                    zipped: zippedFile ? ({
                        link: zippedFile.getDownloadURL(),
                        meta: zippedFile.getMetadata()
                    }) : null
                });
            });
        } catch {
            return reject();
        }
    })
  // future -> Use node fs module to get list
}
