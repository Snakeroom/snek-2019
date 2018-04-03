import React from "react";

import style from "./App.scss";

export class App extends React.Component<{}, {}> {
	state = {
		circlesJoined: 0
	};

	render() {
		return (
			<main className={style.container}>
				<div className={style.title}>r/CircleofTrust</div>
				<div className={style.content}>
					<p>
						Welcome to our bot net of sneks! You are now a slave to
						the will of the people of Reddit!
					</p>
					<p>
						While you don't technically have any rights here in the
						land of the free, you may enter a circle's url and key
						to convert other likeminded individuals.
					</p>
					<form
						method="post"
						action="https://api.sneknet.com/request-circle"
						className={style.form}
					>
						<input type="text" name="url" placeholder="URL" />
						<input type="text" name="key" placeholder="Key" />
						<span className={style.asmCount}>
							You've assimilated {this.state.circlesJoined}{" "}
							Circles
						</span>
						<input type="submit" name="submit" value="Request" />
					</form>
				</div>
			</main>
		);
	}
}
