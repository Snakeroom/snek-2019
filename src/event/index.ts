import { stringify } from "querystring";

fetch("https://www.reddit.com/api/me.json", { credentials: "include" })
	.then(res => res.json())
	.then(me => connect(me.data.modhash));

chrome.runtime.onInstalled.addListener(e => {
	if (e.reason === "install") {
		chrome.tabs.create({ url: "popup.html" });
	}
});

chrome.storage.local.get("asmCount", data => {
	const asmCount = data.asmCount || 0;
	chrome.browserAction.setBadgeText({ text: asmCount.toString() });
});

const connect = (modhash: string) => {
	// Common headers for requests
	const headers = new Headers({
		"Content-Type": "application/x-www-form-urlencoded",
		"x-modhash": modhash
	});

	// Connect to the correct WebSocket server based on env
	const ws = new WebSocket(
		process.env.NODE_ENV === "production"
			? "wss://api.sneknet.com"
			: "ws://localhost:3000"
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
		Promise.all([
			fetch("https://www.reddit.com/api/guess_voting_key.json", {
				method: "POST",
				body: stringify(guessForm),
				headers,
				credentials: "include"
			})
				.then(res => res.json()),

			// Request main HTML for votehash
			fetch("https://old.reddit.com", { credentials: "include" })
				.then(res => res.text())
		]).then(([_, html]) => {
			// Parse out the setup JSON from the HTML
			const setup = JSON.parse(`{${/r\.setup\({(.*?)}\)/.exec(html)![1]}}`);
			const votehash = setup.vote_hash;

			const voteForm = {
				id: data.payload.id,
				dir: "1",
				isTrusted: "true",
				vh: votehash
			};

			// Vote direction 1 on the circle to join it, then increase asmCount if successful
			fetch(`https://www.reddit.com/api/circle_vote.json?dir=1&id=${data.payload.id}`, {
				method: "POST",
				body: stringify(voteForm),
				headers,
				credentials: "include"
			}).then(res => {
				if (res.status === 200) increaseAsmCount();
			});
		});
	});

	ws.addEventListener("close", () => {
		setTimeout(connect.bind(null, modhash), 5000);
	});
};

const increaseAsmCount = () => {
	chrome.storage.local.get("asmCount", data => {
		const asmCount = data.asmCount || 0;
		chrome.storage.local.set({ asmCount: asmCount + 1 });
		chrome.browserAction.setBadgeText({ text: (asmCount + 1).toString() });
	});
};
