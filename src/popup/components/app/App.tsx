import React from 'react'
import { stringify } from 'querystring'

import style from './App.scss'

export class App extends React.Component<{}, {}> {
	state = {
		asmCount: 0,
		url: '',
		key: ''
	}

	componentDidMount() {
		chrome.storage.local.get("asmCount", data => {
			this.setState({ asmCount: data.asmCount || 0 });
		});
	}

	handleSubmit(e) {
		e.preventDefault();

		fetch('https://api.sneknet.com/request-circle', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			body: stringify({
				url: this.state.url,
				key: this.state.key
			}),
			credentials: "include"
		})
	}

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
					<form onSubmit={this.handleSubmit} className={style.form}>
						<input
							type="text"
							placeholder="URL"
							onChange={e => {
								this.setState({ url: e.target.value })
							}}
						/>
						<input
							type="text"
							placeholder="Key"
							onChange={e => {
								this.setState({ key: e.target.value })
							}}
						/>
						<span className={style.asmCount}>
							You've assimilated {this.state.asmCount} Circles
						</span>
						<input type="submit" value="Request" />
					</form>
				</div>
			</main>
		)
	}
}
