var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var util = require('util')
const chalk = require('chalk');
const tmp=
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/sethostaddr', (req, res) => {
    res.cookie('reg', req.body.reg, { maxAge: 900000, httpOnly: true })
    res.cookie('setProxyHost', req.body.host, { maxAge: 900000, httpOnly: true })
    res.redirect(301,'/')
})

app.get('/sethostaddr', (req, res) => {
    res.cookie('setProxyHost', '', { maxAge: 900000, httpOnly: true })
    res.redirect(301,'/')
})

app.all("/*", function (req, res) {
    
    // console.log(req.cookies.setProxyHost)
    if (req.cookies.setProxyHost && req.cookies.reg) {
        reg=req.cookies.reg==='us' ? 'http://35.236.26.14' : 'http://35.246.33.109'
        console.log(chalk.blue('trying to access -> '),{reg:req.cookies.reg,ip:reg},req.url);
        apiProxy.web(req, res, { target: reg,secure: true }, function (e) {
            res.cookie('setProxyHost', '', { maxAge: 900000, httpOnly: true })
            res.json(util.inspect(e))
        });
    }
    else {
        res.sendFile(__dirname+'/view.html')

    }
});



app.listen(80,(e)=>{
    if(e){
        return console.error(e)
    }
    console.log('Server running on port 80')
})