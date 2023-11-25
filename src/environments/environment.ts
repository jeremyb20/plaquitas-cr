// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  environmentName: 'dev',
  //ws: 'https://www.localpetsandfamily.com'
  //ws: 'https://localpetsandfamily.onrender.com'
   //ws: 'https://pets-qr-production.up.railway.app'
  //ws: 'https://pets-qr.vercel.app'
  //ws: 'https://petsqrbackend.fly.dev'
  ws: 'http://localhost:8080/',
  WebApiUrl: 'http://localhost:8080/',
  uploadFilesApi: '',
  previousDisplay: ''

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */