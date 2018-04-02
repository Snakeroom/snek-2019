import React from "react";

import style from "./App.scss";

export class App extends React.Component<{}, {}> {
	render() {
		return (
			<main className={style.container}>
				<div className={style.title}>r/CircleOfTrust</div>
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
					<form className={style.form}>
						<input
							type="text"
							name="circle_url"
							placeholder="URL"
						/>
						<input
							type="text"
							name="circle_key"
							placeholder="Key"
						/>
						<span className={style.asmCount}>
							You've assimilated :: Circles
						</span>
						<input type="submit" name="submit" value="Request" />
					</form>
				</div>
			</main>
		);
	}
}
