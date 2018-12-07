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
        "start_date": starting_date,
        "end_date": ending_date,
        "start_time": early_hour + ":00",
        "end_time": late_hour + ":00",
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
    console.log(data)
    writeOutput("Successfully created calendar " + data.calendar_name)


}


function loadCalendar(calendar_name) {
    console.log(calendar_name)
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
    console.log(this.responseText)
    var data = JSON.parse(this.responseText);
    document.getElementById('loaded_calendar').innerText = 'TEST'

    var str = "Successfully loaded calendar " + data.name

    str += "\n\nStarting Date: " + data.startDate
    str += "\n\nEnding Date: " + data.endDate

    localStorage.setItem("calendar", data.name)
    writeOutput(str)
    getAllDates()

}


function deleteCalendar(calendar_name) {
    var calendar = {"calendar_name": calendar_name};


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
    var data = JSON.parse(this.responseText);

    var str = "Successfully Deleted Calendar:  " + data.calendar_name

    writeOutput(str)
    loadAllCalendars()

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
    var calendars = JSON.parse(this.responseText).calendars
    document.getElementById("available_calendars").innerHTML = ""
    calendars.forEach(calendar => {
        var li = document.createElement('li')
        li.innerText = calendar.name;
        li.setAttribute("class", "collection-item")

        var innerHTMLToBe = `<div>` + calendar.name + `<a onclick="loadCalendar('` + calendar.name.toString() + `')" class="secondary-content"><i class="material-icons">send</i></a><a onclick="deleteCalendar('` + calendar.name.toString() + `')" class="secondary-content"><i class="material-icons">delete</i></a></div>`;

        li.innerHTML = innerHTMLToBe
        available_calendars.append(li)

    })
}

function writeOutput(str) {
    var output_area = document.getElementById('output_area')
    output_area.style ="text-align:center"
    output_area.innerText =
        str
}


function scheduleMeeting() {
    var dateTime = document.getElementById('meeting_date').value
    var time = document.getElementById('meeting_time').value

    var startTime = dateTime + " " + time
    var attendee = document.getElementById('meeting_attendee').value


    var location = document.getElementById("meeting_location").value
    var calendar_name = localStorage.getItem('calendar')
    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }
    var name = "Meeting with " + attendee
    var obj = {
        "name": name,
        "uid": Date.now().toString(),
        "start_time": startTime,
        "location": location,
        "attendee": attendee,
        "calendar_name": calendar_name
    }


    var dates = JSON.parse(localStorage.getItem('dates'))

    var found = false;

    dates.forEach(date =>{
        if(date.date === dateTime ){
            found = true
        }
    })

    
    if(found){
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = schedule_meeting;
        xhr.open("POST", url + "/Alpha/meeting/schedule");
        xhr.send(JSON.stringify(obj));

    }else{
        alert("date not in calendar")
    }
   
}

function schedule_meeting() {
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    var str = "";

    var data = JSON.parse(this.responseText)
    if (data.status !== "success") {
        str = "Failed to schedule meeting"
    }else{
        str = "Successfuly Scheduled " + data.meeting_name

    }

    writeOutput(str)
}


function cancelMeeting() {

    var date = document.getElementById('block_meeting_date').value
    var time = document.getElementById('block_meeting_time').value
    var calendar_name = localStorage.getItem('calendar')
    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }
    var obj = {
        "calendar_name": calendar_name,
        "start_time": date + " " + time
    }

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
    var calendar_name = localStorage.getItem('calendar')

    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }
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
    var data = JSON.parse(this.responseText)

    printSchedule(sortByKey(data.meetings, 'startTime'))
}

function getDailySchedule(){
    console.log("Getting dayly ")

    var dateTime = document.getElementById('daily_schedule_date').value
    var calendar_name = localStorage.getItem('calendar')

    if (!calendar_name) {
        alert("Please load a calendar")
        return
    }

    var dates = JSON.parse(localStorage.getItem('dates'))

    var found = false;

    dates.forEach(date =>{
        if(date.date === dateTime ){
            found = true
        }
    })
    if(found){
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = daily_schedule;
        xhr.open("GET", url + "/Alpha/schedule?date=" +dateTime  + '&calendar_name=' + calendar_name);
        xhr.send();
    }
}

function daily_schedule(){
    if (this.readyState !== 4) return;

    if (this.status !== 200) {
        //handle error
    }
    var data = JSON.parse(this.responseText)

    printSchedule(sortByKey(data.meetings, 'startTime'))
}

