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

chrome.storage.local.get("scienceUUID", ({ scienceUUID }) => connect(scienceUUID));

chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === "install") {
		chrome.storage.local.set({ scienceUUID: v4() });
	}
});

const connect = async (scienceUUID: string) => {
	const ws = new WebSocket("wss://snake.egg.party");
	ws.addEventListener("message", async e => {
		const data = JSON.parse(e.data);
		// We only handle `scenes`
		if (data.type !== "scenes") return;

		// Fetch user's modhash from reddit API, needed to submit vote
		const me = await fetch("https://www.reddit.com/api/me.json", {
			credentials: "include"
		}).then(res => res.json());

		// Common headers for requests
		const headers = new Headers({
			"Content-Type": "application/x-www-form-urlencoded",
			"x-modhash": me.data.modhash
		});

		chrome.storage.local.get("voted", ({ voted = [] }: { voted: string[] }) => {
			// Get the posts to vote on, by excluding voted from new posts
			const toVote = data.fullnames.filter((n: string) => !voted.includes(n));
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
							if (res.ok) console.log("voted on " + name);
						}),
					timeout
				);

				// Offset every request from each other by 1 second, to reduce load
				timeout += 1000;
			}

			// Update voted array with new votes and save to storage
			voted.push(...toVote);
			chrome.storage.local.set({ voted });

			// If science is enabled, send it over the websocket
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
		// Retry connection in 5 seconds
		setTimeout(connect.bind(null, scienceUUID), 5000);
	});
};
