// create a navbar component that will be used in the app
//
// Path: src\components\Navbar.js
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { useEffect, useState } from "react";

function Navbar() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			}
		});
	}, []);

	const handleSignOut = () => {
		auth.signOut().then(() => {
			navigate("/");
		});
	};

	return (
		<>
			{user ? (
				<AppBar position="absokute" style={{ positionAbsoltue: "0 0" }}>
					<Toolbar>
						<Typography variant="h6">
							Todo App: Built With Firebase and ReactJS with MaterialUI
						</Typography>
						{user && (
							<Typography
								onClick={handleSignOut}
								variant="h6"
								style={{ marginLeft: "auto", cursor: "pointer" }}
							>
								Sign Out
							</Typography>
						)}
					</Toolbar>
				</AppBar>
			) : null}
		</>
	);
}

export default Navbar;
