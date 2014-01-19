#Smartblocks
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

##Logic

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

##Directory structure

When you first init a smartblocks project, you'll get the following folder structure :

    projectname/
        blocks/
            main/
                ...
        config/

The blocks folder contains all the blocks.

##Configuration



##Blocks

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



###Block backend

The backend contains data models and controllers
to access them via a Json Restful api.

The frontend, based on Backbone.js and Require.js, contains an entry point, hooks to the backend data and apps.

####descriptor.json file

The descriptor.json file contains the configuration of your block. It contains :

- the name of the block
- an array of apps, that is to say screens that are to be launched in the front-end
- an array of types, representing the models of the backend, to make them accessible in the front end

####models

Models represent the data of the block in the backend. They are based on [node-orm 2][7]. Read their documentation for
more information on retrieving models, saving and so on. They are structured like this :

    //backend/models/Book.js
    module.exports = function (db, cb) {
        db.define('Book', {
            name: String,
            content: String
        });
        return cb();
    };


####controllers

Controllers are what allows a block to serve a restful API to access the model data. You'll usually have one controller
per model.

They are structured like this, if we take the example of the Book model.

    module.exports = {
        //Accessible through GET http://yoursite/blockname/controllername
        index: function (req, res) {
            //get a list of books
            res.json(books);
        },
        //Accessible through GET http://yoursite/blockname/controllername/[someid]
        show: function (req, res) {
            //get a spectific book's data, thanks to the given req.params.id
            res.json(book);
        },
        //Accessible through POST http://yoursite/blockname/controllername
        create: function (req, res) {
            //create a book based on the data passed in req.body (e.g. req.body.content, or req.body.title)
            res.json(book);
        },
        //Accessible through PUT http://yoursite/blockname/controllername/[someid]
        update: function (req, res) {
            //update a book based on req.body and req.params.id
            res.json(object);
        },
        //Accessible through DELETE http://yoursite/blockname/controllername/[someid]
        destroy: function (req, res) {
            //delete a book based on req.params.id
            res.json(object);
        },
        //custom method, accessible through http://yoursite/blockname/controllername/actions/mymethod
        mymethod: function (req, res) {
            res.send(200, 'hello');
        }
    };

###Block frontend

*Folder structure*
The front end folder is a static file folder. Any file placed in it is accessible to http requests through :

    http://yoursite/blockName/[file]

It is pre-configured with :

