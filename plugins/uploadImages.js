import Vue from 'vue'
import uniqid from 'uniqid'

Vue.prototype.$uploadFiles = async (storage, files, path) => {
    const dirRef = await storage.ref()
    const urls = []
    for (const file of files) {
        const ref = dirRef.child(uniqid() + path)
        await ref.put(file)
        const url = await ref.getDownloadURL()
        urls.push(url)
    }
    return urls
}
