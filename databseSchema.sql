CREATE TABLE CALENDAR(
    name varchar(100) primary key,
    startHour integer,
    endHour integer,
    meetingDuration integer,
    startDate Date,
    endDate Date

);


CREATE TABLE Meeting(
    name varchar(100),
    uid varchar(20) primary key,
    location varchar(255),
    attendee varchar(255),

    FOREIGN KEY cal_nameFK name references Calendar(name)
);