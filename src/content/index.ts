const ws = new WebSocket("wss://echo.websocket.org");
ws.addEventListener("open", () => ws.send("hi"));
ws.addEventListener("message", e => {
	console.log(e);
});
