Date.prototype.getUTCMonthWeek = function(){
    var firstDay = new Date(this.getUTCFullYear(), this.getUTCMonth(), 1).getUTCDay();
    return Math.ceil((this.getUTCDate() + firstDay)/7);
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
 * milliseconds not acceptable in firefox
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

function removeMilliseconds(time) {
  return time.split('.')[0];
}
function loadData (filterTime) {
  // All dates from the server are stored as UTC, use UTC for comparison
  var utcTime = filterTime.getUTCHours().toString() + ":" + filterTime.getUTCMinutes().toString() + ":" + filterTime.getUTCSeconds().toString();

  d3.csv("data/boston-street-sweeping-schedules.csv", function(data) {
    data = data.filter(function(row) {
      //filter down csv to only listings that are currently happening.
      var weeks = [row['week1'], row['week2'], row['week3'], row['week4'], row['week5']];
      var days = [row['Sunday'],row['Monday'],row['Tuesday'],row['Wednesday'],row['Thursday'],row['Friday'],row['Saturday']];
      var sweepingWeek = isItSweepingWeek(filterTime.getUTCMonthWeek(), weeks);
      var sweepingDay = isItSweepingDay(filterTime.getUTCDay(), days);
      var sweepingTime = isItSweepingTime(utcTime, removeMilliseconds(row['StartTime']), removeMilliseconds(row['EndTime']));
      return  sweepingTime && sweepingWeek && sweepingDay;
  })
  // the columns you'd like to display
  var columns = ['Street','from','to'];

  var results = d3.select("#results").html(null),
      table = results.append("table").attr("class", "tblResults"),
      thead = table.append("thead"),
      tbody = table.append("tbody");

  // append the header row
  thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
          .text(function(column) { return column; })
      .on("click", function(d){
        d3.select('#results table tbody')
            .selectAll('tr').sort(function(a, b){
              if (ascending)
                return d3.ascending(a[d], b[d]);
              else
                return d3.descending(a[d], b[d]);
          });
          //flip the bit:
          ascending = !ascending;
        }
      )
    ;
  //initialize ascending as true
  var ascending = true;
  //add sort icon to the list
  d3.selectAll('#results table tr th').append('span').html(' <i class="fa fa-sort"></i>')

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
