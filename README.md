# MMM-calendarExtDays
extended default calendar view

![screenshot](https://github.com/eouia/MMM-calendarExtDays/blob/master/Magic_Mirror_row_7_overflow.jpg?raw=true)

## Information

**[Important] This is under construction, not stable. All responsibilty caused by this version is not mine, sorry. But if you want to try, please go ahead.**

This module is beautifying original `default/calendar` module view. This module catches events broadcasted from original calendar, shows them pretty. That's simple. I didn't reinvent the wheels.

## Dependencies
Nothing. I hope someday I can build more complex and greeeeeaaaat modules which need Dependencies.

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
```
  	$ git clone https://github.com/eouia/MMM-calendarExtDays.git
```
2. Configure your `~/MagicMirror/config/config.js`:

```
    {
        module: 'MMM-calendarExtDays',
        position: 'bottom_bar',
        config: {
            ...
        }
    }
```
3. This version needs some original calendar module(~ 2.1.2) hacks.
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
**This instruction will be deprecated after `PULL REQUEST` is accpeted and merged in Master branch.**

4. Configure your `~/MagicMirror/config/config.js` again. In this time you could inspect `calendar` settings:
```
	{
		module: "calendar",
		position: "top_left",
		config: {
			colored:true,
			maximumEntries:10,
			maximumNumberOfDays:365,
			calendars:[
				{
					maximumEntries:30,
					maximumNumberOfDays:365,
					symbol: "commenting",
					color: "#33FF99",
					url: "..."
				}, ..
				
```
If symbol and color are not used, this module shows only circle symbol and BLACK-WHITE. and that is not what you want. 
Enough Entries are needed for showing proper events by days.

## Config Options

| **Option** | **Value Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| `locale`    | `String`  |`'en'`  | Format date strings with specific language. (e.g. `'ko'` for display 'Sunday' to '일요일') |
| `timezone`  | `String`  | `null` | When you want display time of specific timezone. (e.g. `'America/Los_Angeles'` for Western US). Default value  is your current system locale(I wish). I think there might be some bug about this. I'll fix it later. |
| `days`      | `Integer` | `3`     | How many days to display (including today). I don't know what will happen when this value is smaller than 0 or not Integer. I'll check this later also. <br> Over `7` in horizontal region and over `5` in vertical region might be not what you wish to see. |
| `direction` | `String`  | `'row'`   | **Available Values** : `'row'`,`'row-reverse'`, `'column'`, `'column-reverse'`<br> `'row'` and `'row-reverse'` are good for horizontal region (e.g. `bottom_bar`) <br>`'column'` and `'column-reverse'` are good for vertical region (e.g. `top_left`) <br> But... This is your choice. |
| `overflowRolling`	| `Boolean`	| `true`	| If your events are too many to show, you can use this option for auto-rolling events which are overflowed over `overflowHeight` |
| `overflowHeight`	| `Integer`	| `100`	| Do not append `px` or `%`. Only Integer is acceptable.<br> I know, `100` is a bit small. If you have large screen, `250` could be pretty. This value is not activated when `overflowRolling` is not `true`. |
| `overflowDuration`	| `Integer`(sec)	| `2`	| Smaller is faster. This is also not activated when `overflowRolling` is not `true`. |
| `fullDayEventLocalize`	| `Boolean`	| `true`	| Don't touch this. This is a great mystery even for me. Someday I'll fix it. |
| `hideOriginal`	| `Boolean`	| `true`	| Sorry @MichMich. This could be `hide` the original calendar. It is not `module.hide()`, just `display:none`.|
| `originalSender`	| `String`	| `'calendar'`	| Don't touch this. Reserved for future. <br> Currently only `calendar` module broadcast calendar events. But I imagine someday there will be other modules who broadcast events. Weather module could tell forecasting. Uber module could tell the reservation. Furthermore, Alexa or Google Assistant could also. What a dream! |
| `monthStringFormat`	| `String`	| `'MMM'`	| If the date of events are in next month, month name will be added front of date. <br> You can see all the variable format tokens in `moment.js :: .format()` [link](https://momentjs.com/docs/#/displaying/format/)  <br> `.fromNow()` is not supported. Someday I will. |
| `dateStringFormat`	| `String`	| `'D'`	| Main date format(the biggest number in the module). |
| `dayStringFormat`	| `String`	| `'ddd'` | Name of week day. |
| `eventTimeFormat`	| `String`	| `'HH:mm'` | How to display time of event. |
| `eventTimeOverdayFormat` | `String`	| `'MM/DD HH:mm'` | If the event is longer than 1 day, you can display event time with another format. |
| `showEventTime` | `Boolean` | `true`	| Don't you want to know when the event starts and ends? |
| `showEventLocation` | `Boolean` | `true`	| Don't you want to know where the event is held? |

## Notice
I had a plan to release this late this month because of my summer holidays(from 7. Jul). However... I release now.
I believe there are many bugs in this. But I have no time to fix it for a while. You should consider that. After vacation, I'll check everything.

**Goog Luck!** 
