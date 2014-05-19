$( "#time-button" ).click(function() {
  //alert( "Handler for .click() called." + "Value: " + $('#time').val() );
  var inputDate = new Date('Mon Oct 13 1975 ' + $('#time').val() + ' GMT-0700 (PDT)');
  console.log(inputDate);
  loadData(inputDate);

});

var now = new Date();

$(document).ready(function () {
  $('#time').timepicker();
  loadData(now)
});
/*
   * Returns true if it's sweeping time
   * Returns false if it's not sweeping time
   * arugments strings of time eg "11:00:23" or "13:37:01"
   */
   function isItSweepingTime(now, start, end) {
      var temp = "October 13, 1975";
      var startTime = new Date("October 13, 1975 "+ start);
      //console.log("starttime" + startTime);
      var nowTime = new Date(temp + " " + now);
      //console.log("nowtime" + nowTime);
      var endTime = new Date("October 13, 1975 " + end);
      //console.log("endtime" + endTime);
      if ((startTime <= nowTime) && (nowTime <= endTime)) {
        return true;
      }
      //if not sweeping time, return false
      return false;
   }

  function loadData (now) {
    var stringNow = now.getHours().toString() + ":" + now.getMinutes().toString() + ":" + now.getSeconds().toString();
    console.log(stringNow);

   d3.csv("data/boston-street-sweeping-schedules.csv", function(data) {
    data = data.filter(function(row) {
        //filter down csv to only listings that are currently happening.
        return isItSweepingTime(stringNow, row['StartTime'], row['EndTime']);
    })
    // the columns you'd like to display
    var columns = ["Street","from","to","StartTime","EndTime"];
    //console.log(columns);
    d3.select("#results").html(null);
    var table = d3.select("#results").append("table"),
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