import React, { Component } from 'react';

export class NumberOfEvents extends Component {

    state = {
        numberOfEvents: '32',
      }
      
    handleInputChange = (event) => {
        this.setState({
            numberOfEvents: event.target.value,
          });

    }

    render() {
        return(
        <div className="NumberOfEvents">
            <span>Number of Events </span>
            <input 
            type="number" 
            className="number"
            value={this.state.numberOfEvents} 
            onChange={this.handleInputChange}/>
        </div>

        )
    }};


// export default NumberOfEvents;