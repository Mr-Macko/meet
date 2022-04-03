import React, { Component } from "react";

export class Event extends Component {
    
    state = {
        collapsed: true
    };

    handleClick= ()  => {
        this.setState({
            ...this.state,
            collapsed: !this.state.collapsed
        });
    };

    render(){
        const { event} = this.props;
        const { collapsed } = this.state;

        return (
            <div className='event'>
            
            <h2 className='header summary'>{event.summary}</h2>
            <p className="start-date">
                {event.start.dateTime} ({event.start.timeZone})
              </p>
            <p className='location'>@{event.summary} | {event.location}</p>
       
                
        
                {!collapsed && (
                    <div className="details-view">
                    <h2 className="details-header">About event:</h2>
                <a href={event.htmlLink} className='details-link' rel="noreferrer" target='_blank'>See details on Google Calendar</a>
                <p className='description'>{event.description}</p>
               </div>
                )}
                    <button id='details-btn' className={`${collapsed ? "show" : "hide"}-details`}
            onClick={this.handleClick}>{collapsed ? "Show Details" : "Hide-Details"}</button>
            
        </div> 
        )
    }
}

// export default Event;