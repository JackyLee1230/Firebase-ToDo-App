import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
	apiKey: "AIzaSyC9rqCrbZAbGGaqPGdIslwRKPVfVFkavT0",
	authDomain: "todoapp-b22f5.firebaseapp.com",
	databaseURL:
		"https://todoapp-b22f5-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "todoapp-b22f5",
	storageBucket: "todoapp-b22f5.appspot.com",
	messagingSenderId: "890033723592",
	appId: "1:890033723592:web:2eb31487f4a895c0d0adfd",
	measurementId: "G-C6QY63Y6WC",
};
export const app = initializeApp(firebaseConfig);

initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider("6Le0oqMjAAAAAHQRLAcQ5TBfhUgVlvX2UV-gNuns"),
});

export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth();
