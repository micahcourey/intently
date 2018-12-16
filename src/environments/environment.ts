// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   apiUrl: 'http://192.168.1.170:3000/api'
// };

// Initialize Firebase
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAGo7dcdPV-Di734ofhDrXgS-8DKuDa4ow",
    authDomain: "daily-matrix.firebaseapp.com",
    databaseURL: "https://daily-matrix.firebaseio.com",
    projectId: "daily-matrix",
    storageBucket: "daily-matrix.appspot.com",
    messagingSenderId: "655738296731"
  }
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
