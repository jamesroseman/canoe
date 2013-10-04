/* jshint node: true */

var request = require('request'),
	events = require('events'),
	inspect = require('eyespect').inspector(),
	interfaceAddresses = require('interface-addresses'),
	addresses = interfaceAddresses();


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {ip: addresses.vnic0});
};