
import React, { Component } from 'react'
import posed from 'react-pose';
import './App.css'
import {gallery} from './gallery.js'
// gallery is an array of objects
// each object provides the context for one slide
// for every object in gallery, one slide will be generated

/////
const importAll = r => {
  return r.keys().forEach(r)
}
// this imports all image files associated with the objects in gallery
// necessary for dynamic rendering with webpack
importAll(require.context('./gallery', true, /\.(jpe?g|gif)$/))
/////

///// reorders the gallery array
const useGallery = (() => {
  return gallery.reverse()
})()
/////

///// contact card, displayed with gallery
class Contacts extends Component {

  state = {
    name: 'Marina Khakhayeva', //will render
    email: 'contact@mkha.info', //will render
    copy: false, // for <Copy />
    link1: {
      name: 'GitHub',
      url: 'https://github.com/mkhainfo'
    }, //will render
    link2: {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mkhakhayeva/'
    } //will render
  }

  copy = e => {
    let text = e.target.innerHTML,
        toggle = () => this.setState({copy: !this.state.copy}),
        copy = str => {
          let body = document.querySelector('body'),
              input = document.createElement('input')
          body.append(input)
          input.value = str
          //input.focus()
          input.select()
          document.execCommand("copy")
          input.remove()
        }
    copy(text)
    toggle()
    setTimeout(toggle, 700)
  }

  render() {
    return (
      <div>
        <h1 style={{marginTop: '20px'}}>
          { this.state.name }
        </h1>
        <div style={styles.title}>
          <h2 className='copy'
            onClick={this.copy}>
            {this.state.email}
          </h2><Copy copy={this.state.copy} />
          <h3>
            <a role='button' href={this.state.link1.url}>
              [{this.state.link1.name}] &nbsp;
            </a>
            <a role='button' href={this.state.link2.url}>
              [{this.state.link2.name}] &nbsp;
            </a>
          </h3>
        </div>
      </div>
    )
  }
}
/////

///// animation for <Copy />
const Box = posed.div({
  hidden: {opacity: 0},
  visible: {opacity: 0.8}
})
// copy is a notification div that pops up when text is copied on click
const Copy = props => {
  return (
    <Box pose={ props.copy ? 'visible' : 'hidden' }
      style={styles.copy}>
      copy
    </Box>
  )
}
/////

///// nav buttons for <InfoCard />
const Close = props => ((
  <button
    style={styles.altButton}
    onClick={props.click}
    aria-label='return to gallery'>
    close
  </button>
))

const Prev = props => ((
  <button
    style={styles.button}
    onClick={props.click}
    aria-label='previous entry'>
    prev
  </button>
))

const Next = props => ((
  <button
    style={styles.button}
    onClick={props.click}
    aria-label='next entry'>
    next
  </button>
))
/////

///// contains contact info untl modal is visible
// when modal is visible, displays modal info
class InfoCard extends Component {

  closeModal = e => {
    this.props.toggleModal(false)
  }

  prev = e => {
    let content = parseInt(this.props.content)
    if (content > 0) {
      content -= 1
    } else {
      content = useGallery.length - 1
    }
    this.props.getConent(content)
  }

  next = e => {
    let content = parseInt(this.props.content)
    if (content < useGallery.length - 1) {
      content += 1
    } else {
      content = 0
    }
    this.props.getConent(content)
  }

  link = () => {
    return (
      <h3>
        <a href={useGallery[this.props.content].url}>
          [ play here ]
        </a>
      </h3>
    )
  }

  render() {
    return (
      this.props.displayModal ?

      //modal info
      <section title={useGallery[this.props.content].title}
        style={styles.card}>
        <nav role='navigation'
          style={styles.title} >
          <Close click={this.closeModal}/>
          <Prev click={this.prev} />
          <Next click={this.next} />
        </nav>
        <h1>
          { useGallery[this.props.content].title }&nbsp;
          [{ useGallery[this.props.content].year }]
        </h1>
        <h2>{ useGallery[this.props.content].subtitle }</h2>
        <p style={{marginBottom:0}}>
          { useGallery[this.props.content].description }
        </p>
        { useGallery[this.props.content].url? this.link() : null }
      </section> :

      //contact info
      <header role='banner' style={styles.card}>
        <Contacts />
      </header>
    )
  }
}
/////

