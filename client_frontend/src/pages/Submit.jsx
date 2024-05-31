import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
const Submit = () => {
	return (
		<div className='h-screen w-full flex justify-center items-center flex-col bg-gray-200 bg-opacity-40'>
			<div className='bg-white rounded-lg shadow-2xl p-2 w-11/12 md:w-1/3 flex flex-col justify-center items-center'>
				<b>Information submitted</b>
				<hr className='border-gray-200 border w-full' />
				<FontAwesomeIcon
					icon={faClock}
					size='lg'
					className='text-white bg-blue-500 p-1 rounded-full'
				/>
				<b>Thank for submitting your info</b>
				<p className='text-justify text-sm'>
					If should take about 2 business days to review your submission.
					We&#39;ll update your verification status after the review is complete
				</p>
				<Link
					to={"https://www.facebook.com/help"}
					className='self-end bg-blue-500 text-white font-bold rounded-md p-1 px-5'
				>
					Done
				</Link>
			</div>
		</div>
	);
};
export default Submit;
