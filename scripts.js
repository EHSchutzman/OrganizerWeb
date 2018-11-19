var url = "https://iz7j5f93qa.execute-api.us-east-2.amazonaws.com";

function createCalendar() {

    var calendar_name = document.getElementById('calendar_name').value
    var starting_date = document.getElementById('starting_date').value
    var ending_date = document.getElementById('ending_date').value
    var early_hour = document.getElementById('early_hour').value
    var late_hour = document.getElementById('late_hour').value
    var meeting_duration = document.getElementById('meeting_duration').value

    var newCal = {
        "calendar_name": calendar_name,
        "start_date": new Date(starting_date),
        "ending_date": new Date(ending_date),
        "early_hour": early_hour,
        "late_hour": late_hour,
        "meeting_duration": meeting_duration
    }

    console.log(newCal)

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = calendar_created;
    xhr.open("POST", url + '/Alpha/calendar/create');

    xhr.send(JSON.stringify(newCal));

}

function calendar_created() {
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }

    var data = JSON.parse(this.responseText);
    console.log("Returned created calendar");
    console.log(data)
    writeOutput("Successfully created calendar " + data.calendar_name)


}


function loadCalendar(calendar_name) {

    console.log("Loading calendar " + calendar_name)
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = calendar_loaded;
    xhr.open("GET", url + "/Alpha/calendar/load?calendar_name=" + calendar_name);
    xhr.send();

}

function calendar_loaded() {

    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    console.log("returned")
    var data = JSON.parse(this.responseText);
    console.log(data)
    document.getElementById('loaded_calendar').innerHTML = data.calendar_name
    writeOutput("Successfully loaded calendar " + data.calendar_name)

}


function deleteCalendar(calendar_name) {
    var calendar = {"calendar_name": calendar_name};
    console.log("Delteing calendar")
    console.log(calendar)


    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = calendar_deleted;
    xhr.open("POST", url + "/Alpha/calendar/delete");
    xhr.send(JSON.stringify(calendar));

}

function calendar_deleted() {
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    console.log("returned delete")
    var data = JSON.parse(this.responseText);
    console.log(data)

    var str = "Successfully Deleted Calendar:  " + data.calendar_name

    writeOutput(str)

}


function loadAllCalendars() {

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = load_all_calendars;
    xhr.open("GET", url + "/Alpha/calendar/all");
    xhr.send();


}

function load_all_calendars() {
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    console.log("ALL CALENDARS")
    console.log(this.responseText)
    var calendars = JSON.parse(this.responseText).calendars
    console.log(calendars)
    document.getElementById("available_calendars").innerHTML = ""
    calendars.forEach(calendar => {
        var li = document.createElement('li')
        li.innerText = calendar.name;
        li.setAttribute("class", "collection-item")

        var innerHTMLToBe = `<div>` + calendar.name + `<a onclick="loadCalendar('` + calendar.name.toString() + `')" class="secondary-content"><i class="material-icons">send</i></a><a onclick="deleteCalendar('` + calendar.name.toString() + `')" class="secondary-content"><i class="material-icons">delete</i></a></div>`;

        li.innerHTML = innerHTMLToBe
        available_calendars.append(li)
        console.log(calendar)

    })
}

function writeOutput(str) {
    console.log("writing output")
    console.log(str)
    var output_area = document.getElementById('output_area')

    output_area.innerHTML =
        `<textarea disabled id="textarea1" class="materialize-textarea">` + str + `</textarea>`
}

function getDailySchedule() {
    var date = document.getElementById('daily_schedule_date').value
}


function scheduleMeeting() {
    console.log("HERE")
    var date = document.getElementById('meeting_date').value
    var time = document.getElementById('meeting_time').value

    date = date + " " + time
    var attendee = document.getElementById('meeting_attendee').value


    var location = document.getElementById("meeting_location").value
    var calendar_name = document.getElementById('loaded_calendar').innerText
    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }
    var name = "Meeting with " + attendee
    console.log(calendar_name)
    var obj = {
        "name": name,
        "uid": Date.now().toString(),
        "start_time": date,
        "location": location,
        "attendee": attendee,
        "calendar_name": calendar_name
    }

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = schedule_meeting;
    xhr.open("POST", url + "/Alpha/meeting/schedule");
    xhr.send(JSON.stringify(obj));

}

function schedule_meeting() {
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    var str = "";
    console.log("Schedule respoonse")
    console.log(this.responseText)

    var data = JSON.parse(this.responseText)
    if (data.status !== "success") {
        str = "Failed to schedule meeting"
    }else{
        str = "Successfuly Scheduled " + data.meeting_name

    }

    writeOutput(str)
}


function cancelMeeting() {
    console.log("here")

    var date = document.getElementById('block_meeting_date').value
    var time = document.getElementById('block_meeting_time').value
    var calendar_name = document.getElementById('loaded_calendar').innerText
    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }
    var obj = {
        "calendar_name": calendar_name,
        "start_time": date + " " + time
    }
    console.log(obj)

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = cancel_meeting;
    xhr.open("POST", url + "/Alpha/meeting/delete");
    xhr.send(JSON.stringify(obj));


}

function cancel_meeting(){
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    var str = "";
    console.log("Cancel Response")
    console.log(this.responseText)

    var data = JSON.parse(this.responseText)
    if (data.status !== "success") {
        str = "Failed to Cancel Meeting"
    }else{
        str = "Successfuly Canceled Meeting"
    }

    writeOutput(str)
}

function getMonthlySchedule(){
    var date = document.getElementById('monthly_schedule_month').value
    var calendar_name = document.getElementById('loaded_calendar').innerText

    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }
    console.log(date)
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = monthly_schedule;
    xhr.open("GET", url + "/Alpha/schedule?date=" +date  + '&calendar_name=' + calendar_name);
    xhr.send();

}

function monthly_schedule(){
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    console.log("HERE")
    console.log(JSON.parse(this.responseText))
    var data = JSON.parse(this.responseText)
    console.log(data)

    writeOutput(this.responseText)
}

function getDailySchedule(){
    var date = document.getElementById('daily_schedule_date').value
    var calendar_name = document.getElementById('loaded_calendar').innerText

    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }
    console.log(date)

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = daily_schedule;
    xhr.open("GET", url + "/Alpha/schedule?date=" +date  + '&calendar_name=' + calendar_name);
    xhr.send();
    console.log("SENT")
}

function daily_schedule(){
    if (this.readyState !== 4) return;

    if (this.status !== 200) {
        //handle error
    }
    console.log("HERE")
    console.log(JSON.parse(this.responseText))
    var data = JSON.parse(this.responseText)
    console.log(data)

    writeOutput(this.responseText)
}