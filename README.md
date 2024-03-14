# Ics Middleware

Small middleware fetching ics files from remote urls and returning it with all UIDs postfixed.
It was built as a workaround to Nextcloud architecture bug storing local and subscribed calendar event in single table with globally unique UIDs.
This architecture does not allow subscribing to remote calendar containing same events as in local calendar.

## Use case
I have my personal calendar on Nextcloud
My partner has her own personal calendar on google for example.
We subscribe to each other calendars to see each others program.
From time to time we invite each other to a common event.

Here is the problem. I receive event invitation, but I already have the same event in the subscribed calendar.
Nextcloud can't handle this.

Solution: I subscribe to partner's calendar through this middleware. This adds postfix to all event UIDs.
When invitation comes, there is no id collision with existing event as invitation has the original UID,
and stored events from subscribed calendar has postfixed UID

## Settings

App requires env variable `CALENDARS` containing a json object of absolute path as a key and ics calendar as value.

```env
CALENDARS={"/partner":"https://some.server/calendar.ics"}
```

Optionaly you can define a postfix that will be added to all event UIDs by env variable `POSTFIX`. Default to value `@icsmw`

```env
POSTFIX=@icsmw
```
