import React, { Component } from 'react';
import { ErrorAlert } from './Alert';

export class NumberOfEvents extends Component {
    constructor() {
        super();
        // stting the values for the default states
        this.state = {
          numberOfEvents: 32,
          infoText: "",
        };
      }
      
      updateNumberOfEvents = (event) => {
        this.setState({
          numberOfEvents: event.target.value,
          infoText: "",
        });
        if (event.target.value > 0 && event.target.value < 33) {
          this.props.updateEventNumbers(event.target.value);
        } else {
          this.setState({ infoText: "Select a number between 1 and 32." });
        }
      };

    render() {
        return(
        <div className="NumberOfEvents">
        <ErrorAlert text={this.state.infoText} />
            <span>Number of Events </span>
            <input 
            type="number" 
            className="number"
            value={this.state.numberOfEvents} 
            onChange={this.updateNumberOfEvents}
            />
        </div>

        )
    }};


// export default NumberOfEvents;