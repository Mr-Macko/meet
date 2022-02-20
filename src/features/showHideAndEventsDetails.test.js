import React from "react";
import { shallow } from "enzyme";
import { mockData } from "../mock-data";
import { EventList } from "../EventList";
import { Event } from "../Event";
import { loadFeature, defineFeature } from "jest-cucumber";

const feature = loadFeature("./src/features/showHideAndEventsDetails.feature");

defineFeature(feature, (test) => {
  test("An event element is collapsed by default", ({ given, when, then }) => {
    given("user has not clicked on an event yet", () => {});
    let EventListWrapper;
    when("user is at events overview", () => {
      EventListWrapper = shallow(<EventList events={mockData} />);
      expect(EventListWrapper.find(".EventList")).toHaveLength(1);
    });
    let EventWrapper;
    then("event details are collapsed", () => {
      EventWrapper = shallow(<Event event={mockData[0]} />);
      let eventDetails = EventWrapper.find(".event .extra-details");
      expect(EventWrapper.state("collapsed")).toBe(true);
    });
  });

  test("User can expand an event to see its details", ({ given, when, then }) => {
    let EventWrapper;
    given("the user is interested in an event", () => {
        EventWrapper = shallow(<Event event={mockData[0]} />);
        expect(EventWrapper.state("collapsed")).toBe(true);
      });
    when("the clicks on the event", () => {
      const showDetailsButton = EventWrapper.find(".show-details");
      showDetailsButton.simulate("click");
    });
    then("the event details will be shown", () => {
      expect(EventWrapper.state("collapsed")).toBe(false);
    });
  });

  test("User can collapse an event to hide its details", ({ given, when, then }) => {
    let EventWrapper;
    given("the user as seen the event details", () => {
      EventWrapper = shallow(<Event event={mockData[0]} />);
      EventWrapper.setState({ collapsed: false });
    });
    when("the user clicks on an expand event element", () => {
      const HideDetailsButton = EventWrapper.find(".hide-details");
      HideDetailsButton.simulate("click");
    });
    then("the event details shouldn’t be displayed anymore", () => {
      expect(EventWrapper.state("collapsed")).toBe(true);
    });
  });
});