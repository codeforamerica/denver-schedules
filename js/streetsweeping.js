Handlebars.registerHelper("first", function(array) {
  if(array && array.length > 0)
    return array[0];
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
      loadData(geocoder.parse(data));
    },
    error: function(error){
      console.log(JSON.stringify(error));
    }
  });
}

function loadData(address){
  var source   = $("#route-template").html();
  var template = Handlebars.compile(source);
  $.ajax({
    //url: "http://staging-denver-now-api.herokuapp.com/streetsweeping",
    url: "http://127.0.0.1:8080/streetsweeping",
    data: address,
    dataType: 'jsonp',
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
      
      $('#results').html(template(schedules));
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