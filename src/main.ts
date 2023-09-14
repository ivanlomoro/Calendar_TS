import { Event, EventData } from './types/interface';

const calendar = document.querySelector(".calendar") as HTMLElement;
const date = document.querySelector(".date") as HTMLElement;
const daysContainer = document.querySelector(".days") as HTMLElement;
const prev = document.querySelector(".prev") as HTMLElement;
const next = document.querySelector(".next") as HTMLElement;
const todayBtn = document.querySelector(".today-btn") as HTMLElement;
const eventDay = document.querySelector(".event-day") as HTMLElement;
const eventDate = document.querySelector(".event-date") as HTMLElement;
const eventsContainer = document.querySelector(".events") as HTMLElement;
const addEventSubmit = document.querySelector(".add-event-btn") as HTMLElement;
const addEventFrom = document.querySelector(".event-time-from") as HTMLInputElement;

let today = new Date();
let activeDay: number;
let month = today.getMonth();
let year = today.getFullYear();

const months: string[] = [
    "January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"
];

let eventsArr: EventData[] = [];

getEvents();

function initCalendar() {
    const firstDay = new Date(year, month, 0);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay();

    date.textContent = months[month] + " " + year;

    let days = "";

    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        let event = false;
        eventsArr.forEach((eventObj: EventData) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });

        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);

            if (event) {
                days += `<div class="day today active event">${i}</div>`;
            }
            else {
                days += `<div class="day today active">${i}</div>`;
            }
        }
        else {
            if (event) {
                days += `<div class="day event">${i}</div>`;
            }
            else {
                days += `<div class="day">${i}</div>`;
            }
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }
    daysContainer.innerHTML = days;
    addListener();
    updateEvents(activeDay);
}

initCalendar();

function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

function getActiveDay(date: any) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(' ')[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;

    const activeDay = new Date(year, month, date);
    activeDay.setDate(day.getDate() + 1);
    addEventFrom.value = activeDay.toISOString().substr(0, 16);
}

const addEventBtn = document.querySelector(".add-event") as HTMLElement;
const addEventContainer = document.querySelector(".add-event-wrapper") as HTMLElement;
const addEventCloseBtn = document.querySelector(".close") as HTMLElement;
const addEventTitle = document.querySelector(".event-name") as HTMLInputElement;
const addEventTo = document.querySelector(".event-time-to") as HTMLInputElement;
const description = document.querySelector(".description") as HTMLInputElement;
const addEventActivity = document.querySelector(".event-select") as HTMLSelectElement;
const addEventReminder = document.querySelector("#reminderSelect") as HTMLSelectElement;

const openAddEventContainer = () => {
    addEventContainer.classList.add("active");
    addEventTitle.value = "";
    addEventTo.value = "";
    description.value = "";
};

const closeAddEventContainer = () => {
    addEventContainer.classList.remove("active");
};

const toggleAddEventContainer = () => {
    addEventContainer.classList.toggle("active");
    if (addEventContainer.classList.contains("active")) {
        addEventTitle.value = "";
        addEventTo.value = "";
        description.value = "";
    }
};

addEventBtn.addEventListener("click", toggleAddEventContainer);
addEventCloseBtn.addEventListener("click", closeAddEventContainer);

document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (
        target !== addEventBtn &&
        !(addEventContainer.contains(target)) &&
        target !== addEventContainer
    ) {
        closeAddEventContainer();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeAddEventContainer();
    }
});

daysContainer.addEventListener('dblclick', function(event) {
    const target = event.target as HTMLElement;
    if (target?.classList.contains('day')) {
        toggleAddEventContainer();
    }
});

addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;

            activeDay = Number(target.innerHTML);

            getActiveDay(target.innerHTML);
            updateEvents(Number(target.innerHTML));

            days.forEach((day) => {
                day.classList.remove("active");
            });

            expiredEvents();

            if (target.classList.contains("prev-date")) {
                prevMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if (!day.classList.contains("prev-date") &&
                            day.innerHTML === target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if (target.classList.contains("next-date")) {
                nextMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if (!day.classList.contains("next-date") &&
                            day.innerHTML === target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            }
            else {
                target.classList.add("active");
            }
        });
    });
}
initCalendar();

function updateEvents(date: any) {
    let events = "";
    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {

            event.events.forEach((event: any) => {
                const eventTime = new Date(event.time);
                const currentTime = new Date();
                const timeDifferenceMs = eventTime.getTime() - currentTime.getTime();
                events += `
                <div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3><h3 class="event-title">${event.activity}</h3>
                    </div>
                    <div class="event-time">
                        <span>${event.fullTime}</span>
                    </div>
                </div>
                `;
            });
        }
    });

    if (events === "") {
        events = `<div class="no-event">
                    <h3>No Events</h3>
                </div>`;
    }

    eventsContainer.innerHTML = events;
    saveEvents();
}

const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (!link) {
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.id = 'favicon';
    newLink.href = '/assets/img/icon.png';
    document.head.appendChild(newLink);
} else {
    link.href = '/assets/img/icon.png';
}

let theme: string = "light-mode";

function toggleTheme() {
    const calendar = document.querySelector("body");
    const logoLightHeader = document.getElementById("logoLightHeader");
    const logoDarkHeader = document.getElementById("logoDarkHeader");
    const logoLight = document.getElementById("logoLight");
    const logoDark = document.getElementById("logoDark");

    if (theme === "light-mode") {
        theme = "dark-mode";
        calendar?.classList.remove("light-mode");
        calendar?.classList.add("dark-mode");

        logoLightHeader?.classList.add("hidden");
        logoDarkHeader?.classList.remove("hidden");

        logoLight?.classList.add("hidden");
        logoDark?.classList.remove("hidden");

        const favicon = document.getElementById('favicon') as HTMLLinkElement;
        if (favicon) {
            favicon.href = '/assets/img/icon-dark.png';
        }
    } else {
        theme = "light-mode";
        calendar?.classList.remove("dark-mode");
        calendar?.classList.add("light-mode");

        logoLightHeader?.classList.remove("hidden");
        logoDarkHeader?.classList.add("hidden");

        logoLight?.classList.remove("hidden");
        logoDark?.classList.add("hidden");

        const favicon = document.getElementById('favicon') as HTMLLinkElement;
        if (favicon) {
            favicon.href = '/assets/img/icon.png';
        }
    }
}

const themeSwitch: HTMLInputElement | null = document.getElementById("themeSwitch") as HTMLInputElement | null;
if (themeSwitch) {
    themeSwitch.addEventListener("click", toggleTheme);
}

addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    let eventTimeTo = addEventTo.value;
    const eventActivity = addEventActivity.value;
    const eventReminder = addEventReminder.value;

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    const timeFromHour = parseInt(timeFromArr[0], 10);
    const timeFromMin = parseInt(timeFromArr[1], 10);

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    if (eventTitle === "" || eventTimeFrom === "" || eventActivity === "") {
        validateActivity(), validateTitle();
        return;
    } 
    
    if (checkboxFrom.checked && eventTimeTo < eventTimeFrom) {
        validateTime();
        return;
    }

    if (!checkboxFrom.checked && eventTimeTo !== "") {
        eventTimeTo = "";
    }

    const newEvent: Event = {
        title: eventTitle,
        activity: eventActivity,
        reminder: eventReminder,
        time: timeFrom,
        fullTime: eventTimeFrom.slice(11, 16) + " " + eventTimeTo.slice(11, 16),
    };    

    if (eventTimeTo) {
        newEvent.fullTime = eventTimeFrom.slice(11, 16) + " - " + eventTimeTo.slice(11, 16);
    }

    let eventAdded = false;

    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent]
        })
    }

    addEventContainer.classList.remove('active');
    addEventTitle.value = "";
    addEventTo.value = "";
    description.value = "";

    updateEvents(activeDay);

    const activeDayElem = document.querySelector(".day-active");
    if (!activeDayElem?.classList.contains("event")) {
        activeDayElem?.classList.add("event");
    }
    initCalendar();
    getEventsTimer();
    expiredEvents();
});

