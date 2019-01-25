import React, { Component } from 'react'
import './App.css'

//generates random colors in rgb(n, n, n) notation
const aColor = () => {
  let rgb = []
  while (rgb.length < 3) {
    rgb.push(Math.round(Math.random()*255))
  }
  return `rgb(${rgb.join(', ')})`
}

class InfoCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      w: 0,
    }
  }

  cardStyles = () => {
    return {
      width: `${this.state.w}px`
    }
  }

  closeModal = e => {
    this.props.toggleModal(false)
    console.log('close')
  }

  componentDidMount() {
    let w = document.getElementById('fit').offsetWidth
    this.setState({w})
  }

  render() {
    return (
      this.props.displayModal ?
      <div style={{...styles.card, ...this.cardStyles()}}>
        <h1>title <button onClick={this.closeModal}>(close)</button> </h1>
        <h2><span id="fit"><a href="mailto:contact@mkha.info">contact@mkha.info</a>
        </span></h2>
      </div>
      :
      <div style={{...styles.card, ...this.cardStyles()}}>
        <h1>mkha.info</h1>
        <h2><span id="fit"><a href="mailto:contact@mkha.info">contact@mkha.info</a>
        </span></h2>
      </div>
    )
  }
}

class Slides extends Component {
  constructor(props){
    super(props)
    this.state = {
      slides: (() => {
        //contains a fixed number of slides


        let slides = []
        // pushes n divs (slide) into array (slides)
        for (let i=0 ; i < 100 ; i++) {
          slides.push(
            <button key={i}
              className={'slide'}
              onClick={this.displayModal}
              style={{
              backgroundColor: aColor(),
              gridColumnEnd: 'span 1',
              placeSelf: 'stretch',
              zIndex: 1,
            }}/>
          )
        }
        return slides
      })(),
    }
  }

  displayModal = e => {
    this.props.toggleModal(true)
    return console.log(e.target)
  }

  columnStyles = () => {
    const n = Math.floor(window.innerWidth / 300)
    let total = n % 2 === 0 ? n : n - 1 > 0 ? n - 1 : n,
      gutter = window.innerWidth / (total * 10),
      margin = gutter * 2 + 100,
      width = (window.innerWidth - (gutter * (total - 1)) - margin) / total
      //width = (window.innerWidth - 100) / total
    return {
      gridTemplateColumns: `repeat(${total}, ${width}px)`,
      gridAutoRows: `${width}px`,
      gridGap: `${gutter}px`,
      marginTop: gutter,
      marginBottom: margin,
    }
  }

  render() {
    return(
      <div style={{...styles.slides, ...this.columnStyles()}}>
        {this.state.slides}
      </div>
    )
  }
}

class Modal extends Component {
  constructor(props){
    super(props)
    this.state = {
      modalTop: 0,
    }
  }

  handleScroll = e => {
    let test = Math.abs(this.state.modalTop - e.pageY)

    if ( test  > window.innerHeight * 0.66
    && this.props.displayModal ) {
      let modal = document.querySelector('#modal')
      this.props.toggleModal(false)
      console.log(modal.style.height)
    }

  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate() {
    let modalTop = document.scrollingElement.scrollTop
      + window.innerHeight * 0.025, modal = document.querySelector('#modal')
    if (modal && this.state.modalTop !== modalTop) {
      modal.style.top = `${modalTop}px`
      this.setState({modalTop})
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render(){
    return (
      this.props.displayModal ?
        <div id='modal' style={styles.modal}/> :
        null
    )
  }
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      w: window.innerWidth,
      h: window.innerHeight,
      displayModal: false,
    }
  }

  onResize = e => {
    let w = window.innerWidth, h = window.innerHeight
    this.setState({w, h})
  }

  toggleModal = displayModal => {
    this.setState({displayModal})
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }
  // {gridTemplateColumns: this.nCol()}
  render() {

    return (
      <div id='scroll' style={styles.container}>
        <InfoCard displayModal={this.state.displayModal}
          toggleModal={this.toggleModal}
          />
        <div style={{...styles.container, ...styles.slideContainer}}>
          <Modal displayModal={this.state.displayModal}
            toggleModal={this.toggleModal} />
          <Slides toggleModal={this.toggleModal} />
        </div>
      </div>
    )
  }
}

const styles = {

  container: {
    width: '90vw',
  	height: 'auto',
    margin: 'auto',
    backgroundColor: 'white',

  },

  slideContainer: {
    display: 'flex',
    justifyContent: 'center',
  },

  card: {
    zIndex: 5,
    //position: '-webkit-sticky',
    position: 'sticky',
    top: '20px',
    margin: 0,
    padding: '2vw 5vw 2vw 2vw', // top right bottom left
    backgroundColor: 'white',
  },

  slides: {
    //backgroundColor: 'cyan',
    display: 'inline-grid',
    gridAutoFlow: 'row',
    zIndex: 0,

  },

  modal: {
    zIndex: 3,
    backgroundColor: 'chartreuse',
    width: '93vw',
    height: '95vh',
    position: 'absolute',
    top: '2.5vh',
    opacity: 0.7,

  },
}
