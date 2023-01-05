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
	Fab,
	Modal,
	Select,
	MenuItem,
	Chip,
	useTheme,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import Navbar from "./Navbar";
import ToDoCard from "./ToDoCard";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/DateRange";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function Homepage(props) {
	const [todo, setTodo] = useState("");
	const [todos, setTodos] = useState([]);
	const [type, setType] = useState("");
	const [types, setTypes] = useState([]);
	const [newType, setNewType] = useState("");
	const [value, setValue] = useState(0);
	const [todoTime, setToDoTime] = useState(new Date());
	const [todoEndTime, setToDoEndTime] = useState(new Date());
	const [endTimeError, setEndTimeError] = useState(false);
	const [newTypeError, setNewTypeError] = useState(false);
	const [newTypeTemp, setNewTypeTemp] = useState("");
	const navigate = useNavigate();

	const [openType, setOpenType] = useState(false);
	const handleOpenType = () => setOpenType(true);
	const handleCloseType = () => setOpenType(false);
	const theme = useTheme();

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
				onValue(ref(db, `/type/${auth.currentUser.uid}`), (snapshot) => {
					setTypes([]);
					const data = snapshot.val();
					if (data !== null) {
						Object.values(data).map((type) => {
							setTypes((oldArray) => [...oldArray, type]);
						});
					} else {
						set(ref(db, `/type/${auth.currentUser.uid}`), [
							"Unspecified",
							"Urgent",
							"Chores",
							"Work",
							"Personal",
							"Assignment",
						]);
					}
				});
			} else if (!user) {
				navigate("/");
			}
			document.title = `ToDo App: ${user.displayName}`;
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
			type: type !== "" ? type : "Unspecified",
		});
		setTodo("");
		setValue(0);
		setToDoTime(new Date());
		setToDoEndTime(new Date());
		setType("Unspecified");
	};

	const resetDatabaseTypes = () => {
		set(ref(db, `/type/${auth.currentUser.uid}`), [
			"Unspecified",
			"Urgent",
			"Chores",
			"Work",
			"Personal",
			"Assignment",
		]);
		setTypes([
			"Unspecified",
			"Urgent",
			"Chores",
			"Work",
			"Personal",
			"Assignment",
		]);
	};

	const ModalStyles = (theme) => ({
		root: {
			position: "absolute",
			width: 400,
			backgroundColor: "red",
			border: "2px solid #000",
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
			[theme.breakpoints.down("md")]: {
				marginTop: 0,
			},
			[theme.breakpoints.up("md")]: {
				marginTop: 100,
			},
		},
	});

	const writeTypesToDatabase = () => {
		if (newType === "") return;
		if (types.includes(newType)) {
			setNewTypeError(true);
			setNewTypeTemp(newType);
			setNewType("");
			return;
		}
		setTypes([...types, newType]);
		set(ref(db, `/type/${auth.currentUser.uid}`), [...types, newType]);
		setNewType("");
	};

	const updateDeletedTypes = () => {
		set(ref(db, `/type/${auth.currentUser.uid}`), [...types]);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div
			style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
		>
			<head>
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2310042231975806"
					crossorigin="anonymous"
				></script>
			</head>
			<Snackbar
				open={newTypeError}
				autoHideDuration={10000}
				onClose={() => {
					setNewTypeError(false);
				}}
				message={`The Type [${newTypeTemp}] already exists!`}
			>
				<Alert
					onClose={() => {
						setNewTypeError(false);
					}}
					severity="error"
					sx={{ width: "100%", fontWeight: "bold" }}
				>
					The Type `{newTypeTemp}` already exists!
				</Alert>
			</Snackbar>
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
					overflow: "scroll",
				}}
			>
				{/* Edit Types Modal */}
				<Modal
					open={openType}
					onClose={handleCloseType}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					sx={{
						overflow: "scroll",
						ModalStyles,
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "32px",
							gap: "32px",
							position: "relative",
							margin: "96px auto 32px",
							marginBottom: "32px",
							maxWidth: "520px",
							backgroundColor: "white",
							boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
							borderRadius: "16px",
						}}
					>
						<div
							style={{
								border: "1px solid lightgrey",
								backgroundColor: "lightgrey",
								width: "32px",
								height: "32px",
								borderRadius: "16px",
								fontSize: 20,
								alignSelf: "center",
								position: "absolute",
								top: "5%",
								right: "5%",
								cursor: "pointer",
							}}
						>
							<CloseIcon
								style={{
									position: "relative",
									top: "4px",
									left: "4px",
								}}
								onClick={handleCloseType}
							></CloseIcon>
						</div>
						<div
							style={{
								whiteSpace: "pre-wrap",
								textAlign: "center",
								fontSize: "24px",
								marginBottom: 0,
							}}
						>
							Type Edit {"\n"}
							<span style={{ fontSize: "20px" }}>
								You Can Add/Remove Types Here!
							</span>
						</div>

						<div
							style={{
								top: "0",
								position: "relative",
								width: "100%",
								height: "70px",
								margin: "0 auto",
							}}
						>
							<FormControl sx={{ mr: 1, width: "100%" }} variant="filled">
								<InputLabel
									style={{
										fontSize: "16px",
										color: "black",
										fontFamily: "Roboto",
									}}
								>
									New Task Type
								</InputLabel>
								<FilledInput
									style={{
										position: "absolute",
										height: "70px",
										width: "100%",
										fontSize: "25px",
										margin: "0 auto",
										borderRadius: "16px 16px 0px 0px",
										backgroundColor: "lightgrey",
									}}
									maxRows={1}
									type="text"
									value={newType}
									onChange={(e) => {
										setNewType(e.target.value);
									}}
									endAdornment={
										<>
											<InputAdornment position="end">
												{newType !== "" && (
													<IconButton
														aria-label="Add New Type"
														onClick={writeTypesToDatabase}
														onMouseDown={writeTypesToDatabase}
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
						</div>

						<div style={{ width: "100%" }}>
							<Stack spacing={1} sx={{ width: "80%", margin: "0 auto" }}>
								{types.map
									? types.map((type) => (
											<Chip
												label={type}
												onDelete={() => {
													// remove the type from the types array
													const newTypes = types.filter((t) => t !== type);
													setTypes(newTypes);
													updateDeletedTypes();
												}}
												color="primary"
												variant="contained"
											/>
									  ))
									: null}
							</Stack>
						</div>

						<div>
							<Tooltip title="Default Types: [Unspecified, Urgent, Chores, Work, Personal, Assignment]">
								<Button
									variant="contained"
									color="error"
									onClick={resetDatabaseTypes}
									startIcon={<DeleteIcon />}
								>
									Reset To Default Types (No Undo)
								</Button>
							</Tooltip>
						</div>
					</div>
				</Modal>

				<Fab
					color="primary"
					variant="extended"
					aria-label="edit"
					onClick={(e) => {
						e.preventDefault();
						handleOpenType();
					}}
					style={{
						margin: 0,
						gap: "3px",
						top: "auto",
						right: 25,
						bottom: 20,
						left: "auto",
						position: "fixed",
						width: "fit-content",
					}}
				>
					Edit Types
					<EditIcon />
				</Fab>

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
								Enter To Do Item Here {props.test}
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
						<FormControl sx={{ minWidth: "25%" }}>
							<InputLabel>Task Type</InputLabel>
							<Select
								sx={{ width: "100%", minWidth: "100%" }}
								defaultValue="Unspecified"
								value={type}
								onChange={(e) => {
									setType(e.target.value);
								}}
							>
								{types.map((t) => (
									<MenuItem
										sx={{ width: "100%", minWidth: "100%", opacity: 0.9 }}
										value={t}
									>
										{t}
									</MenuItem>
								))}
							</Select>
						</FormControl>
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
