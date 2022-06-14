import {getStorage, ref, uploadBytes} from 'firebase/storage'
export default async function uploadFile(imageFile , imageId) {
    const storage  = getStorage(); 
    const licenseRef  = ref(storage , "License/"+ imageId);
    await uploadBytes(licenseRef, imageFile).then((snapshot)=>{
        console.log("License Uploaded");
    });
}