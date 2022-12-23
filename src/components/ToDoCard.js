import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { set, ref, onValue, remove, update } from "firebase/database";
import { auth, db } from "../firebase.js";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import moment from "moment";

const ToDoCard = (props) => {
	const { UUID, todoItem } = props;
	const [isEdit, setIsEdit] = useState(false);
	const [todo, setTodo] = useState(todoItem.todo);
	const [oldTodo, setOldTodo] = useState(todoItem.todo);
	const [value, setValue] = useState(todoItem.value);

	const handleEditConfirm = () => {
		update(ref(db, `/${auth.currentUser.uid}/${UUID}`), {
			todo: todo,
			value: value,
			uuid: UUID,
		});
		setIsEdit(false);
		setOldTodo(todo);
	};

	const handleEditCancel = () => {
		setTodo(oldTodo);
		setIsEdit(false);
	};

	const handleUpdate = (todoItem) => {
		setIsEdit(true);
		setTodo(todo);
		setValue(value);
	};

	const handleDelete = (uid) => {
		remove(ref(db, `/${auth.currentUser.uid}/${props.UUID}`));
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div
			style={{
				display: "flex",
				width: "80%",
				margin: "0 auto",
				alignItems: "center",
				flexDirection: "row",
				marginBottom: "10px",
				backgroundColor: "rgb(211,211,211)",
				padding: "20px 25px",
				borderRadius: "12px",
			}}
		>
			<h1 style={{ alignItems: "left", width: "100%" }}>
				{isEdit ? (
					<>
						<Input
							autoFocus
							color="primary"
							defaultValue={todo}
							multiline
							minRows={1}
							onChange={(e) => setTodo(e.target.value)}
						></Input>
					</>
				) : (
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div
							style={{
								fontWeight: "normal",
								fontFamily: "Roboto",
								color: "black",
							}}
						>
							Task: {todoItem.todo}{" "}
							{todoItem.type &&
								todoItem.type !== "Unspecified" &&
								`[${todoItem.type}]`}
						</div>
						{todoItem.noTime === false &&
						todoItem.value !== 100 &&
						moment().isAfter(todoItem.endTime, "minute") ? (
							<p
								style={{
									color: "red",
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								&nbsp;&nbsp;Failed!
								<p style={{ fontSize: "16px" }}>
									{moment(todoItem.endTime).fromNow()}
								</p>
							</p>
						) : todoItem.value === 100 ? (
							<p style={{ color: "green" }}>&nbsp;&nbsp;Success!</p>
						) : (
							<p
								style={{
									color: "rgb(0, 153, 255)",
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								&nbsp;&nbsp;In Progress!
								{!todoItem.noTime &&
								moment().isSame(todoItem.endTime, "day") ? (
									<div style={{ fontFamily: "Roboto", fontSize: "16px" }}>
										Today is the Deadline:{" "}
										{moment(todoItem.endTime).fromNow(true)}
									</div>
								) : null}
							</p>
						)}
					</div>
				)}

				<div>
					{!todoItem.noTime ? (
						<div
							style={{
								fontSize: 20,
								fontWeight: "normal",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<div style={{ fontFamily: "Roboto" }}>
								Start Time: {todoItem.startTime}
							</div>
							<div style={{ fontFamily: "Roboto" }}>
								End Time: {todoItem.endTime}
							</div>
							{!moment().isAfter(todoItem.endTime, "minute") ? (
								<div style={{ fontFamily: "Roboto" }}>
									Remaining Time: {moment(todoItem.endTime).fromNow(true)}
								</div>
							) : null}
						</div>
					) : (
						<div
							style={{
								fontSize: 20,
								fontWeight: "normal",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<div style={{ fontFamily: "Roboto" }}>
								Added Time: {todoItem.startTime}
							</div>
							<div style={{ fontFamily: "Roboto" }}>
								No Specified Start & End Time
							</div>
						</div>
					)}
				</div>
				{!isEdit && (
					<p
						style={{
							fontSize: 20,
							fontWeight: "normal",
							display: "flex",
							flexDirection: "row",
						}}
					>
						Completion Percentage:
						{todoItem.value === 100 ? (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignContent: "center",
									gap: "5px",
								}}
							>
								<div style={{ color: "green" }}>&nbsp;{todoItem.value}%</div>
								<ThumbUpOffAltIcon />
							</div>
						) : (
							<p style={{ color: "red" }}>&nbsp;{todoItem.value}%</p>
						)}
					</p>
				)}

				{isEdit && (
					<>
						<Box sx={{ width: 450 }}>
							<Stack
								spacing={2}
								direction="row"
								sx={{ mb: 1 }}
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
						</Box>
					</>
				)}
			</h1>
			<div style={{ justifyContent: "right", right: 0, position: "relative" }}>
				{!isEdit ? (
					<EditIcon
						fontSize="large"
						onClick={() => handleUpdate(todoItem)}
						style={{
							cursor: "pointer",
							marginLeft: "10px",
						}}
					/>
				) : (
					<>
						<CheckIcon
							fontSize="large"
							onClick={handleEditConfirm}
							style={{
								cursor: "pointer",
								marginLeft: "10px",
							}}
						/>
						<CancelIcon
							fontSize="large"
							onClick={handleEditCancel}
							style={{
								cursor: "pointer",
								marginLeft: "10px",
							}}
						/>
					</>
				)}

				<DeleteIcon
					fontSize="large"
					onClick={() => handleDelete(todoItem.tempUUID)}
					style={{
						cursor: "pointer",
						marginLeft: "10px",
					}}
				/>
			</div>
		</div>
	);
};

export default ToDoCard;
