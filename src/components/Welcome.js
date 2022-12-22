import React, { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@mui/material";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import "./welcome.css";

export default function Welcome() {
	const navigate = useNavigate();

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				navigate("/homepage");
			}
		});
		document.title = "ToDo App Sign In";
	}, []);

	const googlePopupSignIn = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then(() => {
				navigate("/homepage");
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				background:
					"linear-gradient(122.19deg, #b0e5f5 1.89%, #785ce7 113.56%)",
			}}
		>
			<h1
				style={{
					fontFamily: "Changa",
					fontWeight: "normal",
					fontSize: "144px",
					left: "46px",
					top: "155px",
					color: "white",
					position: "absolute",
				}}
			>
				To Do App
			</h1>
			<h3
				style={{
					left: "46px",
					top: "288px",
					position: "absolute",
					color: "white",
				}}
			>
				Powered By Firebase And React.JS
			</h3>
			<h3
				style={{
					left: "0px",
					bottom: "0px",
					fontSize: "16px",
					position: "absolute",
					color: "grey",
				}}
			>
				Developed by Jacky Lee @ 2022
			</h3>
			<div className="login-register-container">
				<>
					<Button
						variant="contained"
						onClick={() => {
							googlePopupSignIn();
						}}
					>
						Login With Google
					</Button>
				</>
			</div>
		</div>
	);
}
