requirejs([
    "./libs/poly/function",
    "underscore",
    "backbone",
    "LoadingScreen",
    "bootstrap",
    'less'
], function (poly, _, Backbone, LoadingScreen, bootstrap) {

    bootstrap.init(function () {
        //Shortcuts
        window._sb = SmartBlocks;
        window._sblocks = SmartBlocks.Blocks;
    });
});