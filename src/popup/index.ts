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

import { v4 } from "uuid";

chrome.storage.local.get("voted", ({ voted }) => {
	document.getElementById("votes")!.textContent = (voted || []).length;
});

document.getElementById("resetID")!.addEventListener("click", () => {
	chrome.storage.local.set({ scienceUUID: v4() });
});

const enableCheckbox = document.getElementById(
	"enableScience"
) as HTMLInputElement;

chrome.storage.sync.get("scienceEnabled", ({ scienceEnabled }) => {
	enableCheckbox.checked =
		typeof scienceEnabled === "undefined" ? true : scienceEnabled;
});

enableCheckbox.addEventListener("change", () => {
	chrome.storage.sync.set({ scienceEnabled: enableCheckbox.checked });
});