function printSchedule(schedule){

    var str = ""
    schedule.forEach(meeting=>{
        str += "\n----------------\n"
        str += meeting.name +'\n'
        str += meeting.startTime +'\n'
        if(meeting.location !== ""){
            str+="Location: " +  meeting.location + '\n'
        }
    })
    writeOutput(str)
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function addDayToCalendar(){
    var date = document.getElementById('add_day').value 
    var calendar_name = localStorage.getItem('calendar')

    if(date === null){
        alert("Please enter a date in the format YYYY-MM-DD")
        return
    }

    console.log(calendar_name)
    if(calendar_name === undefined){
        alert("No Calendar Loaded")
        return
    }
    console.log(date)

    var obj = {}

    obj["calendar_name"] = calendar_name
    obj["date"] = date
    console.log(obj)
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = add_day;
    xhr.open("POST", url + "/Alpha/calendar/add-day");
    xhr.send(JSON.stringify(obj));

}

function add_day(){
    if (this.readyState !== 4) return;

    if (this.status !== 200) {
        //handle error
    }

    var str = ""

    
    var resp = JSON.parse(this.responseText)

    if(resp.status === "success"){
        str = "Successfully Added Day to Calendar"
    }else{
        str = "Unable to Add Day to Calendar"
    }
    writeOutput(str)


    getAllDates()
}

function removeDayFromCalendar(){
    var date = document.getElementById('remove_day').value 
    var calendar_name = localStorage.getItem('calendar')

    if(date === null){
        alert("Please enter a date in the format YYYY-MM-DD")
        return
    }

    console.log(calendar_name)
    if(calendar_name === undefined){
        alert("No Calendar Loaded")
        return
    }
    console.log(date)

    var obj = {}

    obj["calendar_name"] = calendar_name
    obj["date"] = date
    console.log(obj)
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = remove_day;
    xhr.open("POST", url + "/Alpha/calendar/remove-day");
    xhr.send(JSON.stringify(obj));

}

function remove_day(){
    if (this.readyState !== 4) return;

    if (this.status !== 200) {
        //handle error
    }

    var str = ""

    
    var resp = JSON.parse(this.responseText)

    if(resp.status === "success"){
        str = "Successfully Removed Day from Calendar"
    }else{
        str = "Unable to Remove Day from Calendar"
    }
    writeOutput(str)
    getAllDates()
}



function closeTimeslot(){
    var date = document.getElementById('close_timeslot_date').value
    var time = document.getElementById('close_timeslot_time').value
    var name = localStorage.getItem('calendar')
    if(date === null){
        alert("Please enter a date")
        return
    }
    if(time === null){
        alert("Please enter a time")
        return
    }

    var obj = {
        "name": "BLOCKED TIME SLOT",
        "uid": Date.now().toString(),
        "start_time": date.toString() + " " + time.toString(),
        "attendee": "BLOCKED",
        "calendar_name": name,
        "location": ""
    }

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = timeslot_closed;
    xhr.open("POST", url + "/Alpha/meeting/schedule");
    xhr.send(JSON.stringify(obj));
    console.log(obj)
}

function timeslot_closed(){
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    var str = "";

    var data = JSON.parse(this.responseText)
    console.log("RESPONSE")
    console.log(data)
    if (data.status !== "success") {
        str = "Failed to block meeting"
    }else{
        str = "Successfuly Blocked Meeting"

    }

    writeOutput(str)
}

function blockAllDaysAtTime(){
    var time = document.getElementById('block_all_timeslots_time').value

    var calendar_name = localStorage.getItem('calendar')

    if(calendar_name === null){
        alert("Please load calendar")
    }
    if(time === null){
        alert('Please enter a time in the format HH:MM 24h')
    }
    var obj = {
        "time": time,
        "calendar_name": calendar_name
    }

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = blocked_days_at_time;
    xhr.open("POST", url + "/Alpha/calendar/block-time-slot");
    xhr.send(JSON.stringify(obj));
    console.log(obj)

}

function blocked_days_at_time(){
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    var str = "";

    var data = JSON.parse(this.responseText)
    console.log("RESPONSE")
    console.log(data)
    if (data.status === "success") {
        str = "Successfully Blocked Meetings"
    }else{
        str = "Failed to Block Meetings"

    }

    writeOutput(str)
}


function getAllDates(){
    var calendar_name = localStorage.getItem('calendar')
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = get_dates;
    xhr.open("GET", url + "/Alpha/calendar/get-dates?calendar_name=" + calendar_name);
    xhr.send();
}

function get_dates(){
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }

    console.log(JSON.parse(this.responseText))

    var dates = JSON.parse(this.responseText)
    dates = Object.values(dates)
    


    localStorage.setItem('dates', JSON.stringify(dates[0]))

}

function blockWeekday(){
    var weekday = document.getElementById('block_weekday_weekday').value
    var time = document.getElementById('block_weekday_time').value
    var calendar_name = localStorage.getItem('calendar')

    if(calendar_name === null){
        alert("Please load calendar")
    }
    if(time === null){
        alert('Please enter a time in the format HH:MM 24h')
    }
    if(weekday === null){
        alert("Please enter a weekday")
    }
    var obj = {
        "time": time,
        "calendar_name": calendar_name,
        "weekday": weekday
    }

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = block_weekday;
    xhr.open("POST", url + "/Alpha/calendar/block-time-slot");
    xhr.send(JSON.stringify(obj));
    console.log(obj)

}

function block_weekday(){
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        //handle error
    }
    var str = "";

    var data = JSON.parse(this.responseText)
    console.log("RESPONSE")
    console.log(data)
    if (data.status === "success") {
        str = "Successfully Blocked Meetings on Weekday"
    }else{
        str = "Failed to Block Meetings on Weekday"

    }

    writeOutput(str)
}