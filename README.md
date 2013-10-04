files
=====

Front-end development files for individual CollegiateText school sites.

`files` holds all necessary front-end development files, including relevent HTML templates, CSS, Javascript, images, that are either the same across all sites, or site-specific.

Using the `files.git` offers the following benefits:

- Rapid data propagation to all individual CollegiateText school-specific sites.
- Modular front-end development.
- Collaborative tools available via GitHub.

Organization
----------

`files` contains two directories, `common`, and `schools`

Each are structured in a typical Node/Express application layout:

    common
    |
    ---->  /public
        |
        ----> /img  (All images)
        |
        ----> /css  (All CSS files)
        |
        ----> /js   (All Javascript files)
    |
    ---->  /views
        |
        ----> (All Hogan templates rendered by Express)

`common` is meant to contain all files needed for the base individual CollegiateText school site.

When a new site is instantiated, it is populated with all files from `common`. After this process has been completed, files are then overwritten by a similar file pull from the school-specific directory within `schools`.

`schools` contains one directory for each supported school. For instance, were Tufts University supported, the layout would be as follows:

    schools
    |
    ----> /tufts
        |
        ----> /public
        |
        ----> /views

Where `/app` and `/tmp` follow the same structure as outlined in the `common` example above.

Configuration
----------

In the root directory of `common`, there exists `config.js`, which holds global strings used by `refresh_cache.js`.

You can change the database it gets data from or the school you're querying from there. It's meant to be the only file that needs to be changed for each school-specific instance.

Installation
---------

`npm` has a series of dependencies for `files`:

    connect-redis
    express
    hjs
    pg
    redis
    nodemon

Be sure to `npm install` each when installing on a new system, or it may break.

The system also has dependencies:

    redis

After installing dependencies, you'll need to start up your cache. You can do that with the command `redis`.

If you've already run `refresh_cache.js` before, but changed your configuration, be sure to run `sh clear_cache` (in the `scripts` directory) to clear your cache before re-running `refresh_cache.js`, or your configuration options will add data to the cache instead of replacing it.

Once configured (editing `config.js` in root), run `node refresh_cache.js` from the root directory. This will populate your cache with data from the configured database and configured school.

Once set up, run `sudo node app.js` to start the server. (I'd recommend using `nodemon` a la `sudo nodemon app.js` so you can re-deploy automatically on file changes).

Authors
----------

- James Roseman (<james.roseman@gmail.com>)
- Anthony Cannistra (<tony.cannistra@gmail.com>)
