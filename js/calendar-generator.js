Handlebars.registerHelper('times', function(n, block) {
   var accum = '';
   for(var i = 0; i < n; ++i)
       accum += block.fn(i);
   return accum;
});

var streetSweeping = [
    {"street":"Wadsworth St", "date":"2014/01/13", "direction":"N"}, 
    {"street":"Wadsworth St", "date":"2014/9/22", "direction":"S"},
    {"street":"Broadway Ave", "date":"2014/04/13", "direction":"W"},
    {"street":"Broadway Ave", "date":"2014/04/27", "direction":"E"},
    {"street":"Broadway Ave", "date":"2014/02/2", "direction":"E"}
];

// ssDates looks like: [ "2014/01/13", "2014/9/22", "2014/04/13", "2014/04/27", "2014/02/2" ]
var ssDates = streetSweeping.map(function(ss){return ss.date});
var holidays = ['2014/03/12', '2014/05/22', '2014/04/01'];

// This is a callback
$(document).ready(function() {

  var source = $('#calendar-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i<=11; i++){
    var data = generateMonth(2014, i);
    var html = template(data);
    $('.yearCalendar').append(html);
  }

});


function dateInArray(date, array){
  
  for (var i = 0 ; i<array.length ; i++) {
    var arrayDate = new Date(array[i]);

    if (date.getDate() === arrayDate.getDate() 
      && date.getYear() === arrayDate.getYear() 
      && date.getMonth() === arrayDate.getMonth()) {
      return true;
    }
  }
  return false;
}

function generateMonth(year, month) {
  var monthName = ['January (enero)', 'February (febrero)', 'March (marzo)', 'April (abril)', 'May (mayo)', 'June (junio)', 'July (julio)', 'August (agosto)', 'September (septiembre)', 'October (octubre)', 'November (noviembre)', 'December (diciembre)']
  var emptyDays = new Date(year,month,1).getDay();
  var days = [];
  var daysInMonth = new Date(year, month, 0).getDate();


  for (var i = 1; i<=daysInMonth; i++) {
    var currentDay = new Date(year, month, i);
    days.push({
      date: i,
      holiday: dateInArray(currentDay, holidays),
      sweeping: dateInArray(currentDay, ssDates),

    });
  }

  return {
    days: days,
    emptyDays: emptyDays,
    monthName: monthName[month]
  };
}

