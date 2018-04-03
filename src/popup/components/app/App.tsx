import React from 'react'

import style from './App.scss'

export class App extends React.Component<{}, {}> {
	state = {
		circlesJoined: 0,
		url: '',
		key: ''
	}

	handleSubmit(e) {
		e.preventDefault
		console.log('fetching')
		fetch('https://api.sneknet.com/request-circle', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				url: this.state.url,
				key: this.state.key
			})
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
							You've assimilated {this.state.circlesJoined}{' '}
							Circles
						</span>
						<input type="submit" value="Request" />
					</form>
				</div>
			</main>
		)
	}
}
