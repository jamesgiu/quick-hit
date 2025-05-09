[![Deploy to GH Pages](https://github.com/jamesgiu/quick-hit/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/jamesgiu/quick-hit/actions/workflows/deploy.yml)
[![Node.js CI](https://github.com/jamesgiu/quick-hit/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/jamesgiu/quick-hit/actions/workflows/node.js.yml)

![image](https://user-images.githubusercontent.com/13777223/197453643-bb8ee2cb-d93f-4bb7-bb25-0ddec44cd147.png)

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

### Other
#### `npm run lint` and `npm run lint:fix`

Runs `eslint` over the project.

#### `npm run lint:css` and `npm run lint:css:fix` 

Runs `stylelint` over the project.

#### `npm run style` and `npm run style:fix`

Runs `prettier` over the project.

## Contributing

Feel free to contribute to any [Issues](https://github.com/jamesgiu/quick-hit/issues) or [make your own](https://github.com/jamesgiu/quick-hit/issues/new/choose)!

The guidelines are as follows:

- There are no guidelines in the wild west.

## Getting started with Firebase

### Creating a Firebase Realtime Database

The .env file(s) should contain details for the application to reach your Firebase DB.

`.env.development` will be used for `npm start`.

`.env.production` will be used for `npm build`.

The following is an example file:

```aidl
REACT_APP_FB_URL=https://<YOUR-DB>.<YOUR-REGION>.firebasedatabase.app/
REACT_APP_FB_ANALYTICS_UA="UA-123"
```

### Creating the catalogue database
The catalogue will store references to all instances of QuickHit available. 

1. Visit https://console.firebase.google.com/u/1/ and select "Add Project"
2. Then select 'Realtime Database'
3. Create your new database, keep all settings default
4. Once complete, the URL provided here will be the value to use as the `REACT_APP_FB_URL` in `.env`
5. Import some dummy data to get the schema going, use the menu and select "Import JSON"
6. Upload the committed file `db-example-catalogue.json` to get the schema initialised

### Catalogue database entries
The below is an example of a catalogue entry for a QuickHit instance.

```aidl
{
  "instances" : {
    "dbb0a47d-9a2a-40ef-900f-4e11b8dc5fd3 " : {
      "fb_api_key" : "AIzaSyC-lBTbcM2aYfD5p7AgAoXJA30UwvpLnL4",
      "fb_srv_acc_name" : "table-tennis@svc.acc",
      "fb_url" : "https://table-tennis-testing-default-rtdb.asia-southeast1.firebasedatabase.app/",
      "name" : "Demo Instance",
      "restricted_happy_hour" : true,
      "tournaments" : true,
      "google_auth": true
    }
  }
}

```
#### fb_api_key
Retrieved via Firebase using the following steps:
1. On the console view (https://console.firebase.google.com/u/1/), click on the Settings cog next to "Project Overview"
2. Click on "general"
3. Take note of the "Web API Key", this will be used for `fb_api_key` in the catalogue database.
#### fb_srv_acc_name
Retrieved via Firebase using the following steps:
1. On the console view (https://console.firebase.google.com/u/1/), select "Authentication" and then "Get started"
2. Enable the Email/Password Sign-in method
3. Go to "Users" then click "Add user"
4. Add a service account and a password for it, this password will be prompted for when a user first uses the application.
5. The service account user name will be used for `fb_srv_acc_name` in the catalogue database.
#### fb_url
Retrieved via Firebase using the following steps:
1. On the console view (https://console.firebase.google.com/u/1/), select "Realtime Database"
2. The URL will be displayed on the page (under "Data")
#### restricted_happy_hour
If true, Happy Hour can only occur at 12:00PM or 4:00PM (better for a workplace!)
#### tournaments
If true, tournaments will be enabled.
#### google_auth
If true, Authentication via a Google Account provider will be enabled. Expects the Instance on Firebase to have
Google as a Sign-In provider.

### Creating an instance database
An instance database will store all the matches, players, and other data relevant to a particular instance of QuickHit.

1. Visit https://console.firebase.google.com/u/1/ and select "Add Project"
2. Then select 'Realtime Database'
3. Create your new database, keep all settings default
4. Once complete, the URL provided here will be the value to use as the `fb_url` in the catalogue database.
5. Import some dummy data to get the schema going, use the menu and select "Import JSON"
6. Upload the committed file `db-example.json` to get the schema initialised

### Protecting the instance database

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

![image](https://user-images.githubusercontent.com/13777223/194062100-1b523f3b-0489-4629-9da4-fc537c01e4cd.png)
![image](https://user-images.githubusercontent.com/13777223/194063031-366e4014-06c0-4752-b32b-51be8c194612.png)
![image](https://user-images.githubusercontent.com/13777223/194063062-51fc1675-cf55-47c1-b4eb-7f16adb8e1bb.png)
![image](https://user-images.githubusercontent.com/13777223/194062177-ecc6a84b-273a-454f-a6ef-b428392bf01f.png)
![image](https://user-images.githubusercontent.com/13777223/194062252-bb7dc3be-55e1-447d-9eee-786c8ec3830c.png)
![image](https://user-images.githubusercontent.com/13777223/194062306-f8a06d28-012c-4fba-900f-2f712001792d.png)
![image](https://user-images.githubusercontent.com/13777223/194062377-75e81c28-3be9-4e58-8bc9-fd21f2918631.png)
![image](https://user-images.githubusercontent.com/13777223/194062418-f4116d65-f51b-4197-b11a-27414e5d7cd7.png)
![image](https://user-images.githubusercontent.com/13777223/194062441-6764e263-f718-436b-a53f-137db6fc791f.png)
![image](https://user-images.githubusercontent.com/13777223/194062500-ca9bcd6e-b128-4fba-a6e9-f84d65de356d.png)
![image](https://user-images.githubusercontent.com/13777223/194062560-d2bf41d9-07c9-4373-a97e-accee91a6a2b.png)







