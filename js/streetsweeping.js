//read in config vars from a json and put them in a global window variable
$.getJSON( "./js/config.json", function(config){
  window.config = config;
});

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
  if(date) {
    date = new Date(date);
    return date.getDayFull() + ", " + date.getMonthFull() + " " + (date.getDate() +1);
  }
  else
    window.nightly = true;
    return "nightly";
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
  $('#address').val('942 S Pearl St, Denver, CO');
  $('#results').html('<div class="text-center"><img src="img/loading.gif" /></div>');
  $('#submit').click();
}

function validGeo(address) {
  return (address && address.longitude && address.latitude);
}

function validEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// TODO: use google's library:
// https://code.google.com/p/libphonenumber/source/browse/#svn%2Ftrunk%2Fjavascript
function validPhone(phone) {
  var justNumbers = phone.replace(/[^0-9]/g, '');
  return justNumbers.length == 10;
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
      console.log('geocode: ' + JSON.stringify(data));
      if( data.length > 0 && data[0].address.road) {
        //address is valid
        loadData(geocoder.parse(data));
      }
      else {
        //address is not valid
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
  var routeTemplate = Handlebars.compile(routes);

  // check if we have a valid lat/long combo before hitting our endpoint
  if (validGeo(address)) {
      $.ajax({
        url: config.baseUrl + "/schedules/streetsweeping",
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
            schedules.error = config.errors.address['no-data-on-address'];
          }

          //sort dates in ascending order based on the first date in the upcoming list
          schedules.sort(function(x, y){
            return new Date(x.upcoming[0]) - new Date(y.upcoming[0]);
          })

          //set next sweeping date and pass it to the view
          if (schedules.validAddress) {
              schedules.nightly = schedules[0].error == 'Nightly';

              schedules.nextSweeping = {
              "date" : schedules[0].upcoming[0],
              "name": schedules[0].name,
              "description": schedules[0].description
              };

          }
          $('#results').html(routeTemplate(schedules));
          $('#results').attr('data-model', JSON.stringify(schedules));
          // $('#notes').html(notesTemplate(schedules));
        },
        error: function(schedules){
          console.log('WARNING Error: ' + JSON.stringify(schedules));
          schedules.validAddress = false;
          schedules.error = config.errors.address['invalid-address']
          $('#results').html(routeTemplate(schedules));
          // $('#notes').html(notesTemplate(schedules));
        }

      });
  } else {

    var schedules = {};
    schedules.error = config.errors.address['invalid-address'];
    $('#results').html(routeTemplate(schedules));
  }

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

function createReminders(reminderType) {
  $('#reminder-error').html('');
  var url = config.baseUrl + "/reminders/" + reminderType;
  var data = JSON.parse($('#results').attr('data-model'));
  var contact = $.trim($('#' + reminderType).val());
  var valid = reminderType == 'email'? validEmail(contact) : validPhone(contact)

  if(!valid)
  {
    //add an alert to the view  the address is not valid
    $('#reminder-alerts').removeClass()
                              .addClass('alert alert-danger')
                              .fadeIn(300)
                              .html('<h4>' + config.errors.reminder['invalid-' + reminderType] + '</h4>')
                              .fadeOut(5000);
  } else {
    //add an alert to the view  the address is not valid
    $('#reminder-alerts').removeClass()
                              .addClass('alert alert-success')
                              .fadeIn(300)
                              .html('<h4>' + config.errors.reminder['valid-' + reminderType] + '</h4>')
                              .fadeOut(5000);

    // TODO: Write an action that takes a collection of reminders
    $.each(data, function(index, street){
      var upcoming = street.upcoming;
      var firstDate = new Date(street.upcoming[0]);
      
      var readableDate = firstDate.getDayAbbrev() + ", " + firstDate.getMonthAbbrev() + " " + (firstDate.getDate() +1 );
      var message = config.reminders[reminderType+"1"] + readableDate + config.reminders[reminderType+"2"] + street.description + config.reminders[reminderType+"3"] + street.name + config.reminders[reminderType+"4"];

      $.each(upcoming, function(index, d){
        createReminder(contact, message, d, url);
      });
    });

    $('#reminder-error-alert').removeClass('hidden');
    $('#reminder-error').html("Reminders created for " + contact + ".");

    $('#' + reminderType).val('');
  }
}

function createReminder(contact, message, date, url) {
  var reminder = {
    "contact" : contact,
    "message" : message,
    "remindOn" : date,
    "address" : $('#address').val()
  };

  $.ajax({
    type: "POST",
    url: url,
    data: reminder,
    success: function(response){ reminderAdded(response) },
    error: function(reminder){ reminderNotAdded(response) }
  });
}

function reminderAdded(response) {
  console.log("Added reminder " + JSON.stringify(response));
}

function reminderNotAdded(reminder){
  // TODO: How does this app log errors?
  console.log("WARNING: Didn't add reminder " + JSON.stringify(reminder));
}






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


    $('#welcomeModal').modal('show');

  });
