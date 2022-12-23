import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import {
	TextField,
	Button,
	Snackbar,
	Alert,
	InputAdornment,
	IconButton,
	FormControl,
	InputLabel,
	FilledInput,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import Navbar from "./Navbar";
import ToDoCard from "./ToDoCard";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/DateRange";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function Homepage() {
	const [todo, setTodo] = useState("");
	const [todos, setTodos] = useState([]);
	const [value, setValue] = useState(0);
	const [UUID, setUUID] = useState("");
	const [todoTime, setToDoTime] = useState(new Date());
	const [todoEndTime, setToDoEndTime] = useState(new Date());
	const [endTimeError, setEndTimeError] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
					setTodos([]);
					const data = snapshot.val();
					if (data !== null) {
						Object.values(data).map((todo) => {
							setTodos((oldArray) => [todo, ...oldArray]);
						});
					}
				});
			} else if (!user) {
				navigate("/");
			}
			document.title = `ToDo App: {user.displayName}`;
		});
	}, []);

	useEffect(() => {
		//  check if end time is greater than start time
		if (todoEndTime < todoTime) {
			setToDoEndTime(todoTime);
			setEndTimeError(true);
		}
	}, [todoEndTime, todoTime]);

	// add
	const writeToDatabase = () => {
		const uuid = uid();
		set(ref(db, `/${auth.currentUser.uid}/${uuid}`), {
			todo: todo,
			uuid: uuid,
			value: value,
			noTime:
				moment(todoTime).format("LLL") === moment(todoEndTime).format("LLL"),
			startTime: moment(todoTime).format("LLL"),
			endTime: moment(todoEndTime).format("LLL"),
		});
		setTodo("");
		setValue(0);
		setToDoTime(new Date());
		setToDoEndTime(new Date());
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div
			style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
		>
			<Snackbar
				open={endTimeError}
				autoHideDuration={10000}
				onClose={() => {
					setEndTimeError(false);
				}}
				message="End Time cannot be earlier than Start Time"
			>
				<Alert
					onClose={() => {
						setEndTimeError(false);
					}}
					severity="error"
					sx={{ width: "100%", fontWeight: "bold" }}
				>
					End Time cannot be earlier than Start Time!
				</Alert>
			</Snackbar>
			<Navbar />
			<div
				className="homepage"
				style={{
					border: "blue 1px solid",
					display: "flex",
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					position: "relative",
					background:
						"linear-gradient(122.19deg, #b0e5f5 1.89%, #785ce7 113.56%)",
					height: "93.4vh",
					width: "99.92%",
					overflow: "auto",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div>
						<FormControl sx={{ mr: 1, width: "100%" }} variant="filled">
							<InputLabel
								style={{
									fontSize: "12px",
									color: "black",
									fontFamily: "roboto",
								}}
							>
								Enter To Do Item Here
							</InputLabel>
							<FilledInput
								style={{
									position: "absolute",
									top: "20px",
									outline: "none",
									border: "none",
									height: "50px",
									width: "100%",
									fontSize: "25px",
									padding: "5px 20px",
								}}
								maxRows={1}
								type="text"
								value={todo}
								onChange={(e) => {
									setTodo(e.target.value);
								}}
								endAdornment={
									<>
										<InputAdornment position="end">
											{todo !== "" && (
												<IconButton
													aria-label="toggle password visibility"
													onClick={writeToDatabase}
													onMouseDown={writeToDatabase}
													edge="end"
												>
													<AddIcon />
												</IconButton>
											)}
										</InputAdornment>
									</>
								}
							/>
						</FormControl>
						<>
							<div style={{ width: "100%" }}>
								<Stack
									spacing={2}
									direction="row"
									sx={{ mt: 8, mb: 1 }}
									alignItems="center"
								>
									<Slider
										aria-label="Volume"
										value={value}
										onChange={handleChange}
									/>
									<p
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										{value}%
									</p>
								</Stack>
							</div>
						</>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "20px",
							alignContent: "center",
							justifyContent: "center",
						}}
					>
						<DateTimePicker
							components={{
								OpenPickerIcon: CalendarMonthIcon,
								LeftArrowIcon: ArrowLeftIcon,
								RightArrowIcon: ArrowRightIcon,
							}}
							label="Start DateTime"
							value={todoTime}
							onChange={(newValue) => {
								setToDoTime(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
						<DateTimePicker
							components={{
								OpenPickerIcon: CalendarMonthIcon,
								LeftArrowIcon: ArrowLeftIcon,
								RightArrowIcon: ArrowRightIcon,
							}}
							label="End DateTime"
							value={todoEndTime}
							onChange={(newValue) => {
								setToDoEndTime(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</div>
				</div>
				<div
					style={{
						// border: "grey 2px solid",
						borderRadius: "12px",
						width: "100%",
						position: "absolute",
						top: "28%",
					}}
				>
					{todos.map((todo) => (
						<>
							<ToDoCard UUID={todo.uuid} todoItem={todo} />
						</>
					))}
				</div>
			</div>
		</div>
	);
}
