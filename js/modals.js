doPopUp = function() {
  $('#myModal').modal('show')
};

showFeedbackForm = function() {
  $('#feedbackModal').modal('show')
};


// Post feedback to Google Spreadsheet
validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

postContactToGoogle = function (){
  var name = $('#fb-name').val();
  var email = $('#fb-email').val();
  var comment = $('#fb-comment').val();
  if ((name !== "") && (email !== "") && ((comment !== "") && (validateEmail(email)))) {
      $.ajax({
          url: "http://street-sweeping-feedback-proxy.herokuapp.com/",
          data: {"entry.1182307246" : name, "entry.2133523498" : email, "entry.694895573": comment},
          type: "POST",
          dataType: "json",
          crossDomain: true,
          statusCode: {
              0: function (){

                  $('#fb-name').val("");
                  $('#fb-email').val("");
                  $('#fb-comment').val("");
                  //Success message
              },
              200: function (){
                  $('#fb-name').val("");
                  $('#fb-email').val("");
                  $('#fb-comment').val("");
                  //Success Message
              }
          }
      });
  }
  else {
      //Error message
  }
};