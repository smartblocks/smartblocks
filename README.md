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


####Managing the main block

####Creating your own first block

#####Back end


#####Front end


##License

Smartblocks is licensed under the AGPL v3.0 license.
[http://www.tldrlegal.com/l/AGPL3][2]

##More information about Smartblocks

We're working on the official website where there will be more docs and stuff.
We're thinking about making a features store ;).

[1]:http://localhost:3000
[2]:http://www.tldrlegal.com/l/AGPL3
