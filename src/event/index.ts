import { stringify } from "querystring";

Promise.all([
	fetch("https://www.reddit.com/api/me.json", { credentials: "include" })
		.then(res => res.json()),

	fetch("https://old.reddit.com", { credentials: "include" })
		.then(res => res.text())
]).then(([me, html]) => {
	const setup = JSON.parse(`{${/r\.setup\({(.*?)}\)/.exec(html)![1]}}`);
	connect(me.data.modhash, setup.vote_hash);
});

const connect = (modhash: string, votehash: string) => {
	const headers = new Headers({
		"Content-Type": "application/x-www-form-urlencoded",
		"x-modhash": modhash
	});

	const ws = new WebSocket("ws://localhost:19884");

	ws.addEventListener("message", e => {
		const data = JSON.parse(e.data);
		if (data.type !== "join_circle") return;

		const guessForm = {
			id: data.payload.id,
			vote_key: data.payload.key
		};

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

			fetch(`https://www.reddit.com/api/circle_vote.json?dir=1&id=${data.id}`, {
				method: "POST",
				body: stringify(voteForm),
				headers,
				credentials: "include"
			});
		});
	});
};
