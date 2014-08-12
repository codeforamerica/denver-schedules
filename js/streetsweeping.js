//this function outputs our custom way of abbreviating days
Date.prototype.getDayAbbrev = function(){
    var days = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    return days[this.getDay()];
}

Date.prototype.getDayFull = function(){
    var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    return days[this.getDay()];
}

Date.prototype.getMonthFull = function(){
    var days = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    return days[this.getMonth()];
}

//this function outputs our custom way of abbreviating month names
Date.prototype.getMonthAbbrev = function(){
    var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    return months[this.getMonth()];
}


/*
 *   This function converts a string to "Title Case"
 *   Adapted from https://gist.github.com/LeoDutra/2764339
*/
String.prototype.toTitleCase = function(){
  var str = this.toString();

  // \u00C0-\u00ff for a happy Latin-1
  return str.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
      return initial.toUpperCase();
  }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
      return match.toLowerCase();
  });
};


Handlebars.registerHelper("firstDate", function(array) {
  if(array && array.length > 0 ) {
    var first = array[0];
    var date = new Date(first);
    return date.getDayAbbrev() + ", " + date.getMonthAbbrev() + " " + (date.getDate() +1 );
  }
  else {
    return '';
  }
});

Handlebars.registerHelper("formatNextDate", function(date) {
  date = new Date(date);
  return date.getDayFull() + ", " + date.getMonthFull() + " " + (date.getDate() +1);
});

Handlebars.registerHelper("toTitleCase", function(array) {
  if(array && array.length > 0 ) {
    return array.toTitleCase();
  }
  else {
    return '';
  }
});

function defaultAddress(){
  $('#address').val('305 Milwaukee St, Denver, CO');
  $('#results').html('<div class="text-center"><img src="img/loading.gif" /></div>');
  $('#submit').click();
}

$('#submit').click(function (){
  getGeocode();
});

function getGeocode(){
  var address = encodeURIComponent($("#address").val());
  var geocoder = geocoders['openstreetmap'],
      url = geocoder.query(address, '');

  $.ajax({
    url: url,
    success: function(data){
      // Only get street sweeping data if we have a street address
      if( data[0].address.house_number) {
        loadData(geocoder.parse(data));
      }
      else {
        loadData([]);
      }
    },
    error: function(error){
      console.log(JSON.stringify(error));
    }
  });
}

function loadData(address){
  var routes   = $("#route-template").html();
  var notes = $("#notes-template").html();
  var routeTemplate = Handlebars.compile(routes);
  var notesTemplate = Handlebars.compile(notes);
  $.ajax({
    url: "http://production-denver-now-api.herokuapp.com/schedules/streetsweeping",
    data: address,
    success: function(schedules){
      console.log("Success getting data from server: " + JSON.stringify(schedules));
      // Add a method used as a conditional in mustache
      $.each(schedules, function(index, schedule){
        schedule.hasUpcoming = function(){
          return schedule.upcoming.length > 0;
        }
      });

      //this checks if an address has street sweeping data
      if (schedules && schedules.length > 0 && typeof schedules !== 'undefined') {
        schedules.validAddress = true;
      } else {
        schedules.validAddress = false;
      }

      //sort dates in ascending order based on the first date in the upcoming list
      schedules.sort(function(x, y){
        return new Date(x.upcoming[0]) - new Date(y.upcoming[0]);
      })

      //set next sweeping date and pass it to the view
      if (schedules.validAddress) {
          schedules.nextSweeping = {
          "date" : schedules[0].upcoming[0],
          "name": schedules[0].name,
          "description": schedules[0].description
          };
      }
      $('#results').html(routeTemplate(schedules));
      $('#notes').html(notesTemplate(schedules));
    },
    error: function(data){
      console.log('Error: ' + JSON.stringify(data));
    }
  });
}

// Modified from https://raw.githubusercontent.com/mapbox/geo-googledocs/master/MapBox.js
var nullGeocoder = { longitude: null, latitude: null, accuracy: null };
var geocoders = {
  yahoo: {
    query: function(query, key) {
      return 'http://where.yahooapis.com/geocode?appid=' +
        key + '&flags=JC&q=' + query;
    },
    parse: function(r) {
      try {
        return {
          longitude: r.ResultSet.Results[0].longitude,
          latitude: r.ResultSet.Results[0].latitude,
          accuracy: r.ResultSet.Results[0].quality
        }
      } catch(e) {
        return nullGeocoder;
      }
    }
  },
  mapquest: {
    query: function(query, key) {
      return 'http://open.mapquestapi.com/nominatim/v1/search?format=json&limit=1&q=' + query;
    },
    parse: function(r) {
      try {
        return {
          longitude: r[0].lon,
          latitude: r[0].lat,
          accuracy: r[0].type
        }
      } catch(e) {
        return nullGeocoder;
      }
    }
  },
  cicero: {
    query: function(query, key) {
      return 'https://cicero.azavea.com/v3.1/legislative_district?format=json&key=' +
        key + '&search_loc=' + query;
    },
    parse: function(r) {
      try {
        return {
          longitude: r.response.results.candidates[0].x,
          latitude: r.response.results.candidates[0].y,
          accuracy: r.response.results.candidates[0].score
        }
      } catch(e) {
        return nullGeocoder;
      }
    }
  },
  openstreetmap: {
    query: function(query, key) {
      return  'http://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=' + query;
    },
    parse: function(r) {
      try {
        return {
          longitude: r[0].lon,
          latitude: r[0].lat,
          accuracy: r[0].importance
        }
      } catch(e) {
        return nullGeocoder;
      }
    }
  }
};


//This is to trigger the popup when someone clicks on something with the class 'trigger-pop-up'

  $(document).ready( function () {
  //This code is for pressing enter on the big search box

    $( "#address" ).keypress(function( event ) {
     //if user presses enter, click on the submit button:
     if (event.charCode == 13) {
       $('#submit').click();
       $('#results').html('<div class="text-center"><img src="img/loading.gif" /></div>');
     }
    });
    //This code is for pressing enter on the email sign up box

    $( "#mce-EMAIL" ).keypress(function( event ) {
      //if user presses enter, click on the submit button:
       if (event.charCode == 13) {
         $('#mc-embedded-subscribe').click();
       }
    });
  });
