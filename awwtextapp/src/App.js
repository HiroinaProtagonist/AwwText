import React, { Component } from 'react';
import './App.css';
import MenuBar from './MenuBar';
import ImageRow from './ImageRow';
import MMSRow from './MMSRow';
import Footer from './Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        to: '',
        body: '',
        mediaURL: ''
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MenuBar />
          <ImageRow />
          <MMSRow />
          <Footer />
        </header>
      </div>
    );
  };
}

export default App;
