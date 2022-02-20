Feature: Specify number of events

Scenario: When user hasn’t specified a number, 32 is the default number
Given the user has not chosen the amount of events to see on the overview 
When the user opens the overview 
Then the user will see 32 events by default


Scenario: User can change the number of events they want to see
Given the use want to change the amount of event on the page
When the user sets a number of events
Then the users sees the amount of events displayed

