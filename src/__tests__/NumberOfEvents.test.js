import React from 'react';
import { shallow } from 'enzyme';
import { NumberOfEvents } from '../NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
    let NumberOfEventsWrapper;

    beforeAll(() => {
        NumberOfEventsWrapper = shallow(<NumberOfEvents/>);
    });

    test('render text input', () => {
        expect(NumberOfEventsWrapper.find('.number')).toHaveLength(1);
    });

    test('render text input correctly', () => {
        const numberOfEvents = NumberOfEventsWrapper.state('numberOfEvents');
        expect(NumberOfEventsWrapper.find('.number').prop('value')).toBe(numberOfEvents);
      });

    test('change state when number input changes', () => {
        NumberOfEventsWrapper.setState({numberOfEvents: '32'});
        NumberOfEventsWrapper.find('.number').simulate('change', {target: {value: "18"}});
        expect(NumberOfEventsWrapper.state('numberOfEvents')).toEqual("18");
     });

});