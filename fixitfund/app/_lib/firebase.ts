// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..' + '/.env') });

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

if(firebaseConfig === undefined){
    console.error("Firebase Config undefined, please check .env file");
}

// // Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;