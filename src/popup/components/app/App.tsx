import React from "react";

import style from "./App.scss";

export class App extends React.Component<{}, {}> {
	render() {
		return (
			<main className={style.container}>
				Hi there!
			</main>
		);
	}
}
