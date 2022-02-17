import React, { Component } from 'react';
import './App.css';
import { EventList } from './EventList';
import CitySearch from './CitySearch';
import { getEvents, extractLocations } from './api';
import { NumberOfEvents } from './NumberOfEvents';
import './nprogress.css';

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    currentLocation: "all"
  };

  componentDidMount() {
    this.mounted = true;
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({ 
          events: events.slice(0, this.state.numberOfEvents),
          locations: extractLocations(events) 
        });
      }
    });
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  updateEvents = (location, eventCount) => {
    getEvents().then((events) => {
      const locationEvents = (location === "all") 
      ? events
      : events.filter((event) => event.location === location);
      const eventsToShow= locationEvents.slice(0, this.state.numberOfEvents);
      if( this.mounted){
        this.setState({
        events: eventsToShow,
        currentLocation: location
        });
      
      }     
    });
  };

  updateNumberOfEvents = async (e) => {
    const newNumber = e.target.value ? parseInt(e.target.value) : 32;
    await this.setState({ numberOfEvents: newNumber });
    this.updateEvents(this.state.currentLocation, this.state.numberOfEvents);
  };


  render() {
    return (
      <div className="App">
        <CitySearch 
        locations={this.state.locations} 
        updateEvents={this.updateEvents}/>
        <NumberOfEvents 
        numberOfEvents={this.state.numberOfEvents}
        updateNumberOfEvents={this.updateNumberOfEvents}/>
        <EventList events={this.state.events}/>
      </div>
    );
  }
}

export default App;