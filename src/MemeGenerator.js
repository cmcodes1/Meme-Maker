import React, {Component} from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

class MemeGenerator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topText: "",
            bottomText: "",
            randomImg: "https:\/\/i.imgflip.com\/3i7p.jpg",
            allMemeImgs: [],
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    componentDidMount() {
        fetch("https://api.imgflip.com/get_memes")
            .then(response => response.json())
            .then(response => {
                const {memes} = response.data
                this.setState({ allMemeImgs: memes })
            })
    }
    
    handleChange(event) {
        const {name, value} = event.target
        this.setState({ [name]: value })
    }
    
    handleSubmit(event) {
        event.preventDefault()
        const randNum = Math.floor(Math.random() * this.state.allMemeImgs.length)
        const randMemeImg = this.state.allMemeImgs[randNum].url
        this.setState({ randomImg: randMemeImg })
    }
  
    render() {    
        return (
            <div>
                <form className="meme-form" onSubmit={this.handleSubmit}>
                    <input 
                        type="text"
                        name="topText"
                        placeholder="Top Text"
                        value={this.state.topText}
                        onChange={this.handleChange}
                    /> <br/><br/>
                    <input 
                        type="text"
                        name="bottomText"
                        placeholder="Bottom Text"
                        value={this.state.bottomText}
                        onChange={this.handleChange}
                    /> <br/><br/>
                    <button>CHANGE MEME</button>
                </form>

                <div className="meme">
                    <img src={this.state.randomImg} alt="" />
                    <h2 className="top"
                        style={{
                            position: 'absolute',
                            left: this.state.x,
                            top: this.state.y,
                        }}
                        ref={(div) => { this.handle = div; }}
                    >
                        {this.state.topText}
                    </h2>
                    <h2 className="bottom" 
                        style={{
                            position: 'absolute',
                            left: this.state.x,
                            top: this.state.y,
                            touchAction: 'none'
                        }}
                        ref={(div) => { this.handle = div; }}
                    >
                        {this.state.bottomText}
                    </h2>
                </div>
            </div>
        )
    }
}

export default MemeGenerator