var http = require('http');
var db = require('./db.js');
var qs = require('querystring');
var fs = require('fs');


http.createServer(function (req, res) {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    })
    req.on('end', () => {
        if (body.length > 0) {
            body = Buffer.concat(body).toString();
            fs.writeFile('bodylog.txt', body, (err) => {
                if (err) throw err;
            });
            body = qs.parse(body);
            time = new Date();
            if (typeof body.time === "string") {
                time.setHours(body.time.substring(0,2),body.time.substring(2,4));
            }

            db.sequelize.transaction(function (t) {
                return db.Entry.create({
                    tech: body.tech,
                    workorder: body.workorder,
                    description: body.description,
                    status: body.status,
                    timestamp: time
                })
            }).then(function (result) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('OK');
            }).catch(function (err) {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('Failed');
            })
        }
        else {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Failed');
        }
    })

}).listen(process.env.PORT);
