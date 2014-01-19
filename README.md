smartblocks
============
------------------------------------

Smartblocks is a web framework for Node.js made to help the developer build modular web applications, that run in
the form of Single Page Applications.

Its philosophy is to divide your features into several feature blocks, that will be easy to reuse and share. It
provides a strong basic structure for your apps, so that it may be easier to work in several teams for bigger projects.

It is based on Express and several other cool Node projects for the back end, and on Backbone.js / Require.js an such
for the front-end. To hold data, it is currently based on MongoDB.

#Getting started
------------------------------------

##Installation

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

##SmartBlocks' structure
-----------------------------------------------------------------

###Logic

SmartBlocks allows you to create complex Single Paged Applications.

It revolves around the concept of **blocks**. In SmartBlocks, a block is a feature module.

Whenever you want to develop a feature for your website, and that you thing that it could be reused somewhere else,
create a new block. That block can later be dropped in another project, which makes you gain a significant ammount of
time.

A SmartBlocks project contains one block or more. There is always a central block, or main block that ties everything
together. It contains, for example, the global styling, which brings coherence to your website, the entry app
(kind of like a homepage), code that inserts a navigation menu, an "About" page, and so on... Things that are specific
to your current website, and that couldn't be reused elsewhere.

Then there are other blocks, each one containing reusable features. For example, a "Contact us" block, that will
contain :

- a front-end app allowing your users to send you messages,
- a front-end app, restricted to your admins, listing the messages,
- a back end that handles and stores the messages

In the future, when you're creating a new website, you'll be happy to be able to reuse that same block.

###Directory structure

When you first init a smartblocks project, you'll get the following folder structure :

    projectname/
        blocks/
            main/
                ...
        config/

The blocks folder contains all the blocks.

###Blocks

A block is a feature module. It's represented by a directory in the blocks folder. It's structured in the following way :

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



**Block backend**

The backend contains data models and controllers
to access them via a Json Restful api.

The frontend, based on Backbone.js and Require.js, contains an entry point, hooks to the backend data and apps.

*descriptor.json file*



**Block frontend**

*Folder structure*
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


*Initialization*

When a user calls the root url :

    http://yoursite/

An html page is loaded. This page contains references to the smartblocks front-end framework. The latter
will initialize everything, by :

- loading apps, and blocks, and their data
- creating a SmartBlocks object
- initializing a basic Backbone router

Once all that's done, an entry screen is put in the DOM.

*The SmartBlocks object*

The front-end revolves around a public object, **SmartBlocks**.

In this object, you'll find all the data you need, preloaded in the way prescribed by your backend controllers.

The object's structure is the following :

    SmartBlocks
        .Methods : contains global methods
            .render(html) : renders html in the screen
        .Data : contains the default data
            .users : a backbone collection of all the users
        .Blocks : contains all the blocks
            .ExampleBlock
                .Models : contains all the Backbone Models of that block
                    .ExampleModel
                .Collections : contains all the Backbone Collections of that block
                    .ExampleModels
                .Data : contains Backbone collections of the data loaded in the clien
                    .examplemodels
                .Main : contains all the methods in the block's index.js file

For example, let's say you have a blog block, and that you want to access all the posts. You'd do something like this :

    var posts_array = SmartBlocks.Blocks.Blog.Data.posts.models

Then you'd be able to loop through the posts_array and work with the data.


###Creating your own first block

####Automated creation
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

#####Working in the front-end : creating an app.

Now that we have a backend that stores tasks to do, we're going to create an app to interact with them.

The first thing you need to do to add an app in the front-end is to edit the block's descriptor.json, and add the name
of that app :

     "apps": [
           ...
            {
                "name": "todolist",
                "entry_point": "launch_todolist"
            }
        ],

Then, open the index.js file in the frontend folder. Add the launch method in the main object :

    init: function () {
        ...
    },
    ...
    launch_todolist: function (app) {

    }
    ...

This method is now called when the user accesses the following address :

    http://yoursite#todolist

Right now, this method does nothing, which is not very impressive. What we want to do is to call a Backbone view
and put it in the DOM, to enable the user to interact with the app.

Let's say that our app

We're going to create the following folder structure in the frontend/apps folder :

    apps/
        todolist/
            style/
                main.less
            templates/
                main.html
            views/
                main.js


In the main.js file, put the code for a Backbone view like that :

#License

Smartblocks is licensed under the AGPL v3.0 license.
[http://www.tldrlegal.com/l/AGPL3][2]

#More information about Smartblocks

We're working on the official website where there will be more docs and stuff.
We're thinking about making a features store ;).

[1]:http://localhost:3000
[2]:http://www.tldrlegal.com/l/AGPL3
