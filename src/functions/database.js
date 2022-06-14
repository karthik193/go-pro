import { collection,getDocs, getFirestore, query, where } from "firebase/firestore";


const getNewProvider = async ()=>{


    var freeProviders = []; 
    //get all free providers 
    const firestore  = getFirestore();
    const providersCollection = collection(firestore , "provider") ;
    const q  = query(
        providersCollection , 
        where("free" , "==" , true), 
        where("email" , "!=" , localStorage.getItem("email")) )
    const querySnapshot  = await getDocs(q);

    // add to free Providers

    querySnapshot.forEach(doc =>{
        freeProviders.push(doc.data().email);
    })

    const getRandomPI  = parseInt(Math.random() *  freeProviders.length); 

    return freeProviders[getRandomPI]; 
}

const getUserDetails = async ()=>{

    var userDetails = []; 
    const firestore = getFirestore();
    const providerCollection = collection(firestore , "provider");
    const q = query(providerCollection , where("email" , "==" , localStorage.getItem("email"))); 
    const qs  = await getDocs(q); 
    var retVal = null ; 
    qs.forEach(proDoc =>{
        retVal = {
            id : proDoc.id, 
            ...proDoc.data()
        }
    })
    return retVal
}

export default getNewProvider ;
export {
    getNewProvider,
    getUserDetails
}