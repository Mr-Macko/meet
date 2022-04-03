import React, { Component } from 'react';
import './App.css';
import { EventList } from './EventList';
import CitySearch from './CitySearch';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import { NumberOfEvents } from './NumberOfEvents';
import './nprogress.css';
import WelcomeScreen from './WelcomeScreen';
import { InfoAlert } from './Alert';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EventGenre from './EventGenre';

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    currentLocation: 'all',
    showWelcomeScreen: undefined
  };

  async componentDidMount() {
    this.mounted = true;
    if (navigator.onLine && !window.location.href.startsWith('http://localhost')) {
      const accessToken = localStorage.getItem('access_token');
      const isTokenValid = (await checkToken(accessToken)).error ? false : true;
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      this.setState({ showWelcomeScreen: !(code || isTokenValid) });
      if ((code || isTokenValid) && this.mounted) {
        getEvents().then((events) => {
          if (this.mounted) {
            this.setState({
              events: events.slice(0, this.state.numberOfEvents),
              locations: extractLocations(events),
            });
          }
        });
      }
    } 
    
    else {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({ events, locations: extractLocations(events) })
        }
      });
    }

  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location, eventCount = this.state.numberOfEvents) => {
    getEvents().then((events) => {
      const locationEvents = (location === 'all')
        ? events
        : events.filter((event) => event.location === location);
      if (this.mounted) {
        this.setState({
          events: locationEvents.slice(0, eventCount),
          location: location,
          currentLocation: location
        });
      }
    });
  };

  updateNumberOfEvents = async (e) => {
    const newNumber = e.target.value ? parseInt(e.target.value) : 50;
    if (newNumber <= 0 || newNumber > 50) {
      await this.setState({
        numberOfEvents: newNumber,
        errorAlert: 'Please set a number between 1 and 50'
      });
    } else {
      await this.setState({
        errorAlert: '',
        numberOfEvents: newNumber
      });
      this.updateEvents(this.state.currentLocation, this.state.numberOfEvents);
    }
  };

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length
      const city = location.split(', ').shift()
      return { city, number };
    })
    return data;
  };

  render() {
    if (this.state.showWelcomeScreen === undefined &&
      navigator.onLine && !window.location.href.startsWith('http://localhost')
    ) {
      return <div className='App' />;
    }
    if (this.state.showWelcomeScreen === true)
      return (
        <WelcomeScreen
          showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => {
            getAccessToken();
          }}
        />
      );

    return (
      <div className="App">
        {/* <pre>{JSON.stringify(this.state, null, 2)}</pre> */}
          <div>
            <h1>Meet App</h1>
            <p>Choose your city</p>
            <CitySearch
              locations={this.state.locations}
              updateEvents={this.updateEvents} />
            <NumberOfEvents 
            numberOfEvents={this.state.numberOfEvents}
            updateNumberOfEvents={this.updateNumberOfEvents} />
            {!navigator.onLine ? (<InfoAlert text='You are offline.' />) : (<InfoAlert text=' ' />)}
            <div className="data-vis-wrapper">
              <EventGenre events={this.state.events} />
              <ResponsiveContainer height={400} >
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="category" dataKey="city" name="city" />
                  <YAxis
                    allowDecimals={false}
                    type="number"
                    dataKey="number"
                    name="number of events"
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={this.getData()} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <EventList events={this.state.events} />
          </div>
          <WelcomeScreen
            showWelcomeScreen={this.state.showWelcomeScreen}
            getAccessToken={() => { getAccessToken() }} />
      </div>
    );
  }
}

export default App;