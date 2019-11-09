// /public/javascript.js

// Get the current username from the cookies
var user = cookie.get('user');
if (!user) {

  // Ask for the username if there is none set already
  user = prompt('Choose a username:');
  if (!user) {
    alert('We cannot work with you like that!');
  } else {
    // Store it in the cookies for future use
    cookie.set('user', user);
  }
}


// Connect to the server-side websockets. But there's no server yet!
var socket = io();

var $chat = $('#chat');

// The user count. Can change when someone joins/leaves
socket.on('count', function (data) {
  $('.user-count').html(data);
});


//Sanitizing user input
function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) &&  // lower alpha (a-z)
        !(code == 32 || code == 33 || code == 44 || code == 46 || code == 63))// space, exclamation point, comma, period,  and question mark
        {return false;}
  }
  return true;
};

// When we receive a message
// it will be like { user: 'username', message: 'text' }
socket.on('message', function (data) {
  $('.chat').append('<p><strong>' + data.user + '</strong>: ' + data.message + '</br>' + '<sup>Sent on ' + data.date + '</sup>' + '</p>');
});


//To retrieve date
function getDate(){
  var today = new Date().toLocaleString();
  return today;
}


// When the form is submitted
$('form').submit(function (e) {
  // Avoid submitting it through HTTP
  e.preventDefault();
  // Retrieve the message from the user
  var message = $(e.target).find('input').val();
  //Don't take unsafe inputs
  if(!isAlphaNumeric(message)){
    alert("Please use only Alpha-numeric characters and . , ! ?")
  }else{
  //Send the message to the server
  socket.emit('message', {
    user: cookie.get('user') || 'Anonymous',
    message: message,
    date: getDate()
  });


  }


  // Clear the input and focus it for a new message
  e.target.reset();
  $(e.target).find('input').focus();
});
