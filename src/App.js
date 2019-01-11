import React, { Component } from 'react'
import './App.css'

const TitleCard = props => {
  return (
    <div>
      <h1>mkha.info</h1>
      <h2><a href="mailto:contact@mkha.info">contact@mkha.info</a></h2>
    </div>
  )
}

const Gallery = props => {return(<div />)}

export default class App extends Component {
  render() {
    return (
      <div id="container">
        <TitleCard />
        <Gallery />
      </div>
    )
  }
}
