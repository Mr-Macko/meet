import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { NumberOfEvents } from '../NumberOfEvents';
import App from '../App';


const feature = loadFeature("./src/features/specifyNumberOfEvents.feature");

defineFeature(feature, (test) => {
  test("When user hasn’t specified a number, 32 is the default number", ({given, when, then }) => {
    given("the user has not chosen the amount of events to see on the overview", () => {});
    let NumberOfEventsWrapper;
    when( "the user opens the overview",
      () => { NumberOfEventsWrapper = shallow(<NumberOfEvents />); });
    then("the user will see 32 events by default", () => {
      NumberOfEventsWrapper.setState({ numberOfEvents: 32 });
    });
  });

  test("user can change the number of events they want to see", ({given, when, then }) => {
    let AppWrapper;
    given("the use want to change the amount of event on the page", () => { AppWrapper = mount(<App />); });
    when("the user sets a number of events", () => {
      const eventNumberInput = { target: { value: 6 } };
      AppWrapper.find(".NumberOfEvents").simulate(
        "change",
        eventNumberInput
      ); });
    then("the users sees the amount of events displayed", () => {
      const NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
      NumberOfEventsWrapper.setState({ numberOfEvents: 6 });
      expect(NumberOfEventsWrapper.state("numberOfEvents")).toBe(6);
    });
  });

});