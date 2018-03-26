var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    privateKey  = fs.readFileSync('certs/server.key', 'utf8'),
    certificate = fs.readFileSync('certs/server.crt', 'utf8'),
    credentials = {key: privateKey, cert: certificate},
    express = require('express'),
    app = express(),
    httpServer = http.createServer(app),
    httpsServer = https.createServer(credentials, app),
    argv = require('minimist')(process.argv.slice(2));

httpServer.listen(8080, function () {
    var host = httpServer.address().address,
        port = httpServer.address().port;

    console.log('Express listening at http://%s:%s', host, port);
});
httpsServer.listen(4430, function () {
    var host = httpsServer.address().address,
        port = httpsServer.address().port;

    console.log('Express listening at http://%s:%s', host, port);
});

if (!argv.base) throw new Error('Must include --base={path} option to specify root path of OVP web-app');

var base = argv.base;


app.use('/auth', express.static(base + '/twctv.html'));
app.use('/DVR', express.static(base + '/urlHashRedirect.html'));
app.use('/dvr', express.static(base + '/urlHashRedirect.html'));
app.use('/ondemand', express.static(base + '/urlHashRedirect.html'));
app.use('/guide', express.static(base + '/urlHashRedirect.html'));
app.use('/rdvr', express.static(base + '/urlHashRedirect.html'));
app.use('/settings', express.static(base + '/urlHashRedirect.html'));
app.use('/livetv', express.static(base + '/urlHashRedirect.html'));
app.use('/search', express.static(base + '/urlHashRedirect.html'));
app.use(express.static(base));
