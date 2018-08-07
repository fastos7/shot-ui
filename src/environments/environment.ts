// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  AUTHORIZATION_EXPIRY_HEADER_NAME: 'Authorization_Expiry',
  AUTHORIZATION_HEADER_NAME: 'Authorization',
  CURRENT_USER_KEY: 'currentUser',
  GOOGLE_RECAPTCHA_KEY: '6LcCFksUAAAAAPQ0BKPrBONRxiWMtpS2eXmaggqY'
};
