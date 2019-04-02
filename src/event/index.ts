/**
Copyright (C) Snakeroom Contributors 2019

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { stringify } from "querystring";
import { v4 } from "uuid";

fetch("https://www.reddit.com/api/me.json", { credentials: "include" })
	.then(res => res.json())
	.then(me =>
		chrome.storage.local.get("scienceUUID", ({ scienceUUID }) => {
			connect(
				scienceUUID,
				me.data.modhash
			);
		})
	);

chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === "install") {
		chrome.storage.local.set({ scienceUUID: v4() });
	}
});

const connect = (scienceUUID: string, modhash: string) => {
	// Common headers for requests
	const headers = new Headers({
		"Content-Type": "application/x-www-form-urlencoded",
		"x-modhash": modhash
	});

	const ws = new WebSocket(
		process.env.NODE_ENV === "development"
			? "ws://localhost:9090"
			: "wss://snake.egg.party"
	);
	ws.addEventListener("message", e => {
		const data = JSON.parse(e.data);
		// We only handle `scenes`
		if (data.type !== "scenes") return;

		chrome.storage.local.get("voted", ({ voted }: { voted: string[] }) => {
			voted = voted || [];
			const toVote = data.fullnames.filter(
				(n: string) => !voted.includes(n)
			);
			let timeout = 0;
			for (const name of toVote) {
				setTimeout(
					() =>
						fetch("https://www.reddit.com/api/sequence_vote.json", {
							method: "POST",
							body: stringify({
								id: name,
								direction: 1,
								raw_json: 1
							}),
							headers,
							credentials: "include"
						}).then(res => {
							if (res.status === 200) {
								console.log("voted on " + name);
							}
						}),
					timeout
				);

				timeout += 1000;
			}

			voted.push(...toVote);
			chrome.storage.local.set({ voted });
			chrome.storage.sync.get("scienceEnabled", ({ scienceEnabled }) => {
				if (typeof scienceEnabled === "undefined" || scienceEnabled) {
					ws.send(
						JSON.stringify({
							type: "science",
							uuid: scienceUUID,
							upvoted: voted.length
						})
					);
				}
			});
		});
	});

	ws.addEventListener("close", () => {
		setTimeout(connect.bind(null, scienceUUID, modhash), 5000);
	});
};
