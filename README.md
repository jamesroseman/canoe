canoe
=====

Restaurant and hotel finder for the stuck traveller.

Canoe is a Google Maps-based web application that allows users to see what restaurants and hotels are around various airports.

Interface
----------

The markers on the map represent restaurants (red) and hotels (blue).

Because of the way the Yelp! API is configured, I had to use a third-party geolocation service. Because of this, I couldn't do all I wanted to. I had originally wanted a searchbar using `typeahead.js` by Twitter to auto-complete searches for IATA codes or airport names. When you clicked on an airport, it'd readjust the map and create new markers. I talked to a representative at KAYAK (Vinayak Ranade) about this, who gave me a feasible work-around. 

Implementation
----------

I used `node.js` because it's what I have used for the majority of web applications I've done.

I used `express` as the framework on top of it, `SocketIO` for client-server communication, `events` for server-server communication, `redis` as a cache. 

Authors
----------

- James Roseman (<james.roseman@gmail.com>)
