var shortest_demo_ever = true, demoing_ajax_call_test = false, demoing_ajax_websocket = false;
/**
 * Welcome to Pebble.js modified for PebbleBE!
 *
 * This is where you write... where we understand an app.
 */

var UI = require('ui');
var main = new UI.Card({
  subtitle: 'Hello PebbleBE!'
});
main.show();
if (shortest_demo_ever) return; // that's it, shortest app! We can have drinks and go home.

/* Questions :
- where did lines 7 to 10 happen?
- where did line 11 happen?
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
function demo_websocket(){
  var card = new UI.Card();
  card.title('Websocket demo');
  card.subtitle('Let\'s connect!');
  card.body('Oops I did not have the time to do that, sorry :)');
  card.show();
}

/* Finished? Just for tonight.

For more see the github : ... (to add)

More questions? https://developer.pebble.com
Still more? https://pebbledev.slack.com