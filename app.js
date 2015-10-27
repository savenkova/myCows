//подключаем модули
var express = require('express'),
    app = express(),
    jade = require('jade'),
    router = express.Router({}),
    multer = require('multer'),
    upload = multer({ dest: 'uploads/' }),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
     //console.log("yay!");
});

var cowSchema = mongoose.Schema({
    name: String,
    id: Number
});

var Cow = mongoose.model('Cow', cowSchema); //cows

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

// на ./cows отправляем всех коров
router.get('/cows', function (req, res) {
    Cow.find(function (err, cows) {
        if (err) return err;
        res.render('cows', {
            "cows": cows
        });
    });
});

//добавляем корову
router.post('/cows', upload.array(), function (req, res) {
    var zorka = new Cow({
        name: req.body.name
    });

    zorka.save(function(err, zorka) {
        if (err) return console.error(err);
        res.redirect('/cows');
    });

});

// для каждой коровы по idшнику выделяется url, на котором видим вьюшку, заполненную коровой с соответсвующим id
router.get('/cow/:id', function (req, res) {
    Cow.find({ _id: req.params.id }, function (err, cow) {
        if (err) return err;
        res.render('cow', {
            "cow": cow[0]
        });
    });
});

// удаляем
router.get('/cow/:id/delete', function (req, res) {
    Cow.remove({ _id: req.params.id }, function (err) {
        if (err) return err;
        res.redirect('/cows');
        Cow.find(function (err, cows) {
            if (err) return err;
            //console.log(cows)
        });
    });
});

app.use(router);
app.use(multer({dest:'./uploads/'}).array('multiInputFileName'));
app.use(express.static(__dirname + '/public'));
app.listen(3000, function () {
    console.log('Ready on 3000');
});
