Feature: Show/hide event details

Scenario: An event element is collapsed by default
Given user has not clicked on an event yet
When user is at events overview
Then event details are collapsed

Scenario: User can expand an event to see its details
Given the user is interested in an event
When the clicks on the event
Then the event details will be shown

Scenario: User can collapse an event to hide its details
Given the user as seen the event details
When the user clicks on an expand event element
Then the event details shouldn’t be displayed anymore