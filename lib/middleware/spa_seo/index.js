var phantom = require('node-phantom');

function isCrawled(req) {
    var url_fragments = req.url.split("?_escaped_fragment_=");
    if (url_fragments.length !== 2)
        return undefined;

    var url = {
        protocol : 'http://' ,
        host : req.headers.host,
        path: url_fragments[0] + "#!",
        fragment : url_fragments[1]
    };
    return url;
}



module.exports = function (params) {

    function runPhantom(url,callback){
        phantom.create(function(err,ph) {
            ph.createPage(function(err,page) {
                if(err) callback(err,undefined);
                page.open( url.protocol + url.host + url.path + url.fragment , function(err,status) {
                    setTimeout( function() {
                            page.evaluate(function(){
                                return document.getElementsByTagName('html')[0].innerHTML;
                            }, function(err,result){
                                if(err) callback(err,undefined);
                                callback(undefined,result);
                            });
                        },
                        params.delay || 2000 );
                });
            });
        });
    }

    return function(req, res, next) {
        if ('GET' !== req.method )
            return next();

        var url = isCrawled(req);

        if (!url) return next();

        res.set('Link', '<'+(url.protocol + url.host ) +url.path + url.fragment +'>; rel="canonical"');



        runPhantom(url, function(err,snapshot){
            if(err){
                return next(err);
            }
            res.set("Content-Type","text/html; charset=utf-8");
            return res.end(snapshot);
        });
    }

}

