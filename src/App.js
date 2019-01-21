import React, { Component } from 'react'
import './App.css'

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

  componentDidMount() {
    let w = document.getElementById('fit').offsetWidth
    this.setState({w})
  }
  render() {
    return (
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
        const aColor = () => {
          let rgb = []
          while (rgb.length < 3) {
            rgb.push(Math.round(Math.random()*255))
          }
          return `rgb(${rgb.join(', ')})`
        }

        let slides = []
        // pushes n divs (slide) into array (slides)
        for (let i=0 ; i < 100 ; i++) {
          slides.push(
            <div key={i}
              style={{
              backgroundColor: aColor(),
              gridColumnEnd: 'span 1',
              placeSelf: 'stretch',
            }} />
          )
        }
        return slides
      })(),
    }
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

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      w: window.innerWidth,
      h: window.innerHeight,
    }
  }



  onResize = e => {
    let w = window.innerWidth, h = window.innerHeight
    this.setState({w, h})
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
      <div style={styles.container}>
        <InfoCard />
        <div style={{...styles.container, ...styles.slideContainer}}>
          <Slides />
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
  },
}