function convertTime(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const timeFormat = hours >= 12 ? "PM" : "AM";
    let formattedHours = hours % 12;
    formattedHours = formattedHours === 0 ? 12 : formattedHours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes} ${timeFormat}`;
}

eventsContainer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("event")) {
        const eventTitle = target.children[0].children[1].innerHTML;

        eventsArr.forEach((event) => {
            if (
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            ) {
                event.events.forEach((item: any, index: any) => {
                    if (item.title === eventTitle) {
                        event.events.splice(index, 1);
                    }
                });

                if (event.events.length === 0) {
                    eventsArr.splice(eventsArr.indexOf(event), 1);

                    const activeDayElem = document.querySelector(".day.active") as HTMLElement;
                    if (activeDayElem.classList.contains("event")) {
                        activeDayElem.classList.remove("event");
                    }
                }
            }
        });

        updateEvents(activeDay);
        expiredEvents();
    }
});

function saveEvents() {
    localStorage.setItem("eventsArr", JSON.stringify(eventsArr));
}

function getEvents() {
    if (localStorage.getItem("eventsArr")) {
        eventsArr = JSON.parse(localStorage.getItem("eventsArr") || "[]");
        updateEvents(activeDay);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const textbox = document.getElementById('textBox') as HTMLTextAreaElement;

    textbox.addEventListener('input', () => {
        if (textbox.value.length > 500) {
            textbox.value = textbox.value.slice(0, 500);
        }
    });
});

const checkboxFrom = document.getElementById("checkboxTo") as HTMLFormElement;
const checkboxReminder = document.getElementById("checkboxReminder") as HTMLFormElement;
const reminderSelect = document.getElementById("reminderSelect") as HTMLFormElement;

checkboxFrom.addEventListener("change", function () {
    if (checkboxFrom.checked === true) {
        addEventTo.classList.remove("hidden-input");
        addEventTo.classList.add("shown-input");
    } else {
        addEventTo.classList.remove("shown-input");
        addEventTo.classList.add("hidden-input");
        validationTime.textContent = ""; 
        addEventTo.classList.remove("error");
        validationTime.classList.remove("error-animation");  
    }
});

checkboxReminder.addEventListener("change", function () {
    if (checkboxReminder.checked === true) {
        reminderSelect.classList.remove("hidden-input");
        reminderSelect.classList.add("shown-input");
    } else {
        reminderSelect.classList.remove("shown-input");
        reminderSelect.classList.add("hidden-input");
    }
});

const titleValidationMessage = document.querySelector(".event-name + .validation-message") as HTMLElement;
const activityValidationMessage = document.querySelector(".event-select + .validation-message") as HTMLElement;
const validationTitle = document.querySelector(".validation-title") as HTMLElement;
const validationActivity = document.querySelector(".validation-activity") as HTMLElement;
const validationTime = document.querySelector(".validation-time") as HTMLElement;

addEventTitle.addEventListener("blur", validateTitle);
addEventTitle.addEventListener("focus", clearValidationMessage);
addEventActivity.addEventListener("blur", validateActivity);
addEventActivity.addEventListener("focus", clearValidationMessage);
addEventTo.addEventListener("blur", validateTime);
addEventTo.addEventListener("focus", clearValidationMessage);

function validateTitle() {
    const eventTitle = addEventTitle.value.trim();
    if (eventTitle === "") {
        titleValidationMessage.textContent = "Please enter a title.";
        addEventTitle.classList.add("error");
        validationTitle.classList.add("error-animation")
    } else {
        titleValidationMessage.textContent = "";
        addEventTitle.classList.remove("error");
    }
}

function validateActivity() {
    const eventActivity = addEventActivity.value;
    if (eventActivity === "") {
        activityValidationMessage.textContent = "Please select an activity.";
        addEventActivity.classList.add("error");
        validationActivity.classList.add("error-animation")
    } else {
        activityValidationMessage.textContent = "";
        addEventActivity.classList.remove("error");
    }
}

function validateTime() {
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    const validationTime = document.querySelector(".validation-time") as HTMLElement;

    if (checkboxFrom.checked === true) {
        if (eventTimeTo < eventTimeFrom) {
            validationTime.textContent = "End time cannot be earlier than start time.";
            addEventTo.classList.add("error");
            validationTime.classList.add("error-animation");
        } else {
            validationTime.textContent = "";
            addEventTo.classList.remove("error");
            validationTime.classList.remove("error-animation");
        }
    } else if (checkboxFrom.checked === false) {
        validationTime.textContent = "";
        addEventTo.classList.remove("error");
        validationTime.classList.remove("error-animation");
    }
}

function clearValidationMessage() {
    addEventTitle.textContent = "";
    addEventTitle.classList.remove("error");
}

function getEventsTimer() {
    if (localStorage.getItem("eventsArr")) {
        const eventsArr = JSON.parse(localStorage.getItem("eventsArr") || "[]");

        eventsArr.forEach((eventObj: { day: any; month: any; year: any; events: any; }) => {
            const { day, month, year, events } = eventObj;

            events.forEach((event: { fullTime: any; reminder: any; }) => {
                const { fullTime, reminder } = event;

                const fullTimeParts = fullTime.split(':');
                const hours = parseInt(fullTimeParts[0]);
                const minutes = parseInt(fullTimeParts[1]);
                const eventTime = new Date(year, month - 1, day, hours, minutes);

                const now = new Date();
                const timeDifferenceMs = eventTime.getTime() - now.getTime();
                const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));

                if (timeDifferenceMinutes <= reminder && timeDifferenceMinutes >= 0) {
                    const eventId = `${day}-${month}-${year}-${fullTime}`;
                    const alarmSet = localStorage.getItem(eventId);

                    if (!alarmSet) {
                        const alarmElement = document.getElementById('customAlarm') as HTMLElement;
                        alarmElement.textContent = `${timeDifferenceMinutes} minutes left until event starts!`;
                        alarmElement.style.display = 'block';

                        setTimeout(() => {
                            alarmElement.style.display = 'none';
                            localStorage.setItem(eventId, 'true');
                        }, 5000);
                    }
                }
            });
        });
    }
}

function expiredEvents() {
    const eventContainers = document.querySelectorAll(".event") as NodeList;
    const now = new Date();

    eventsArr.forEach((eventObj: { day: any; month: any; year: any; events: any; }) => {
        const { day, month, year, events } = eventObj;

        events.forEach((event: { fullTime: any; reminder: any; }) => {
            const { fullTime } = event;

            const fullTimeParts = fullTime.split(' - ');

            if (fullTimeParts.length === 2) {
                const endTimeParts = fullTimeParts[1].split(':');

                const endHours = parseInt(endTimeParts[0]);
                const endMinutes = parseInt(endTimeParts[1]);

                const eventEndTime = new Date(year, month - 1, day, endHours, endMinutes);

                if (now > eventEndTime) {
                    eventContainers.forEach((eventCont: any) => {
                        const eventTimeElem = eventCont.querySelector('.event-time');

                        if (eventTimeElem && eventTimeElem.textContent.trim() === fullTime) {
                            eventCont.classList.add("expired");
                        }
                    });
                }
            }
        });
    });
}

setInterval(expiredEvents, 1000);
expiredEvents();
setInterval(getEventsTimer, 10000);
getEventsTimer();
