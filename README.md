##Smartblocks
------------------------------------

Smartblocks is a web framework for Node.js made to help the developer build modular web applications, that run in
the form of Single Page Applications.

Its philosophy is to divide your features into several feature blocks, that will be easy to reuse and share. It
provides a strong basic structure for your apps, so that it may be easier to work in several teams for bigger projects.

It is based on Express and several other cool Node projects for the back end, and on Backbone.js / Require.js and such
for the front-end. To hold data, it is currently based on MongoDB, but can be plugged to other database systems thanks
to [node-orm2][10].

###Getting started
------------------------------------

^###Installation

> Please make sure you installed [MongoDB][12] and that it is running before trying to start the web app.
> You also need to install [PhantomJs][9] for everything to work nicely.

To install and try the current version of SmartBlocks, run the following command :

```sh
$ npm install -g smartblocks
```


Then, to create a smartblocks project, run this command :

```sh
$ smartblocks init myawesomeproject
```

Now go in the created directory.

```sh
$ cd myawesomeproject
```

Then you can start the web app to see if the install worked :

```sh
$ smartblocks start
```

You can add a mode to that command. The default mode is 'local', and makes your app run on the port 3000.
The other modes are : 'staging' (4000) and 'production' (5000)

You should see something like this in the console :

```sh
Web app starting, use Ctr-C to stop
 __   __   __
|__| |__| |__|
 __   __   __
|__| |__| |__|
 __   __   __
|__| |__| |__|
 SMART BLOCKS
Running on 3000
```

