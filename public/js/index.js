/* jshint node: true */

$(document).ready(function(){
	var socket = io.connect('http://'+$('.ip_addr').text());
	$('.ip_addr').remove();
});

/*
	This is an example of a Typeahead module in use on the index page. 
	You'd also have to include the Dust for the Typeahead, and then uncomment this block.

var typeahead = $('.typeahead').typeahead({
  name: 'langs',
  remote: '../api/query/%QUERY',
  valueKey: 'full_num',
  template: [
    '<p class="suggest_tRight">{{inst}} | {{num}}-{{sec}}</p>',
  ].join(''),
  engine: Hogan,
  limit: 50
});
*/