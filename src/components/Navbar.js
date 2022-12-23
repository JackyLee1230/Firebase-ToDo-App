// create a navbar component that will be used in the app
//
// Path: src\components\Navbar.js
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Avatar,
	Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { useEffect, useState } from "react";
import useHover from "./useHover";
import { styled } from "@mui/material/styles";

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

	const StyledBadge = styled(Badge)(({ theme }) => ({
		"& .MuiBadge-badge": {
			backgroundColor: "#44b700",
			color: "#44b700",
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			"&::after": {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				borderRadius: "50%",
				animation: "ripple 1.2s infinite ease-in-out",
				border: "1px solid currentColor",
				content: '""',
			},
		},
		"@keyframes ripple": {
			"0%": {
				transform: "scale(0.7) translate('50px')",
				opacity: 1,
			},
			"100%": {
				transform: "scale(2.4) translate('50px')",
				opacity: 0,
			},
		},
	}));

	const logoutHover = useHover(
		{ opacity: 0.7, marginLeft: "auto", cursor: "pointer", gap: "5px" },
		{ marginLeft: "auto", cursor: "pointer", gap: "5px" }
	);

	return (
		<>
			{user ? (
				<AppBar position="absokute" style={{ positionAbsoltue: "0 0" }}>
					<Toolbar>
						<Typography variant="h6">
							Todo App: Built With Firebase and React.JS with MaterialUI
						</Typography>
						{user && (
							<Button
								onClick={handleSignOut}
								variant="contained"
								color="secondary"
								{...logoutHover}
							>
								<StyledBadge
									overlap="circular"
									anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
									variant="dot"
								>
									<Avatar
										alt={user.displayName}
										src={user.photoURL}
										style={{ marginLeft: "auto", cursor: "pointer" }}
									/>
								</StyledBadge>
								Sign Out
							</Button>
						)}
					</Toolbar>
				</AppBar>
			) : null}
		</>
	);
}

export default Navbar;