You can then go to [http://localhost:3000][1]. You should see a welcome page.

###SmartBlocks' structure
-----------------------------------------------------------------

###Logic

SmartBlocks allows you to create complex Single Paged Applications.

It revolves around the concept of **blocks**. In SmartBlocks, a block is a feature module.

Whenever you want to develop a feature for your website, and that you think that it could be reused somewhere else,
create a new block. That block can later be dropped in another project, which makes you gain a significant amount of
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
        layouts/
            index.hjs
            style/
                index.less

The blocks folder contains all the blocks.

###Configuration

To configure a SmartBlocks project, go to the **config** folder. There, you'll find the file **index.js**.

This file currently allows you to :

- configure the database connection
- configure which app is launched for the root address (startup_app)
- set the name of your website.

It is structured in the following way :

```javascript
var config = {
    all: {
        //app state agnostic configuration
    },
    local: {
        //development configuration
    },
    staging: {
        //staging configuration
    },
    production: {
      //production configuration
    }
};

module.exports = function (mode) {
    var object = config[mode || process.argv[3] || 'local'] || config.local
    for (var k in config.all) {
        object[k] = config.all[k];
    }
    return object;
};
```

It returns the configuration object according to the app mode string given. The object will be a merge between
the 'all' object and the object corresponding to the app mode.

For example, if you launch your app with the 'staging' parameter, you'll get a merge between the 'all' object
and the 'staging' object.

The 'all' object contains the following information :

```javascript
all: {
    site: {
        title: "Name of the website (sets the <title> tag in the page)"
    },
    frontend: {
        startup_app: { //sets the app that's going to start at launch (when no #url is specified).
            block: 'main',
            app: 'home'
        }
    },
    parts: { //allow you to create several separate single page environments : eg backoffice
        "": { //creates an environment for / requests
            blocks: 'all',
            access: [],
            layout: 'index',
            entry: {
                block: 'main',
                app: 'home',
                url_params: []
            }
        },
        "myBackoffice": { //example of a separate environment
            ...
        }
    }
},
```

The parts object in it allows you to create separate front-end environment, giving access to different blocks, and
more importantly to different layouts.

The other objects contain information for the database connection. For example, if you're using MongoDB, this will
make your project use the 'exampleDB' database, and collections will be created for every model you create.
It also makes your app use the port 3000. You can change these settings for the other app modes.

```javascript
local: {
    mode: 'local',
    port: 3000,
    database: {
        connection_str: 'mongodb://127.0.0.1:27017',
        name: 'exampleDB'
    }
},
```
By default your app is launched in the 'local' mode.

###Site parts and layouts

By default, you've got one predefined site part in the config file :
```javascript
     parts: { //allow you to create several separate single page environments : eg backoffice
        "": { //creates an environment for / requests
            blocks: 'all',
            access: [],
            layout: 'index'
        }
    }
```
You can add parts at will. To create a part, you need to add an object to the parts array above :
```javascript
    'urlPrefix'; {
        blocks: 'all' //or ['main', 'myblock', 'backoffice'...],
        access: ['list', 'of', 'rights' ],
        layout: 'layout_name', //the layout must exist as a .hjs file in the /layouts folder
                               //you can also add a .less file in /layouts/style with the same name,
                               //which will be included when loading this part
    }
```
You can then call this part of the website by adding the name in the url :

    http://yoursite/urlPrefix/

For example, you can create a backoffice part, for users with the 'admin' right, allowing them to play around with the
site data.

**Layouts**

All layouts are stored in the /layouts directory. They contain :

```html
<div id="__contents__"></div>
```

This div is filled with the current app. You can add whatever you want around it. Headers, footers etc. However don't
remove the stuff in the <head> tag as they include all the frontend bootstraping for everything to work nicely.

The css for each layout must be stored in a .less file in /layouts/style. The .less file must have the same name as the
layout.

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



####Block backend

The backend contains data models and controllers
to access them via a Json Restful api.

The frontend, based on Backbone.js and Require.js, contains an entry point, hooks to the backend data and apps.

#####descriptor.json file

The descriptor.json file contains the configuration of your block. It contains :

- the name of the block
- an array of apps, that is to say screens that are to be launched in the front-end
- an array of types, representing the models of the backend, to make them accessible in the front end

#####models

Models represent the data of the block in the backend. They are based on [node-orm 2][7]. Read their documentation for
more information on retrieving models, saving and so on. They are structured like this :

```javascript
//backend/models/Book.js
module.exports = function (db, cb) {
    db.define('Book', {
        name: String,
        content: String
    });
    return cb();
};
```

#####controllers

Controllers are what allows a block to serve a restful API to access the model data. You'll usually have one controller
per model.

They are structured like this, if we take the example of the Book model.

```javascript
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
```
####Block frontend

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


#####Initialization

When a user calls the root url :

    http://yoursite/

An html page is loaded. This page contains references to the smartblocks front-end framework. 
The latter will initialize everything, by :

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
                .Data : contains Backbone collections of the data loaded in the client
                    .examplemodels
                .Main : contains all the methods in the block's index.js file

For example, let's say you have a blog block, and that you want to access all the posts. You'd do something like this :

```javascript
var posts_array = SmartBlocks.Blocks.Blog.Data.posts.models
```

Then you'd be able to loop through the posts_array and work with the data.


###Creating your own first block
-----------------------------------------------------------------

This part explains to you how to create a basic Todo list app with SmartBlocks.

###Automated creation
To create a block, go to the project folder and enter the following command :

```sh
$ smartblocks generate_block
```

You'll be asked the name of the block. Enter 'TaskManager'. This will create the following folder structure in your project :

    blocks/
        ...
        TaskManager/
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


###Working in the back end : creating the Task model and the Tasks controller

####Task Model

Create the **Task.js** file in the TaskManager/backend/models folder, and enter the following code in it :

```javascript
module.exports = function (db, cb) {
    db.define('Book', {
        name: String
    });
    return cb();
};
```

####Tasks controller

Now, to create a webservice to edit those tasks, create the **Tasks.js** file in the TaskManager/backend/controllers
folder, and edit it so it looks like this :

```javascript
module.exports = {
    /**
     * Gets all the tasks stored and returns a json array
     */
    index: function (req, res) {
        req.models.Task.find({}, function (err, tasks) {
            if (err) {
                res.send(500, 'error');
            } else {
                res.json(tasks);
            }
        });
    },
    /**
     * Gets the task pointed by the id parameter in the URL, and returns it as Json
     */
    show: function (req, res) {
        var id = req.params.id;
        req.models.Task.get(id, function (err, task) {
            if (err) {
                res.send(404, 'not found');
            } else {
                res.json(task);
            }
        });
    },
    /**
     * Creates a new task with the given name and returns it as json
     */
    create: function (req, res) {
        var name = req.body.name;
        if (name) {
            req.models.Task.create([
                {
                    name: name
                }
            ], function (err, tasks) {
                res.json(tasks[0]);
            });
        } else {
            res.send(400, 'missing parameters');
        }
    },
    /**
     * Updates the task with the given id with the parameters given (sent as json body by a Backbone model
     * when the method save() is called in the front-end)
     */
    update: function (req, res) {
        var id = req.params.id;
        var name = req.body.name;
        var content = req.body.content;
        if (name && content) {
            req.models.Task.get(id, function (err, task) {
                if (err) {
                    res.send(404);
                } else {
                    task.name = name;
                    task.save(function (err) {
                        if (err) {
                            res.send(500);
                        } else {
                            res.json(task);
                        }
                    });
                }
            });
        }
    },
    /**
     * Deletes the task that has the given id
     */
    destroy: function (req, res) {
        var id = req.params.id;
        req.models.Task.get(id, function (err, task) {
            if (err) {
                res.send(404);
            } else {
                task.remove(function (err) {
                    if (err) {
                        res.send(500);
                    } else {
                        res.send(200, 'success');
                    }
                });
            }
        });
    }
};
```

###Working in the front-end : linking data and creating an app.

Please note that to work with the SmartBlocks front-end, you have to be used to [Backbone][3], [Underscorejs][4] and [Requirejs][5].
If you're not, it is recommended to read their docs first.

####Adding the frontend model and collection for tasks

To add the frontend model, create a file in TaskManager/frontend/models called Task.js, containing :

```javascript
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
```

To add the frontend collection, create a file in TaskManager/frontend/collections called Tasks.js, containing :

```javascript
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
```

That will allow you to use the data loaded from the backend's Tasks controller index action like this

```javascript
var tasks = SmartBlocks.Blocks.TaskManager.Data.tasks
//tasks is a Backbone collection containing instanciated Backbone models, representing the tasks
```

Let's say that you have a task with the id "90a12b83". To get its name, you'll just have to do
```javascript
var task = SmartBlocks.Blocks.TaskManager.Data.tasks.get('90a12b83');
alert(task.get('name'));
```
####Creating the app

Now that we have a backend that stores tasks to do, we're going to create an app to interact with them.

The first thing you need to do to add an app in the front-end is to edit the block's descriptor.json, and add the name
of that app :
```javascript
 "apps": [
       ...
        {
            "name": "todolist",
            "entry_point": "launch_todolist"
        }
    ],
```

Then, open the index.js file in the frontend folder. Add the launch method in the main object :

```javascript
init: function () {
    ...
},
...
launch_todolist: function (app) {

}
...
```

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
```html
    <h3>Tasks</h3>
    <ul>
        <% for (var k in tasks) { %>
            <li><%= tasks[k].get('name') %></li>
        <% } %>
    </ul>
    <input type="text" class="task_input" /><button class="add_button">Add</button>
```

In the main.js file, put the code for a Backbone view like that :

```javascript
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
```
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
```sh
    $ smartblocks start

in your project's folder, and go right to [http://localhost:3000#todolist][6] to see the result.
```
##Routing your apps

By default, when you're creating apps, they are attributed a base route, in the descriptor.json :

```javascript
"apps": [
    {
        "name": "myApp",
        "entry_point": "launch_myApp",
        "routing": "blockName/myApp"
    }
]
```

If you want to set the app as root app (accessed from #! url), you can do so from the config/index.js file. In the parts
object :

```javascript
{
    //...
    parts: {
        "": { //This is the main part
            blocks: 'all',
            access: [],
            layout: 'index',
            entry: { //This sets which app in which block gets called at root.
                block: 'main',
                app: 'home',
                url_params: []
            }
        },
        "myBackoffice": { //example of a separate part
            ...
        }
    }
}
```

You can also sub-route these apps. The launcher method in the index.js file (entry point of the app) takes one
parameter, the application model instance. This object is passed to the app's first view init method :

```javascript
var main = {
    init: function () {
        //init stuff
    },
    launch_myApp: function (app) {
        var view = new MyAppView();
        SmartBlocks.Methods.render(view.$el);
        view.init(app);
    }
}
```

In the main.js of that app, you can thus use the method initRoutes on the app object to set sub route methods :

```javascript
var view = {
    //...
    init: function (app) {
        var base = this;
        app.initRoutes({
            '' : function () {
                base.aMethod();
            },
            'some/path/:some_param': function (some_param) { //You can set parameters at will
                base.bMethod(some_param);
            }
        });
    },
    aMethod: function () {
        //render some screen in the app
    },
    bMethod: fucntion (some_param) {
        //render some other screen in the app
    }
    //...
}
```

##Command Line Interface for SmartBlocks
--------------------------------------------------

A few commands are available for the smartblocks tool. Here they are.

###init

Run it from the folder where you host all your projects :
```sh
    $ smartblocks init MyWebsite
```
This creates a folder called MyWebsite. In it, you'll find the standard directory structure for a smartblocks project,
with a main block, containing a preconfigured homepage.

###start
```sh
    $ smartblocks start [local|staging|production]
```
This launches the app, which is accessible on [http://localhost:3000][1] if launched in the staging mode.

###generate_block
```sh
    $ smartblocks generate_block
```
This command asks the developer for a new block name and scaffolds the folder structure, in the blocks folder.
It creates the following structure :
```javascript
    blocks/
        backend/
            models/
            controllers/
        frontend/
            apps/
            models/
            collections/
            index.js
            index.less
        descriptor.json
```
###generate_type
```sh
    $ smartblocks generate_type
```
This command asks the developer a series of questions to create a new type. This will create :

- a model in the backend, with the fields added by the developer,
- an empty controller in the backend, letting the developer decide how the data is returned to the front-end,
- a type entry in the descriptor.json, allowing the front-end to automatically load this data,
- a Backbone model in the front-end
- a Backbone collection in the front-end

All that will be created in the block the developer chose (this is the first question).

When adding a new type, this command allows the developer to only concentrate on the webservice, the other tasks
usually being the same.

###generate_app
```sh
    $ smartblocks generate_app
```
This command asks the developer a series of questions to create a new app. These request the following information :

- in what block the app must be created,
- the name of the app.

It does the following :

- creates a folder named after the app in the frontent/app directory, with
    - a views folder, containing the main view of the app,
    - a style folder, containing the main style file for the app,
    - a templates folder, containing the main template file for the app
    - a launch method in the index.js
    - an entry in the descriptor.json file
    - an entry in the index.less file, pointing to the block's main style file

###generate_controller
```sh
    $ smartblocks generate_controller
```
This generates a simple controller file in the block of the developer's choosing, with the given name

###generate_model
```sh
    $ smartblocks generate_model
```
This generates a simple model file in the block of the developer's choosing, with the given name

###generate_view
```sh
    $ smartblocks generate_view
```
This generates a view in the block and the app of the developer's choosing with the given name. An empty template
and an empty style file (+ link from main.less in the app) are also added.


##SEO with SmartBlocks

As of v0.1.2, SmartBlocks supports Google's AJAX crawling system. When Google encounters links in your website
containing '#!' for the local hash routing (used by Backbone, allowing a routing in single page apps), it replaces
it by "?_escaped_fragment_=", thus sending any local hash parameters as a GET parameter to your server.

SmartBlocks detects that "?_escaped_fragment_=" part, uses [PhantomJs][9] to prerender the asked application, waits
for 2 seconds so that everything is loaded and rendered in the front-end, then sends the resulting HTML to the client.

That way, a robot such as Google's will receive your website content right away, without you needing to worry about
your single page app's SEO.

However make sure you've got **PhantomJs installed and registered in your PATH variable**.

For more information about how Google handles this, please refer to their documentation: [Making AJAX Applications
Crawlable][8].

##License
--------------------------------------------------

Smartblocks is licensed under the AGPL v3.0 license.
[http://www.tldrlegal.com/l/AGPL3][2]

##Contributing
--------------------------------------------------

If you're interested and want to contribute, or if you just want to chat, you are most welcome. We are just starting
and would love to create a little community around this project. You can send me an email if you want
(see my page on github : [https://github.com/william26][11]).

##More information about Smartblocks
--------------------------------------------------

We're working on the official website where there will be more docs and stuff.
We're thinking about making a features store ;).

The website will contain useful information for a more complete use than the one presented in this Readme, including
for example :

- Shortcuts detection
- Live exchange with socket.io (which is included in the framework)
- User / session management, and user restricted blocks / apps

[1]:http://localhost:3000
[2]:http://www.tldrlegal.com/l/AGPL3
[3]:http://backbonejs.org/
[4]:http://underscorejs.org/
[5]:http://requirejs.org/
[6]:http://localhost:3000#todolist
[7]:https://github.com/dresende/node-orm2
[8]:https://developers.google.com/webmasters/ajax-crawling/?hl=iw
[9]:http://phantomjs.org/
[10]:https://github.com/dresende/node-orm2
[11]:https://github.com/william26
[12]:http://www.mongodb.org/
