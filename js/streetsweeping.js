// TODO: Move into more generic file
Handlebars.registerHelper("firstDate", function(array) {
  // TODO: Dumb, use date manipulation library
  var days = new Array("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT");
  var months = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC");
  if(array && array.length > 0) {
    var first = array[0];
    var date = new Date(first);
    return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate();
  }
  else
    return '';
});

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
    //url: "http://127.0.0.1:8080/schedules/streetsweeping",
    data: address,
    success: function(schedules){
      console.log("Success getting data from server: " + JSON.stringify(schedules));
      // Add a method used as a conditional in mustache
      $.each(schedules, function(index, schedule){
        schedule.hasUpcoming = function(){
          return schedule.upcoming.length > 0;
        }
      });

      schedules.notEmpty = function(){
        return schedules && schedules.length > 0;
      };

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
