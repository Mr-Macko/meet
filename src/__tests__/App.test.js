import React from "react";
import { shallow, mount } from 'enzyme';
import App from '../App';
import { EventList } from '../EventList';
import CitySearch from '../CitySearch'
import { mockData } from '../mock-data';
import { extractLocations, getEvents } from '../api';
import { NumberOfEvents } from '../NumberOfEvents';

// unit testing
describe('<App /> component', () => {
    let AppWrapper;
    beforeAll(() => { /* will be executed before any other test*/
      AppWrapper = shallow(<App />);
    });

    test('render list of events', () => {
        expect(AppWrapper.find(EventList)).toHaveLength(1);
      });

    test('render CitySearch', () => {
        expect(AppWrapper.find(CitySearch)).toHaveLength(1);
    })
});

// integration testing
describe('<App /> integration', () => {
    test('App passes "events" state as a prop to EventList', () => {
      const AppWrapper = mount(<App />);
      const AppEventsState = AppWrapper.state('events');
      expect(AppEventsState).not.toEqual(undefined);
      expect(AppWrapper.find(EventList).props().events).toEqual(AppEventsState);
    });

    test('App passes "locations" state as a prop to CitySearch', () => {
      const AppWrapper = mount(<App />);
      const AppLocationsState = AppWrapper.state('locations');
      expect(AppLocationsState).not.toEqual(undefined);
      expect(AppWrapper.find(CitySearch).props().locations).toEqual(AppLocationsState);
      AppWrapper.unmount();
    });

    test('get list of events matching the city selected by the user', async () => {
      const AppWrapper = mount(<App />);
      const CitySearchWrapper = AppWrapper.find(CitySearch);
      const locations = extractLocations(mockData);
      CitySearchWrapper.setState({ suggestions: locations });
      const suggestions = CitySearchWrapper.state('suggestions');
      const selectedIndex = Math.floor(Math.random() * (suggestions.length));
      const selectedCity = suggestions[selectedIndex];
      await CitySearchWrapper.instance().handleItemClicked(selectedCity);
      const allEvents = await getEvents();
      const eventsToShow = allEvents.filter(event => event.location === selectedCity);
      expect(AppWrapper.state('events')).toEqual(eventsToShow);
      AppWrapper.unmount();
    });

    test('get list of all events when user selects "See all cities"', async () => {
      const AppWrapper = mount(<App />);
      const suggestionItems = AppWrapper.find(CitySearch).find('.suggestions li');
      await suggestionItems.at(suggestionItems.length - 1).simulate('click');
      const allEvents = await getEvents();
      expect(AppWrapper.state('events')).toEqual(allEvents);
      AppWrapper.unmount();
    });

    test('App passes "numberOfEvents" as a prop to NumberOfEvents file', () => {
      const AppWrapper = mount(<App />);
      const AppEventNumberState = AppWrapper.state('numberOfEvents');
      expect(AppEventNumberState).not.toEqual(undefined);
      expect(AppWrapper.find(NumberOfEvents).props().numberOfEvents).toEqual(AppEventNumberState);
      AppWrapper.unmount();
    });

    test('"numberOfEvents" state of App is updated with new Number of Events', () => {
      const AppWrapper = mount(<App />);
      const eventObject = { target: { value: 32 } };
      const NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
      NumberOfEventsWrapper.find('.number').simulate('change', eventObject);
      expect(AppWrapper.state('numberOfEvents')).toBe(32);
      AppWrapper.unmount();
    });
})