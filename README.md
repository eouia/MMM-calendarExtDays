# MMM-calendarExtDays
extended default calendar view

## Information

** [Important] This is under construction, not stable. All responsibilty caused by this version is not mine, sorry. But if you want to try, please go ahead. **

This module is beautify original `default/calendar` module views. This module catches events broadcasted from original calendar, show them pretty. That's simple. I didn't reinvent the wheels.

## Dependencies
Nothing. I hope someday I can build more complex and greeeeeaaaat modules which need Dependencies.

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
```
  $ git clone https://github.com/eouia/MMM-calendarExtDays.git
```
1. Configure your `~/MagicMirror/config/config.js`:

    ```
    {
        module: 'MMM-calendarExtDays',
        position: 'bottom_bar',
        config: {
            ...
        }
    }
    ```
1. This version needs some original calendar module hacks.
Backup and modify `calendar.js`.
```
  $ cd ~/MagicMirror/modules/default/calendar
  $ cp calendar.js calendar.js.original
  $ nano calendar.js
```
go to around 524 line and find these.
```
			for (var e in calendar) {
				var event = cloneObject(calendar[e]);
      
        //for MMM-calendarExtDays
				event.symbol = this.symbolsForUrl(url);   // these two lines
				event.color = this.colorForUrl(url);      // you should add.
      
        delete event.url;
				eventList.push(event);
			}

```
This instruction will be deprecated after `PULL REQUEST` is accpeted and merged in Master branch.


## Config Options

| **Option** | **Value Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| `locale`    | `String`  |`'en'`  | Format date strings with specific language. (e.g. `'ko'` for display 'Sunday' to '일요일') |
| `timezone`  | `String`  | `null` | When you want display time of specific timezone. (e.g. `'America/Los_Angeles'` for Western US). Default value  is your current system locale(I wish). I think there might be some bug about this. I'll fix it later. |
| `days`      | `Integer` | `3`     | How many days to display (including today). I don't know what will happen this value is smaller than 0 or not Integer. I'll check this later also. 
Over `7` in horizontal region and over `5` in vertical region might be not what you wish to see.
| `direction` | `String`  | `'row'`   | ** Available Values ** : 
`'row'`,`'row-reverse'`, `'column'`, `'column-reverse'`
`'row'` and `'row-reverse'` are good for horizontal region (e.g. `bottom_bar`)
`'column'` and `'column-reverse'` are good for vertical region (e.g. `top_left`) 
But... This is your choice. |
