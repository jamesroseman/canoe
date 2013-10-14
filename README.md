canoe
=====

Restaurant and hotel finder for the stuck traveller.

Canoe is a Google Maps-based web application that allows users to see what restaurants and hotels are around various hotels.

Implementation
----------


Configuration
----------

In the root directory of `common`, there exists `config.js`, which holds global strings used by `refresh_cache.js`.

You can change the database it gets data from or the school you're querying from there. It's meant to be the only file that needs to be changed for each school-specific instance.

Installation
---------

Be sure to `npm install` each when installing on a new system, to catch up on dependencies.

The system also has dependencies:

    redis
    grunt

After installing dependencies, you'll need to start up your cache. You can do that with the command `redis` or `redis &`.

Once dependencies are installed, server can be deployed by using `grunt sass && grunt uglify && sudo grunt start`.

Authors
----------

- James Roseman (<james.roseman@gmail.com>)
