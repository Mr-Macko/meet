import React, { Component } from 'react';
import './App.css';
import { EventList } from './EventList';
import CitySearch from './CitySearch';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import { NumberOfEvents } from './NumberOfEvents';
import './nprogress.css';
import WelcomeScreen from './WelcomeScreen';
import { InfoAlert } from './Alert';

class App extends Component {
  state = {
    events: [],
    locations: [],
    showWelcomeScreen: undefined,
    numberOfEvents: 32,
    currentLocation: "all",
    isOnline: true
  };

  async componentDidMount() { 
    this.mounted = true; 
    const accessToken = localStorage.getItem('access_token'); 
    const isTokenValid = (await checkToken(accessToken)).error ? false : true; 
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code"); 
    this.setState({ showWelcomeScreen: !(code || isTokenValid) }); 
    if ((code || isTokenValid) && this.mounted) { 
      getEvents().then((events) => { 
        if (this.mounted) { 
          this.setState({ events, locations: extractLocations(events) }); 
        } 
      }); 
    } if (!navigator.onLine) {
      this.setState({
        isOnline: false,
      });
    }
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  updateEvents = (location, eventCount = this.state.numberOfEvents) => {
    this.setState({ isOnline: navigator.onLine ? true: false });
    this.mounted = true;
    getEvents().then((events) => {
      const locationEvents =
        location === "all" ? events : events.filter((event) => event.location === location);
      const eventNumberFilter =
        eventCount > locationEvents.length ? locationEvents : locationEvents.slice(0, eventCount);
      if (this.mounted) {
        this.setState({
          events: eventNumberFilter,
        });
      }
    });
  };

  updateEventNumbers = (eventNumbers) => {
    this.setState({
      numberOfEvents: eventNumbers,
    });
    this.updateEvents(this.state.location, eventNumbers);
  };


  render() {
    if (this.state.showWelcomeScreen === undefined) 
      return <div className="App" />

    return (
      <div className="App">
        <CitySearch 
          locations={this.state.locations} 
          updateEvents={this.updateEvents} />
        <NumberOfEvents updateEventNumbers={this.updateEventNumbers} />
        { !navigator.onLine ? (<InfoAlert text='You are offline.' />) : (<InfoAlert text=' ' />)}
        <EventList events={this.state.events} />
        <WelcomeScreen 
          showWelcomeScreen={this.state.showWelcomeScreen} 
          getAccessToken={() => { getAccessToken() }} />
      </div>
    );
  }
}

export default App;