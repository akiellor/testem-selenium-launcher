var chromedriver = require('chromedriver');
var spawn = require('child_process').spawn;
var request = require('request');
var http = require('http');

describe('launcher', function() {
  var process;
  var server;
  before(function(done) {
    server = http.createServer(function(request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.write('Hello World');
      response.end('okay');
    });
    server.listen(9000, function(err) {
      if(err) {
        throw err;
      }
      process = spawn(chromedriver.path);
      var started = false;
      process.stdout.on('data', function() {
        if (!started) {
          done();
        }
        started = true;
      });
    });
  });

  it('should launch browser', function(done) {
    var launcher = spawn(__dirname + '/../bin/selenium-launcher', ['http://localhost:9000', 'http://localhost:9515', 'chrome']);

    launcher.stdout.on('data', function(data) {
      data = data.toString();
      if (data.indexOf('http://localhost:9000') !== -1) {
        request('http://localhost:9515/sessions', function(err, response, body) {
          if(err) {
            throw err;
          }
          var sessions = JSON.parse(body);
          if (!(sessions.value.length > 0)) {
            throw new Error("didn't spawn session");
          }
          launcher.kill('SIGTERM');
        });
      }
    });

    launcher.on('exit', function(code, signal) {
      request('http://localhost:9515/sessions', function(err, response, body) {
        if(err) {
          throw err;
        }
        var sessions = JSON.parse(body);
        if (sessions.value.length !== 0) {
          throw new Error("didn't kill session");
        }
        done();
      });
    });
  });

  after(function(done) {
    process.on('exit', function(code, signal) {
      server.close(function() {
        done();
      });
    });
    process.kill('SIGTERM');
  });
});
