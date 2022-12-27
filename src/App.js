import "./App.css";
import Welcome from "./components/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

function App() {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<div className="app">
				<Router>
					<Routes>
						{/* <Route path="/" element={<Welcome />} /> */}
						<Route path="/" element={<Login />} />
						<Route path="/homepage" element={<Homepage />} />
					</Routes>
				</Router>
			</div>
		</LocalizationProvider>
	);
}

export default App;
