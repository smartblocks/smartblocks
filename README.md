#smartblocks

Smartblocks is a web framework for Node.js made to help the developer build modular web applications, that run in
the form of Single Page Applications.

Its philosophy is to divide your features into several feature blocks, that will be easy to reuse and share. It
provides a strong basic structure for your apps, so that it may be easier to work in several teams for bigger projects.

It is based on Express and several other cool Node projects for the back end, and on Backbone.js / Require.js an such
for the front-end. To hold data, it is currently based on MongoDB.

##Getting started

###Installation

> Please make sure you installed MongoDB and that it is running before trying to start the web app.

To install and try the current developer nightly of SmartBlocks, run the following command :

    npm install smartblocks

Then, to create a smartblocks project, run this command :

    smartblocks init myawesomeproject

Now go in the created directory.

    cd myawesomeproject

Then you can start the web app to see if the install worked :

    smartblocks start

You should see something like this in the console :

    Web app starting, use Ctr-C to stop
     __   __   __
    |__| |__| |__|
     __   __   __
    |__| |__| |__|
     __   __   __
    |__| |__| |__|
     SMART BLOCKS
    Running on 3000

You can then go to [http://localhost:3000][1]. You should see a welcome page.

###How to use

####Directory structure

When you first init a smartblocks project, you'll get the following folder structure :

    projectname/
        blocks/
            main/
                ...
        config/

The blocks folder contains all the blocks.

A block is a feature module. It contains a backend, and a frontend.

The backend contains data models and controllers
to access them via a Json Restful api.

The frontend, based on Backbone.js and Require.js, contains :

- backbone models, linked with backend models
- backbone collections, linked with backend models
- front end apps, which are basically screens that are put in the DOM by the smartblocks framework according
  to really simple routing rules.

####How it works

When a user calls the root url :

    http://yoursite/

An html page is loaded. This page contains references to the smartblocks front-end framework. The latter
will initialize everything, by :

- loading apps, and blocks, and their data
- creating a SmartBlocks object
- initializing a basic Backbone router

Once all that's done, an entry screen is put in the DOM.

#####Using the SmartBlocks object

The SmartBlocks object is the center of everything in the front-end. It is structured in the following way :



#####Routing

Everything runs in a single page. Screens, or apps, are loaded into the DOM according to the url parameters given
after the '#', like that :

    http://yoursite#mySampleApp/aparam/anotherparam

This will load the app called "mySimpleApp", with the url parameters "aparam", and "anotherparam".




####Managing the main block

####Creating your own first block

To create a block, go to the project folder and enter the following command :

    $ smartblocks generate_block

You'll be asked the name of the block. This will create the following folder structure in your project :

    blocks/
        ...
        blockName/
            frontend/
                apps/
                collections/
                models/
                index.js
                index.less
            backend/
                models/
                controllers/
            descriptor.json
        ...

**descriptor.json**

This file contains information for the block to work in the front-end. It contains information about
launchable apps, available types and so on. It's structured like this :

    {
        "name": "block_name",
        "description": "",
        "apps": [
            {
                "name": "app1",
                "entry_point": "launch_app1"
            },
            {
                "name": "app2",
                "entry_point": "launch_app2"
            },
            {
                "name": "app3",
                "entry_point": "launch_app3"
            },
            ...
        ],
        "types": [
            {
                "name": "Type",
                "plural": "Types"
            }
        ]
    }

**frontend folders**

The front end folder is a static file folder. Any file placed in it is accessible to http requests through :

    http://yoursite/blockName/[file]

It is pre-configured with :
|  Name | Use |
| --- | ---- |
| apps folder          |  This folder will contain app folders. Each app will contain views, style files and templates. |
| collections folder   | This folder will contain Backbone collection files associated with each type. |
| models folder        | This folder will contain Backbone model files associated with each type.|
| index.js             | This is the entry point of the block. It contains an init method, called during the page initialization, and methods to launch each app.|
| index.less           | This is the entry point for the style. It will contain Less imports for every style file in the block folder.|

**backend folder**






##License

Smartblocks is licensed under the AGPL v3.0 license.
[http://www.tldrlegal.com/l/AGPL3][2]

##More information about Smartblocks

We're working on the official website where there will be more docs and stuff.
We're thinking about making a features store ;).

[1]:http://localhost:3000
[2]:http://www.tldrlegal.com/l/AGPL3
