# Quick Hit
Table tennis tracking application using React and Firebase.

Hosted at: https://jamesgiu.github.io/quick-hit/

## Commands
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run deploy`

Will deploy the application to `github-pages` to be hosted. 

See more: https://github.com/jamesgiu/quick-hit/deployments/activity_log?environment=github-pages

## Contributing
Feel free to contribute to any [Issues](https://github.com/jamesgiu/quick-hit/issues) or [make your own](https://github.com/jamesgiu/quick-hit/issues/new/choose)! 

The guidelines are as follows:
* There are no guidelines in the wild west.

## Getting started with Firebase
### Creating a Firebase Realtime Database

The .env file(s) should contain details for the application to reach your Firebase DB.

`.env.development` will be used for `npm start`.

`.env.production` will be used for `npm build`.

The following is an example file:
```aidl
REACT_APP_FB_URL=https://<YOUR-DB>.<YOUR-REGION>.firebasedatabase.app/
REACT_APP_FB_API_KEY=<WEB-API-KEY>
REACT_APP_FB_SRV_ACC_NAME="<YOUR-SVC-ACC-USERNAME>"
```

### Creating the database
1. Visit https://console.firebase.google.com/u/1/ and select "Add Project"
2. Then select 'Realtime Database'
3. Create your new database, keep all settings default
4. Once complete, the URL provided here will be the value to use as the `REACT_APP_FB_URL` in `.env`
5. Import some dummy data to get the schema going, use the menu and select "Import JSON"
6. Upload the committed file `db-example.json` to get the schema initialised

### Getting the service account and API key
1. On the console view (https://console.firebase.google.com/u/1/), click on the Settings cog next to "Project Overview"
2. Click on "general"
3. Take note of the "Web API Key", this will be used for `REACT_APP_FB_API_KEY` in `.env`.

### Setting up basic auth with the Service account user
1. On the console view (https://console.firebase.google.com/u/1/), select "Authentication" and then "Get started"
2. Enable the Email/Password Sign-in method
3. Go to "Users" then click "Add user"
4. Add a service account and a password for it, this password will be prompted for when a user first uses the application.

### Protecting the database
1. On the console view (https://console.firebase.google.com/u/1/), select "Authentication" and then "Users"
2. Copy the UUID of your newly added firebase service account (e.g. gSid15y7XJMC8E273OIjLjgaYig2)
3. Go to "Realtime Database"
4. Select "Rules"
5. Change the Rules to only allow reads and writes from the authenticated service account user's UID:
    ```aidl
    {
      "rules": {
        ".read": "auth.uid == 'gSid15y7XJMC8E273OIjLjgaYig2'",
        ".write": "auth.uid == 'gSid15y7XJMC8E273OIjLjgaYig2'"
      }
    }
    ```

## Screenshots

![Image 1](./public/markdown_img_1.PNG)
![Image 2](./public/markdown_img_2.PNG)