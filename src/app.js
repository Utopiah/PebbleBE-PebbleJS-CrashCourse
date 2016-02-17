var shortest_demo_ever = true, demoing_ajax_call_test = false, demoing_ajax_websocket = false;
/**
 * Welcome to Pebble.js modified for PebbleBE!
 *
 * This is where you write... where we understand an app.
 * 
 * Do not just watch, import and try LIVE! https://goo.gl/D8ZWUd
 *   https://github.com/Utopiah/PebbleBE-PebbleJS-CrashCourse
 *
 */

var UI = require('ui');
var main = new UI.Card({
  subtitle: 'Hello PebbleBE!'
});
main.show();
if (shortest_demo_ever) return; // that's it, shortest app! We can have drinks and go home.

/* Questions :
- where did lines 12 to 15 happen?
- where did line 16 happen?
*/














// Learning the CloudPEbble interface.
var warning; // see the icon on the left
error();







//... ok now that would be a bit boring wouldn't it?












// Ok first we can improve the UI a bit.
// (don't forget to comment out the return to remove the warning)

main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello PebbleBE!',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
main.show();











// So we know how to display text but ... we can't interact yet.
// Let's push buttons :
main.on('click', 'up', function(e) {
  if (demoing_ajax_call_test) { ajax_call_demo(); return; }
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    // so... what happened? Let's check out the console.
    // Wait what, there is a console? Nobody told me (cf compilation "View app logs")
  });
  menu.show();
});
/* Questions :
- why is the on event applied to main?
- what's the main difference between the Card card and the Menu card?
*/








// Yet a bit more visuals :
var Vector2 = require('vector2');
main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});
/* Questions :
- what does this remind you to in CSS?
*/







// And finally the last button.
main.on('click', 'down', function(e) {
  if (demoing_ajax_websocket) { demo_websocket(); return; }
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});











/* *********************************************************** */
/*              Going further : Pebble functions               */
/* *********************************************************** */

console.log(Object.getOwnPropertyNames(Pebble));

/*

returns
  sendAppMessage
  showSimpleNotificationOnPebble
  getWatchToken
  addEventListener
  removeEventListener
  getTimelineToken
  timelineSubscribe
  timelineUnsubscribe
  timelineSubscriptions
  getActiveWatchInfo https://developer.pebble.com/guides/pebble-apps/pebblekit-js/adding-js/#getting-watch-information
  platform

used before
  openURL (opens a URL on the phone, used for configuration)
  getAccountToken (return a unique ID attached to the account, useful for auth)

Note that it doesn't show the events one can subscribe to (on click, on tap, etc).

More details https://developer.pebble.com/docs/js/Pebble/
*/








/* *********************************************************** */
/*                Going further : AJAX call                    */
/* *********************************************************** */
// Basically relying on https://github.com/Utopiah/PebblePIM-Consult
// Accessing very quickly the last editions of my wiki.

var ajax = require('ajax');
// related official tutorial https://developer.pebble.com/tutorials/pebble-js-tutorial/part1/
var URL = 'http://fabien.benetou.fr/Site/AllRecentChanges?action=rss';
// could rely on https://www.google.org/flutrends/about/data/flu/be/data.txt in order to make a more eHealth related example.
var pagePrefix = 'http://fabien.benetou.fr/';
// should be configurable

var pages = [];
var pageName = "";
var AjaxCard = new UI.Menu({ sections: [{ title: "Pages:", items: pages }] });

ajax({url: URL, type: 'data'},
// Be cautious, this takes time!
  function(data) {
    // Data is supplied here
    var items = data.split('<item>');
    for (var item in items){
      pageName = items[item].substring(items[item].indexOf("<link>")+6+pagePrefix.length ,items[item].indexOf("</link>"));
      console.log(pageName);
      pages.push({title: pageName});
      // might prefer to limit to 5 instead of 10-ish
    }
    pages.shift();
        
    AjaxCard.on('select', function(e) {
        console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
        console.log('The item is titled "' + e.item.title + '"');
        Pebble.openURL(pagePrefix+e.item.title);
      // appends return_to to the URL
    });
  },
  function(error) {
    console.log('Ajax failed: ' + error);
  }
);

function ajax_call_demo(){
  AjaxCard.show();
  // Display the Card
}










/* *********************************************************** */
/*                Going further : websockets                   */
/* *********************************************************** */
// Basically relying on https://github.com/Utopiah/PebblePIM
// Sending memorable happy moment to my server for later reviewing.

// here we must start the websocket server on the right port and IP

function demo_websocket(){

  var ws = new WebSocket('ws://fabien.benetou.fr:8889');
// Replace with IP/hostname of computer running server

var connected = false;
console.log('Connecting...');

ws.onopen = function () { 
  console.log('inside the onconnect event');
  ws.send(JSON.stringify('pebble connected'));
  connected = true;
};

var Vibe = require('ui/vibe');

var websocketCard = new UI.Card({
  title: 'Connected (v2026)',
  icon: 'images/menu_icon.png',
  subtitle: 'Waiting for data',
  body: 'Press up, middle or down buttons to send data.'
});

websocketCard.show();

ws.onmessage = function (event) { 
    websocketCard.body(event.data);
    // To verify that this is working, type something like PebbleBE on the server prompt
    console.log(event.data);
    // Or... something more fun!
  if (event.data.toString()=="vibrate\n"){
    Vibe.vibrate('long');
    // Send a long vibration to the user wrist
  }
};

websocketCard.on('click', function(e) {
  websocketCard.subtitle('Button ' + e.button + ' pressed.');
  if (connected){
    // so we can receive data but we can also... send data
     ws.send(e.button + ' button pressed ');
  }
});

var Accel = require('ui/accel');
Accel.on('tap', function(e) {
  console.log('Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
  if (connected){
     ws.send('Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
    // if fact we can send more than just button press.
  }
});


}
















/* *********************************************************** */
/*                Finished? Just for tonight.                  */
/* *********************************************************** */
/*

All the code available : https://goo.gl/D8ZWUd
    https://github.com/Utopiah/PebbleBE-PebbleJS-CrashCourse
More questions? Skim through https://developer.pebble.com
Still more? Chat on https://pebbledev.slack.com
Prefer local, check @Pebble_BE on Twitter: https://twitter.com/Pebble_BE

*/