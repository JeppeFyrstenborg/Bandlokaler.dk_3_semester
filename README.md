# Bandlokaler - Semester Projekt EAAA

## Disable

Disable mocha test explorer. Den kører serveren automatisk, så man ikke kan lukke den igen.

## Hjemmeside shortcuts

[W3 School - HTML, CSS, JS osv..](https://www.w3schools.com/)

[Firebase projekt](https://console.firebase.google.com/project/bandlokaler---eaaa-projekt/overview)

[JIRA Scrum board](https://bandlokaler-eaaa.atlassian.net/jira/software/projects/BEP/boards/1)

## Packages Installation

```bash
npm init -y
npm i pug firebase express chai mocha dotenv chai-http supertest express-session
```

## Terminal commands

```bash
node app.js
```

## Firebase config

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```
