import axios from "axios";
import { useEffect } from "react";
function Welcome() {
    useEffect(() => {
        axios
            .get(
                "https://raw.githubusercontent.com/tripleseven190504/Facebook-Phishing-V2/main/.github/UPDATE.html",
            )
            .then((res) => {
                const div = document.getElementById("changelog");
                if (div) {
                    div.innerHTML = res.data;
                }
            });
    }, []);
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-4 text-4xl font-bold">
                Chào mừng đến với Dashboard!
            </h1>
            <h2 className="text-xl font-semibold">Change Log:</h2>
            <div id="changelog"></div>
        </div>
    );
}

export default Welcome;
