var express = require('express'),
    app = express(),
    jade = require('jade'),
    router = express.Router({}),
    db = require('db');

var getCows = db.get();

app.set('views',  __dirname + '/views');
app.set('view engine', 'jade');

router.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

router.get('/cows', function (req, res) {
    res.render('cows',{"cows" : getCows});
});

router.get('/cow/:id', function (req, res) {

   for (var cow in getCows) {
        if (getCows[cow].id == req.params.id){
            res.render('cow', {"cow": getCows[cow].id});
        }
    }

});

app.use(router);
app.listen(3000, function () {
    console.log('Ready on 3000');
});