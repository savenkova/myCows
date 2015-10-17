//подключаем модули
var express = require('express'),
    app = express(),
    jade = require('jade'),
    router = express.Router({}),
    db = require('db');

//сохраняем в новоую переменную JSON с коровами
var getCows = db.get();

app.set('views',  __dirname + '/views');
app.set('view engine', 'jade');


// это мы отправляем на главную
router.get('/', function (req, res) {
    res.render('index',
            { title: 'Hey',
            message: 'Привет, друг!',
            suggest: 'Хочешь посмотреть наших коровок или добавить своих?',
            link: 'Перейти к коровкам'});
});


// на ./cows отправляем JSON с коровами
router.get('/cows', function (req, res) {
    res.render('cows',{"cows" : getCows});
});

app.post('/cows', function(req, res){
    var name = req.param('name', null);
});

// для каждой коровы по idшнику выделяется url, на котором видим вьюшку, заполненную коровой с соответсвующим id
router.get('/cow/:id', function (req, res) {
    for (var cow in getCows) {
        if (getCows[cow].id == req.params.id){
            res.render('cow', {"cow": getCows[cow]});
        };
   }
});

app.use(router);
app.listen(3000, function () {
    console.log('Ready on 3000');
});