var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'https://google.com/'
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var util = require('util')

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/sethostaddr', (req, res) => {
    res.cookie('setProxyHost', req.body.host, { maxAge: 900000, httpOnly: true })
    res.redirect(301,'/')
})

app.get('/sethostaddr', (req, res) => {
    res.cookie('setProxyHost', '', { maxAge: 900000, httpOnly: true })
    res.redirect(301,'/')
})

app.all("/*", function (req, res) {
    // console.log('redirecting to Server1');
    console.log(req.cookies.setProxyHost)
    if (req.cookies.setProxyHost) {
        apiProxy.web(req, res, { target: req.cookies.setProxyHost }, function (e) {
            res.cookie('setProxyHost', '', { maxAge: 900000, httpOnly: true })
            res.json(util.inspect(e))
        });
    }
    else {
        res.send(`
        <form action="/sethostaddr" method="post">
            <input type="text" name="host"/>
            <input type="submit"/>
        </form>
        `)

    }
});



app.listen(80,(e)=>{
    if(e){
        return console.error(e)
    }
    console.log('Server running on port 80')
})