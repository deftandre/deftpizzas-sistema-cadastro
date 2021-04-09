# Deft Pizza Delivery

## Description

Web portal to manage the pizza ordering website https://deftpizzasdelivery.netlify.app/

Available in https://deftpizzascadastros.netlify.app/login

Note: Only admin user is declared in Cloud Firestore rules to write in this portal.

## Default settings for environment variables

Create a '.env.local' file at the root of your application, with the following variables:

Variables that ask for keys are from an application created with Firebase.

```
BROWSER=none

REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
REACT_APP_APP_ID=
REACT_APP_MEASUREMENT_ID=
```

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## License

&copy; André Almeida
