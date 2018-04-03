import React from 'react'
import { stringify } from 'querystring'

import style from './App.scss'

const url = process.env.NODE_ENV === "production"
	? "https://api.sneknet.com"
	: "http://localhost:3000";

export class App extends React.Component<{}, {}> {
	state = {
		authenticated: false,
		asmCount: 0,
		message: '',
		requested: false,
		url: '',
		key: ''
	}

	componentDidMount() {
		chrome.storage.local.get(["asmCount", "requested"], data => {
			this.setState({ asmCount: data.asmCount || 0, requested: data.requested });
		});

		fetch(`${url}/authenticated`, { credentials: "include" })
		.then(res => res.json())
		.then(json => this.setState({ authenticated: json.authenticated }))
	}

	openAuth() {
		chrome.tabs.create({ url: `${url}/auth` });
	}

	handleSubmit(e) {
		e.preventDefault();

		fetch(`${url}/request-circle`, {
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
		.then(async res => {
			if (res.status === 200) {
				this.setState({ message: "Request submitted.", requested: true });
				chrome.storage.local.set({ requested: true }, () => {});
			}
			else {
				this.setState({ message: `Error: ${await res.text()}` });
			}
		});
	}

	render() {
		const ifAuthenticated = (
			<div>
				<p>
					While you don't technically have any rights here in the
					land of the free, after <b>5 Assimilations</b> you may enter a circle's url and key
					here to convert other likeminded individuals.
				</p>

				{(this.state.asmCount >= 5 && !this.state.requested) && (
					<form onSubmit={this.handleSubmit.bind(this)} className={style.form}>
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
						<input type="submit" value="Request" />
					</form>
				)}

				<span className={style.asmCount}>
					You've assimilated {this.state.asmCount} Circles.
				</span>
				<br />
				<span className={style.message}>
					{this.state.message}
				</span>
				{(this.state.asmCount >= 5 && this.state.requested) && (
					<span className={style.message}>
						You have used your submission.
					</span>
				)}
			</div>
		);

		return (
			<main className={style.container}>
				<div className={style.title}>r/CircleofTrust</div>
				<div className={style.content}>
					<p>
						Welcome to our bot net of sneks! You are now a slave to
						the will of the people of Reddit!
					</p>

					{!this.state.authenticated && (
						<a className={style.auth} onClick={this.openAuth}>
							Please click here to login before using the extension.
						</a>
					)}

					{this.state.authenticated && ifAuthenticated}
				</div>
			</main>
		)
	}
}
