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
            relX: 0,
            relY: 0,
            x: props.x,
            y: props.y
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.gridX = props.gridX || 1;
        this.gridY = props.gridY || 1;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
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
    
    static propTypes = {
        onMove: PropTypes.func,
        onStop: PropTypes.func,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        gridX: PropTypes.number,
        gridY: PropTypes.number
    }; 

    onStart(e) {
        const ref = ReactDOM.findDOMNode(this.handle);
        const body = document.body;
        const box = ref.getBoundingClientRect();
        this.setState({
            relX: e.pageX - (box.left + body.scrollLeft - body.clientLeft),
            relY: e.pageY - (box.top + body.scrollTop - body.clientTop)
        });
    }

    onMove(e) {
        const x = Math.trunc((e.pageX - this.state.relX) / this.gridX) * this.gridX;
        const y = Math.trunc((e.pageY - this.state.relY) / this.gridY) * this.gridY;
        if (x !== this.state.x || y !== this.state.y) {
            this.setState({
                x,
                y
            });
            this.props.onMove && this.props.onMove(this.state.x, this.state.y);
        }        
    }

    onMouseDown(e) {
        if (e.button !== 0) return;
        this.onStart(e);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
    }

    onMouseUp(e) {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        this.props.onStop && this.props.onStop(this.state.x, this.state.y);
        e.preventDefault();
    }

    onMouseMove(e) {
        this.onMove(e);
        e.preventDefault();
    }

    onTouchStart(e) {
        this.onStart(e.touches[0]);
        document.addEventListener('touchmove', this.onTouchMove, {passive: false});
        document.addEventListener('touchend', this.onTouchEnd, {passive: false});
        e.preventDefault();
    }

    onTouchMove(e) {
        this.onMove(e.touches[0]);
        e.preventDefault();
    }

    onTouchEnd(e) {
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
        this.props.onStop && this.props.onStop(this.state.x, this.state.y);
        e.preventDefault();
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
                    /> 
                    <input 
                        type="text"
                        name="bottomText"
                        placeholder="Bottom Text"
                        value={this.state.bottomText}
                        onChange={this.handleChange}
                    /> 
                    <button>Gen</button>
                </form>
                
                <div className="meme">
                    <img src={this.state.randomImg} alt="" />
                    <h2 className="top"
                        onMouseDown={this.onMouseDown}
                        onTouchStart={this.onTouchStart}
                        style={{
                            position: 'absolute',
                            left: this.state.x,
                            top: this.state.y,
                            touchAction: 'none'
                        }}
                        ref={(div) => { this.handle = div; }}
                    >
                        {this.state.topText}
                    </h2>
                    <h2 className="bottom" 
                        onMouseDown={this.onMouseDown}
                        onTouchStart={this.onTouchStart}
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