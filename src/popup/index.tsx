import React from 'react'
import { render } from 'react-dom'

import { App } from 'popup/components/app'

import 'styles/global.scss'

const renderRoot = (mountElement: HTMLElement) => {
	render(<App />, mountElement)
}

renderRoot(document.getElementById('mount')!)
