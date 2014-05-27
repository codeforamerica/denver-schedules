Date.prototype.getMonthWeek = function(){
    var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDay)/7);
}

$( "#time-button" ).click(function() {
  var inputDate = new Date($('#date').val() + ' ' + $('#time').val() );
  loadData(inputDate);
});

$(document).ready(function () {
  $('#time').timepicker({
      defaultTime: 'current',
      minuteStep: 1,
      disableFocus: true,
      template: 'dropdown'
  });

  $('.datepicker').datepicker();
});

/*
 * Returns true if it's sweeping time
 * Returns false if it's not sweeping time
 * arugments strings of time eg "11:00:23" or "13:37:01"
 */
 function isItSweepingTime(time, start, end) {
  var temp = "October 13, 1975";
  var searchTime = new Date(temp + " " + time);
  var startTime = new Date(temp + " "+ start);
  var endTime = new Date(temp + " " + end);
  return (startTime <= searchTime) && (searchTime <= endTime);
 }

function isItSweepingWeek (weekOfMonth, weeks) {
  return (weeks[weekOfMonth-1] == "True");
}

function isItSweepingDay (dayOfWeek, days) {
  return (days[dayOfWeek] == "True");
}

function loadData (now) {
  // All dates from the server are stored as UTC, convert
  
  var time = now.getHours().toString() + ":" + now.getMinutes().toString() + ":" + now.getSeconds().toString();
 
  d3.csv("data/boston-street-sweeping-schedules.csv", function(data) {
    data = data.filter(function(row) {
      //filter down csv to only listings that are currently happening.
      var weeks = [row['week1'], row['week2'], row['week3'], row['week4'], row['week5']];
      var days = [row['Sunday'],row['Monday'],row['Tuesday'],row['Wednesday'],row['Thursday'],row['Friday'],row['Saturday']];
      var sweepingWeek = isItSweepingWeek(now.getMonthWeek(), weeks);
      var sweepingTime = isItSweepingTime(time, row['StartTime'], row['EndTime']);
      var sweepingDay = isItSweepingDay(now.getDay(), days);
      return  sweepingTime && sweepingWeek && sweepingDay;
  })
  // the columns you'd like to display
  var columns = ['Street','from','to'];
  
  d3.select("#results").html(null);
  var table = d3.select("#results").append("table").attr("class", "tblResults"),
      thead = table.append("thead"),
      tbody = table.append("tbody");

  // append the header row
  thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
          .text(function(column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
      .data(function(row) {
          return columns.map(function(column) {
              return {column: column, value: row[column]};
          });
      })
      .enter()
      .append("td")
          .text(function(d) { return d.value; });
  });
}
