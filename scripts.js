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

    var data = this.responseText;
    console.log("Returned created calendar");
    console.log(JSON.parse(data))


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
    var data = this.responseText;
    console.log(data)


}


function loadAllCalendars(){
    var createdList = ""
    var available_calendars = document.getElementById('available_calendars')
    var calendars = [
        {"calendar_name": "test"},
        {"calendar_name": "Personal"},
        {"calendar_name": "Private"},
        {"calendar_name": "Work"}

    ]

    calendars.forEach(calendar=>{
        var li = document.createElement('li')
        li.innerText = calendar.calendar_name;
        li.setAttribute("class", "collection-item")

        var innerHTMLToBe = `<div>` + calendar.calendar_name +`<a onclick="loadCalendar('`+ calendar.calendar_name.toString()+`')" class="secondary-content"><i class="material-icons">send</i></a><a onclick="deleteCalendar('`+ calendar.calendar_name.toString()+`')" class="secondary-content"><i class="material-icons">delete</i></a></div>`;

        li.innerHTML = innerHTMLToBe
        available_calendars.append(li)
            console.log(calendar)

            // <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
    })


}