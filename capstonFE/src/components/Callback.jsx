import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code) {
			localStorage.setItem("spotifyAuthCode", code);
			navigate("/account"); // Redirect to Me page after storing code
		}
	}, [navigate]);

	return <p>Authenticating...</p>;
}

export default Callback;
