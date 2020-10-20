import React, { Component } from 'react';
import './MMSForm.css'

//Ref: https://www.twilio.com/blog/send-an-sms-react-twilio
class MMSForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          message: {
            to: '',
            body: ''
          },
          submitting: false,
          error: false
        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    render() {
        return (
          <form 
            onSubmit={this.onSubmit} 
            className={this.state.error ? 'error mms-form' : 'mms-form'}
          >
            <div>
              <label htmlFor="to">To:</label>
              <input
                 type="tel"
                 name="to"
                 id="to"
                 value={this.state.message.to}
                 onChange={this.onHandleChange}
              />
            </div>
            <div>
              <label htmlFor="body">Body:</label>
              <textarea name="body" id="body"
              value={this.state.message.body}
              onChange={this.onHandleChange}
            />
            </div>
            <button type="submit" disabled={this.state.submitting}>
              Send message
            </button>
          </form>
        );
    }

    onHandleChange(event) {
        const name = event.target.getAttribute('name');
        this.setState({
          message: { ...this.state.message, [name]: event.target.value }
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({ submitting: true });
        
        //Get Reddit data first
        fetch('')

        //Send message data
        fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.message)
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.setState({
                error: false,
                submitting: false,
                message: {
                  to: '',
                  body: ''
                }
              });
            } else {
              this.setState({
                error: true,
                submitting: false
              });
            }
          });
      }

}

export default MMSForm;