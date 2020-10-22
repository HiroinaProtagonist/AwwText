import React, { Component } from 'react';
import './MenuBar.css'

class MenuBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
          submitting: false,
          error: false
        };
        //this.onHandleChange = this.onHandleChange.bind(this);
        //this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        return (
        <div className="container">
            <span className="aboutSpan">
                <a className="App-link" id="about" href="">About</a>
            </span>
            <span className="centerSpan">

            </span>
            <span>
            <a className="App-link" id="ack" href="">Acknowledgements</a>
            </span>
        </div>
        );
    }
}

export default MenuBar;