**Name** | **Use**
--- | ----
**apps/**          |  This folder will contain app folders. Each app will contain views, style files and templates.
**collections/**   | This folder will contain Backbone collection files associated with each type.
**models/**        | This folder will contain Backbone model files associated with each type.
**index.js**             | This is the entry point of the block. It contains an init method, called during the page initialization, and methods to launch each app.
**index.less**           | This is the entry point for the style. It will contain Less imports for every style file in the block folder.


####Initialization

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


##Creating your own first block
-----------------------------------------------------------------

##Automated creation
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



##Working in the front-end : linking data and creating an app.

Please note that to work with the SmartBlocks front-end, you have to be used to [Backbone][3], [Underscorejs][4] and [Requirejs][5].
If you're not, it is recommended to read their docs first.

###Adding the frontend model and collection for tasks

To add the frontend model, create a file in TaskManager/frontend/models called Task.js, containing :

    define([
        'underscore',
        'backbone'
    ], function (_, Backbone) {
        var Model = Backbone.Model.extend({
            default: {

            },
            urlRoot: "/TaskManager/Tasks"
        });
        return Model;
    });

To add the frontend collection, create a file in TaskManager/frontend/collections called Tasks.js, containing :

    define([
        'jquery',
        'underscore',
        'backbone',
        '../models/Task'
    ], function ($, _, Backbone, Task) {
        var Collection = Backbone.Collection.extend({
            model: Task,
            url: "/TaskManager/Tasks"
        });

        return Collection;
    });

That will allow you to use the data loaded from the backend's Tasks controller index action like this

    var tasks = SmartBlocks.Blocks.TaskManager.Data.tasks
    //tasks is a Backbone collection containing instanciated Backbone models, representing the tasks

Let's say that you have a task with the id "90a12b83". To get its name, you'll just have to do

    var task = SmartBlocks.Blocks.TaskManager.Data.tasks.get('90a12b83');
    alert(task.get('name'));

###Creating the app

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


First, let's create a template that will hold you tasks and allow the user to create some, in main.html

    <h3>Tasks</h3>
    <ul>
        <% for (var k in tasks) { %>
            <li><%= tasks[k].get('name') %></li>
        <% } %>
    </ul>
    <input type="text" class="task_input" /><button class="add_button">Add</button>

In the main.js file, put the code for a Backbone view like that :

    define([
        'jquery',
        'underscore',
        'backbone',
        'text!../templates/main.html' //This adds a reference to the template main.html. The 'text!' indicates
                                      // that it shall be treated as raw text
    ], function ($, _, Backbone, main_tpl) {
        var View = Backbone.View.extend({
            tagName: "div",
            className: "books_explorer",
            initialize: function () {
                var base = this;
            },
            init: function () {
                var base = this;
                base.render();
                base.registerEvents();
            },
            render: function () {
                var base = this;

                //This gets all the tasks loaded from the backend
                var tasks = SmartBlocks.Blocks.TaskManager.Data.tasks.models;
                //This computes the html, thanks to the Underscore template method. It uses the template loaded
                //at the top of the file (main.html)
                var template = _.template(main_tpl, {
                    tasks: tasks
                });
                //This puts the computed html in the view's main element
                base.$el.html(template);
            },
            registerEvents: function () {
                var base = this;

                //This adds an event listener when a click is triggered on the button
                base.$el.delegate('.add_button', 'click', function () {
                    var task_name = base.$el.find('.task_input').val();
                    var task = new SmartBlocks.Blocks.TaskManager.Models.Task({
                        name: task_name
                    });
                    task.save({}, {
                        success: function () {
                            //This adds the saved task in the main collection :
                            SmartBlocks.Blocks.TaskManager.Data.tasks.add(task);
                            //This rerenders the view so that the new task is displayed
                            base.render();
                        }
                    });
                });
            }
        });

        return View;
    });

The init method has to be called right after the view has been inserted in the Dom. That
way, things rendered in the render method will be displayed right away, and the events registered in registeredEvents
will be correctly linked.

To display the view when the app is launched (when the #todolist url is called), add a reference to it at the top
of **index.js** :

    define([
        './apps/todolist/views/main'
    ], function (LibraryView, TodolistView) {
        var main = {
            init: function () {

            },
            launch_todolist: function (app) {
                var todolist_view = new TodolistView();
                SmartBlocks.Methods.render(todolist_view.$el);
                todolist_view.init(app);
            }
        };
        return main;
    });

And that's it ! You can now run

    $ smartblocks start

in your project's folder, and go right to [http://localhost:3000#todolist][6] to see the result.

###Creating an entry app.

If you want an app to become the homepage (shown when you call http://yoursite), you have to edit in the configuration
file /config/index.js, the field :

    all: {
            site: {
                title: "Your site Title"
            },
            frontend: {
                startup_app: {
                    block: 'main', //the block hosting the homepage app
                    app: 'home' // the name of the homepage app
                }
            }
        },

#License

Smartblocks is licensed under the AGPL v3.0 license.
[http://www.tldrlegal.com/l/AGPL3][2]

#More information about Smartblocks

We're working on the official website where there will be more docs and stuff.
We're thinking about making a features store ;).

[1]:http://localhost:3000
[2]:http://www.tldrlegal.com/l/AGPL3
[3]:http://backbonejs.org/
[4]:http://underscorejs.org/
[5]:http://requirejs.org/
[6]:http://localhost:3000#todolist
[7]:https://github.com/dresende/node-orm2