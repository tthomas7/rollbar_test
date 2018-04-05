/* global $ */ // Need global jquery because of authenticity token
/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

import * as React from 'react'
import * as PropTypes from 'prop-types'

import { div, button, form, textarea } from 'react-dom-factories'

class Hello extends React.Component<IHelloProps> {
  constructor(props: IHelloProps) {
    super(props)
  }

  printAndThrow(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault()
    console.log("Throwing an error now!")
    throw new Error("Hello there!")
  }

  render() {
    return div(
      { className: 'Hello' },
      button({
        className: 'btn btn-warning',
        onClick: this.printAndThrow.bind(this)
      },
      'Throw Error',
      )
    )
  }
}

interface IHelloProps {
}

export default Hello

