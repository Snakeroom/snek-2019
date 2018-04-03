import { stringify } from "querystring";

Promise.all([
	// Request /me for modhash
	fetch("https://www.reddit.com/api/me.json", { credentials: "include" })
		.then(res => res.json()),

	// Request main HTML for votehash
	fetch("https://old.reddit.com", { credentials: "include" })
		.then(res => res.text())
]).then(([me, html]) => {
	// Parse out the setup JSON from the HTML
	const setup = JSON.parse(`{${/r\.setup\({(.*?)}\)/.exec(html)![1]}}`);
	connect(me.data.modhash, setup.vote_hash);
});

const connect = (modhash: string, votehash: string) => {
	// Common headers for requests
	const headers = new Headers({
		"Content-Type": "application/x-www-form-urlencoded",
		"x-modhash": modhash
	});

	// Connect to the correct WebSocket server based on env
	const ws = new WebSocket(
		process.env.NODE_ENV === "production"
			? "ws://ws.sneknet.com"
			: "ws://localhost:19884"
	);

	ws.addEventListener("message", e => {
		const data = JSON.parse(e.data);
		// We only handle join_circle
		if (data.type !== "join_circle") return;

		const guessForm = {
			id: data.payload.id,
			vote_key: data.payload.key
		};

		// Try the key first to authenticate
		fetch("https://www.reddit.com/api/guess_voting_key.json", {
			method: "POST",
			body: stringify(guessForm),
			headers,
			credentials: "include"
		}).then(() => {
			const voteForm = {
				id: data.payload.id,
				dir: "1",
				isTrusted: "true",
				vh: votehash
			};

			// Vote direction 1 on the circle to join it
			fetch(`https://www.reddit.com/api/circle_vote.json?dir=1&id=${data.id}`, {
				method: "POST",
				body: stringify(voteForm),
				headers,
				credentials: "include"
			});
		});
	});
};
