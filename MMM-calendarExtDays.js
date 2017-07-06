
Module.register("MMM-calendarExtDays", {
	defaults: {
        locale: 'en',
		timezone: null,
        days: 3,
		direction:'row', // 'row','row-reverse','column','column-reverse'
		overflowRolling: true,
		overflowHeight: 100,
		overflowDuration: 2,
        fullDayEventLocalize: true,
        hideOriginal: false,
		originalSender: 'calendar',
		monthStringFormat: 'MMM',
		dateStringFormat: 'D',
		dayStringFormat: 'ddd',
		eventTimeFormat: 'HH:mm',
		eventTimeOverdayFormat: 'MM/DD HH:mm',
		showEventTime: true,
		showEventLocation: true
    },


    //context: "loading",
	events: new Array(),
	oldEvents: new Array(),


    getScripts: function () {
		return ["moment.js"];
	},

	getStyles: function () {
		return ["font-awesome.css", "custom.css"];
	},

    start: function() {

		//moment.tz.setDefault(this.config.timezone);

		for (param in this.defaults) {
			if (typeof this.config[param] !== 'undefined') {
				;
			} else {
				this.config[param] = this.defaults[param];
			}
		}
        this.sendNotification('REQUEST_CALENDAR_EVENTS', {});
	},

	getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
		wrapper.style.flexDirection = this.config.direction;

		var self = this;
		this.events.forEach(function(day){
			var md = moment(parseInt(day.date));
			md.locale(self.config.locale);

			var monDateString = "";
			var monthString = md.format(self.config.monthStringFormat);
			var dateString = md.format(self.config.dateStringFormat);
			var dayString = md.format(self.config.dayStringFormat);

			var isNextMonth
				= (moment().format('MM') !== md.format('MM')) ? true : false;
			var isLastDay
				= (md.format('d') == moment().endOf('month').format('d'))
					? true : false;

			var dailyWrapper = document.createElement("div");
			dailyWrapper.className = "daily"
				+ " weekday_" + md.format('E')
				+ ((isNextMonth) ? " nextmonth" : "")
				+ " monDate_" + md.format('MMDD')
				+ " month_" + md.format('M')
				+ " date_" + md.format('D')
				+ ((isLastDay) ? " lastday" : "");

			var headerWrapper = document.createElement("div");
			headerWrapper.className = "header";

			var dateSuiteWrapper = document.createElement("div");
			dateSuiteWrapper.className = "dateSuite";

			var monthWrapper = document.createElement("span");
			monthWrapper.className = "month";
			monthWrapper.innerHTML = monthString;
			dateSuiteWrapper.appendChild(monthWrapper);

			var dateWrapper = document.createElement("span");
			dateWrapper.className = "date"
			dateWrapper.innerHTML = dateString;
			dateSuiteWrapper.appendChild(dateWrapper);

			var dayWrapper = document.createElement("div");
			var dayClassName = "day";
			dayWrapper.className = dayClassName;
			dayWrapper.innerHTML = dayString;

			headerWrapper.appendChild(dateSuiteWrapper);
			headerWrapper.appendChild(dayWrapper);

			dailyWrapper.appendChild(headerWrapper);

			var eventsBoardWrapper = document.createElement("div");
			eventsBoardWrapper.className = "eventsBoard";

			var eventsWrapper = document.createElement("ul");
			eventsWrapper.className = "events";

			if(Array.isArray(day.events)) {
				var count = 0;
				day.events.forEach(function(event) {
					count++;
					var color
						= (typeof event.color !== 'undefined') ? event.color : '#FFF';
					var symbol
						= (typeof event.symbol !== 'undefined') ? event.symbol : 'circle';
					var eventWrapper = document.createElement("li");
					eventWrapper.className = "event";

					var symbolWrapper = document.createElement("span");
					symbolWrapper.className
						= "fa-stack symbol symbol_" + symbol;
					symbolWrapper.innerHTML
						= "<i class='fa fa-circle fa-stack-2x'></i>"
						+ "<i class='fa fa-stack-1x fa-inverse fa-" + symbol + "'></i>";
					symbolWrapper.style.color = color;


					var eventContainerWrapper = document.createElement("div");
					eventContainerWrapper.className = "eventContainer";
					var eventTimeWrapper = document.createElement("div");
					eventTimeWrapper.className = "eventTime";
					var eventContentWrapper = document.createElement("div");
					eventContentWrapper.className = "eventContent";
					eventContentWrapper.innerHTML = event.title;
					var eventLocationWrapper = document.createElement("div");
					eventLocationWrapper.className = "eventLocation";
					eventLocationWrapper.innerHTML
						= event.location ? event.location : "";

					if (event.fullDayEvent) {
						eventWrapper.className += " fulldayevent";
						eventWrapper.style.backgroundColor = color;
						symbolWrapper.style.color = "#000";
					} else {
						var sd = moment(parseInt(event.startDate));
						var ed = moment(parseInt(event.endDate));
						var eventPeriodString = "";

						if (sd.format('D') != ed.format('D')) {
							var eventPeriodString
								= sd.format(self.config.eventTimeFormat) + " - "
								+ ed.format(self.config.eventTimeFormat);
						} else {
							var eventPeriodString
								= sd.format(self.config.eventTimeOverdayFormat)
								+ " - "
								+ ed.format(self.config.eventTimeOverdayFormat);
						}
						eventTimeWrapper.innerHTML = eventPeriodString
					}
					if (self.config.showEventTime) {
						eventContainerWrapper.appendChild(eventTimeWrapper);
					}
					eventContainerWrapper.appendChild(eventContentWrapper);
					if (self.config.showEventLocation) {
						eventContainerWrapper.appendChild(eventLocationWrapper);
					}
					eventWrapper.appendChild(symbolWrapper);
					eventWrapper.appendChild(eventContainerWrapper);
					eventsWrapper.appendChild(eventWrapper);
				});
			}
			eventsBoardWrapper.appendChild(eventsWrapper);
			dailyWrapper.appendChild(eventsBoardWrapper);

			wrapper.appendChild(dailyWrapper);

			var scriptWrapper = document.createElement('div');
			wrapper.appendChild(scriptWrapper);
		});
        return wrapper;
	},



	fetchEvents: function(payload) {
		var daysStart = moment().startOf('day');
		var daysEnd = moment(daysStart)
			.add(this.config.days - 1, 'days')
			.endOf('day');
		var days = [];
		this.events = [];

		for (
			var m = moment(daysStart);
			m.isBefore(daysEnd);
			m.add(1, 'days')
		) {
			days.push(m.startOf('day').valueOf());
		}

		var eventsPool = payload.filter(function(e){
			if (
				(e.startDate > daysEnd.valueOf())
				|| (e.endDate < daysStart.valueOf())
			) {
				return false;
			} else {
				return true;
			}
		});
		// for fulldayevent bugfix for timezone difference
		if (this.config.fullDayEventLocalize == true) {
			eventsPool.forEach(function(e){
				if(
					(moment(parseInt(e.startDate)).format('HHmm') == '0000')
					&& (moment(parseInt(e.endDate)).format('HHmm') == '0000')
				) {
					e.fullDayEvent = true;
				}
				if (e.fullDayEvent == true) {
					var timegap = e.endDate - e.startDate - 1;
					e.startDate = moment(parseInt(e.startDate))
						.startOf('day')
						.valueOf();
					e.endDate = moment(parseInt(e.startDate) + timegap)
						.endOf('day')
						.valueOf();
				}
			});
		}

		days.forEach(function(startOfDay) {
			var endOfDay = moment(startOfDay).endOf('day');
			var dailyEvents = eventsPool.filter(function(e){

				if (
					(e.startDate > endOfDay.valueOf())
					|| (e.endDate <= startOfDay.valueOf())
				) {
					//console.log(e.title, 'F', e.startDate, e.endDate);
					return false;
				} else {
					return true;
				}
			}).sort(function (a,b) {
				if (a.fullDayEvent != b.fullDayEvent) {
					return a.fullDayEvent ? -1 : 1;
				} else {
					return ((a.startDate <= b.startDate) ? -1 : 1);
				}
			});

			this.events.push({date:startOfDay.valueOf(), events:dailyEvents});
		}, this);

		if (compareEvents(this.oldEvents, this.events) == false) {
			//console.log("Some changes are there.");
			this.updateDom();
			this.rollOverflow();
			this.oldEvents = this.events.slice(0);
		} else if (this.oldEvents.length == 0) {
			//console.log("This is first time.");
			this.updateDom();
			this.rollOverflow();
			this.oldEvents = this.events;
		} else {
			//console.log("Same as previous events message.", this.oldEvents, this.events);
		}

	},

    notificationReceived: function(notification, payload, sender) {
        switch (notification) {
            case 'CALENDAR_EVENTS':
				if(sender.name == this.config.originalSender) {
					this.fetchEvents(payload);

				}
				break;
			case 'DOM_OBJECTS_CREATED':
				if (this.config.hideOriginal) {
					var modules = MM.getModules();
					var self = this;
					var original = document.getElementsByClassName(
							"module " + this.config.originalSender
						);
					//console.log(original.length, original)
					if(original.length >= 1) {
						//console.log("hide???");
						original[0].style.display = 'none';
					}
				}
				break;
        }
    },
	rollOverflow: function() {
		if (this.config.overflowRolling != true) {
			return false;
		}
		var height = this.config.overflowHeight;
		var nodes = [].slice.call(
			document.getElementsByClassName('eventsBoard')
		);

		var self = this;
		nodes.forEach(function(node){
			if (height < node.clientHeight) {
				node.className = "eventsBoard overflowed";
				node.style.height = height + "px";

				var copieshack = [].slice.call(node.childNodes);
				var duration = copieshack[0].childNodes.length * self.config.overflowDuration;
				copieshack.forEach(function(n){
					n.style.animationDuration = duration + 's';
					node.appendChild(n.cloneNode(true));

				});
			} else {
				node.className = "eventsBoard";
			}
		});
	}
});

compareEvents = function (a, b) {
	if (a.length != b.length) {
		return false;
	}
	for(i = 0; i < a.length; i++) {
		if(a[i].date != b[i].date) {
			return false;
		} else {
			if(a[i].events.length == b[i].events.length) {

			} else {
				return false;
			}
		}
	}
	return true;
}
