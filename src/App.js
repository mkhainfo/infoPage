import React, { Component } from 'react'
import './App.css'
import {gallery} from './gallery.js'

const importAll = r => {
  return r.keys().forEach(r)
}

importAll(require.context('./gallery', true, /\.(jpe?g|gif)$/))

console.log(gallery)

const aColor = () => {
  //generates random colors in rgb(n, n, n) notation
  //for dev purposes
  let rgb = []
  while (rgb.length < 3) {
    rgb.push(Math.round(Math.random()*255))
  }
  return `rgb(${rgb.join(', ')})`
}

class InfoCard extends Component {

  closeModal = e => {
    this.props.toggleModal(false)
  }

  render() {
    return (
      this.props.displayModal ?
      <figcaption style={styles.card}>
        <h1 style={styles.title} >
          <button
            aria-label='return to gallery'
            style={styles.button}
            onClick={this.closeModal}>
            back
          </button>
          this color is
        </h1>
        <h2><span id="fit">
          {this.props.content}
        </span></h2>
      </figcaption> :
      <header role='banner' style={styles.card}>
        <h1>infoPage</h1>
        <h2><span id="fit">
          a graphic field of info
        </span></h2>
    </header>
    )
  }
}

class Slides extends Component {
  constructor(props){
    super(props)
    this.state = {
      content: '',
      slides: (() => {
        // pushes n '.slide' divs into 'slides' array
        let slides = [], n = gallery.length
        for (let i=0 ; i < n ; i++) {
          let description = `${gallery[i].title} ${gallery[i].subtitle}`
          let source = gallery[i].id
          //let sss = './gallery/thumb/Tchain01.jpg'
          slides.push(
            <button
              aria-label={description}
              id={i}
              key={i}
              className={'slide'}
              onClick={this.displayModal}
              style={{
              backgroundColor: aColor(),
              gridColumnEnd: 'span 1',
              placeSelf: 'stretch',
              zIndex: 1,
              border: 'none',
            }}>
            <img
              alt={description}
              style={styles.image}
              src={require('./gallery/thumb/T' + source + '.jpg')}/>
          </button>
          )
        }
        return slides
      })(),
    }
  }
//C:\Users\n.n\Desktop\1901\info\src\gallery\thumb\Tcabin01.jpg
// {`.\gallery\thumb\T${gallery[i].id}.jpg`}
  displayModal = e => {
    this.props.getContent(e.target.id)
    this.props.toggleModal(true)
    //console.log(e.target.id)
  }

  columnStyles = () => {
    const n = Math.floor(window.innerWidth / 300)

    let total = n % 2 === 0 ? n : n - 1 > 0 ? n - 1 : n,
      gutter = window.innerWidth / (total * 10),
      margin = gutter * 2 + 100,
      width = (window.innerWidth - (gutter * (total - 1)) - margin) / total

    return {
      gridTemplateColumns: `repeat(${total}, ${width}px)`,
      gridAutoRows: `${width}px`,
      gridGap: `${gutter}px`,
      marginTop: gutter,
      marginBottom: margin,
    }
  }

  componentDidMount() {
  }

  render() {
    return(
      <main role='main' style={{...styles.slides, ...this.columnStyles()}}>
        {this.state.slides}
      </main>
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

  adjustTop = () => {
    let modalTop = document.scrollingElement.scrollTop,
      modal = document.querySelector('#modal')
    if ( modal && modal.style.top !== `${modalTop}px`) {
      this.setState({modalTop})
      modal.style.top = `${modalTop}px`
    }
  }

  image = () => {
    let source = gallery[this.props.content].id
    let style = () => {
      return ({
        height: '100%',
        width: 'auto',
      })
    }
    return (
      <img
      src={require('./gallery/full/F' + source + '.jpg' )}
      alt='this will be a full sized version'
      style={{style}}/>
    )
  }

  insertContent = () => {
    let content = document.querySelector('#content')
    if (content) {
      let source = gallery[this.props.content]
      console.log(source.id)
      return source.id
    }
  }
  contentType = () => {
    let content = document.querySelector('#content')
    if (content) {
      let source = gallery[this.props.content]
      console.log(source.type)
      return source.type
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate() {
    //this.insertContent()
    this.adjustTop()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render(){
    //let source = this.insertContent(), type = this.contentType()
    //console.log([source,type])
    //let type = gallery[this.props.content].type
    //src={require('./gallery/full/F' + source + '.' + type )}
    return (
      this.props.displayModal ?
        <figure id='modal' className='fade' style={{...styles.flexContainer, ...styles.modal}}>
          <div id='content' style={styles.modalContent}>
            {this.image()}
          </div>
        </figure> : null
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
      modalContent: '',
    }
  }

  onResize = e => {
    let w = window.innerWidth, h = window.innerHeight
    this.setState({w, h})
  }

  toggleModal = displayModal => {
    this.setState({displayModal})
  }

  getContent = modalContent => {
    this.setState({modalContent})
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  render() {
    return (
      <div id='scroll' style={styles.container}>

        <InfoCard content={this.state.modalContent}
          displayModal={this.state.displayModal}
          toggleModal={this.toggleModal}
          />

        <div style={{...styles.container, ...styles.flexContainer}}>

          <Modal content={this.state.modalContent}
            displayModal={this.state.displayModal}
            toggleModal={this.toggleModal} />

          <Slides getContent={this.getContent}
            toggleModal={this.toggleModal} />

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

  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
  },

  card: {
    zIndex: 5,
    position: 'sticky',
    top: '5vh',
    margin: 0,
    padding: '2vw 5vw 2vw 2vw', // top right bottom left
    backgroundColor: 'white',
    minWidth: '300px',
    maxWidth: '33vw'
  },

  title: {
    display: 'flex',
    alignItems: 'center',
  },

  button: {
    marginRight: '1.5vw',
    padding: '0.2vw',
    fontWeight: 'bold',
    borderRadius: '20%',
    backgroundColor: 'white',
  },

  slides: {
    display: 'inline-grid',
    gridAutoFlow: 'row',
    zIndex: 0,
  },

  modal: {
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '98vw',
    height: '100vh',
    position: 'absolute',
    alignItems: 'center',
    boxShadow: '0 0 50vh 50vh rgba(255, 255, 255, 0.5)',
  },

  modalContent: {
    backgroundColor: 'blue',
    width: '90vw',
    height: '90vh',
  },

  image: {
    height: '100%',
    width: '100%'
  },
}