///// image gallery
class Slides extends Component {
  constructor(props){
    super(props)
    this.state = {
      content: '',
      slides: (() => {
        // pushes a slide into the slides array for each entry in gallery.js
        let slides = []
        for (let i=0 ; i < useGallery.length ; i++) {
          let description = `${useGallery[i].title} ${useGallery[i].subtitle}`
          let source = useGallery[i].id
          slides.push(
            <button
              aria-label={ description }
              id={i}
              key={i}
              onClick={ this.displayModal }
              style={{
              backgroundColor: 'white',
              gridColumnEnd: 'span 1',
              placeSelf: 'stretch',
              zIndex: 1,
              border: 'none',
            }}>
            <img
              alt={description}
              style={ styles.thumbnail }
              src={ require('./gallery/thumb/T' + source + '.jpg') }/>
          </button>
          )
        }
        return slides
      })(),
    }
  }

  displayModal = e => {
    this.props.getContent(e.target.id)
    this.props.toggleModal(true)
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

  render() {
    return(
      <main role='main' style={{...styles.slides, ...this.columnStyles()}}>
        {this.state.slides}
      </main>
    )
  }
}
/////

/////
class Modal extends Component {
  constructor(props){
    super(props)
    this.state = {
      modalTop: 0,
    }
  }

  handleScroll = e => {
    let content = document.querySelector('#content')

    if (this.props.displayModal && content) {
      let contentHeight = content.clientHeight,
          viewTop = window.scrollY,
          {modalTop} = this.state,
          margin = window.innerHeight * 0.66
      if (viewTop < modalTop - margin
      || viewTop > modalTop + margin + contentHeight) {
        this.props.toggleModal(false)
      }
    }
  }

  adjustTop = () => {
    const nearestTenth = n => {
      return Math.round(n/10) * 10
    }
    let modalTop = nearestTenth(document.scrollingElement.scrollTop),
      modal = document.querySelector('#modal')

    if ( modal && modal.style.top !== `${modalTop}px`) {
      this.setState({modalTop})
      modal.style.top = `${modalTop}px`
    }
  }

  // next feature: run react app in modal
  app = () => {
    return (
      <div style={{
        backgroundColor: 'lime',
        height: '100px',
        width: '100px'}}>
      </div>
    )
  }

  image = () => {
    let source = useGallery[this.props.content].id,
        type = useGallery[this.props.content].type

    return (
      <img
      src={require('./gallery/full/F' + source + '.' + type )}
      alt='this will be a full sized version'
      style={styles.modalImage}/>
    )
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate() {
    this.adjustTop()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render(){
    return (
      this.props.displayModal ?
        <section id='modal'
          title={useGallery[this.props.content].title}

          style={{...styles.modal}}>
          <div id='content'
            style={styles.modalContent}>
            {useGallery[this.props.content].type === 'js' ?
              // next feature: run react app in modal
              this.app() : this.image()}
          </div>
        </section> : null
    )
  }
}
/////

/////
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      w: window.innerWidth,
      h: window.innerHeight,
      displayModal: false,
      modalContent: null
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
          getConent={this.getContent}
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
/////

/////
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
    marginBottom: '15px',
    padding: '2vw 5vw 2vw 2vw', // top right bottom left
    backgroundColor: 'white',
    minWidth: '300px',
    maxWidth: '33vw'
  },

  title: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    lineHeight: 0.25
  },

  copy: {
    display:'inline',
    backgroundColor:'#4db34d',
    padding: '10px 5px',
    margin: '0 10px',
    color: 'white',
    borderRadius: '20%',
  },

  button: {
    marginLeft: '1.5vw',
    padding: '0.2vw',
    fontWeight: 'bold',
    borderRadius: '20%',
    backgroundColor: 'white',
  },

  altButton: {
    marginRight: '1.5vw',
    padding: '0.2vw 0.5vw 0.2vw 0.5vw',
    fontWeight: 'bold',
    borderRadius: '20%',
    backgroundColor: 'black',
    color: 'white'
  },

  slides: {
    display: 'inline-grid',
    gridAutoFlow: 'row',
    zIndex: 0,
  },

  thumbnail: {
    height: '100%',
    width: '100%',
    pointerEvents: 'none'
  },

  modal: {
    zIndex: 3,
    backgroundColor: 'cyan',
    width: '98vw',
    position: 'absolute',
    display: 'flex',
    marginTop: '30vh',
  },

  modalContent: {
    flex: '0 1 auto',
    display: 'flex',
    position: 'absolute',
    minWidth: '90vw',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 0 50vh 50vh rgba(255, 255, 255, 0.5)',
    pointerEvents: 'none'

  },

  modalImage: {
    flex: '0 1 auto',
    display: 'block',
    maxWidth: '100%',
    pointerEvents: 'auto'
  }

}
