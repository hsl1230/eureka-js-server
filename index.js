var express = require('express'); 
var proxy = require('http-proxy-middleware');
var xml2js = require('xml2js'); 
var request = require('request');


var { Observable } = require('rxjs');

var combinedAppsSubscriber;
var combinedAppsObserver = new Observable(subscriber => {
  combinedAppsSubscriber = subscriber;
});

var app = express();

const localEurekaConfig = {
  target: "http://localhost:8761/",
  secure: false,
  changeOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': "*",
    origin: 'http://localhost:8761/'
  },
  logLevel: 'debug'
};

var parser = new xml2js.Parser(/* options */);

request.get('http://ziongw1-dev.neterra.skrill.net:8761/eureka/apps', (err, res, body) => {
  if (err) {
    combinedAppsSubscriber.error("remote eureka error");
    return console.error(err);
  }

  parser.parseStringPromise(body).then(result => { 
    var remoteApps = result.applications.application;
    var combinedApps = result.applications;

    request.get('http://localhost:8761/eureka/apps', (err1, res1, body1) => {
      if (err1) {
        combinedAppsSubscriber.next(combinedApps);
        combinedAppsSubscriber.complete();
        return console.error(err1);
      }
      parser.parseStringPromise(body1).then(result1 => {
        var localApps = result1.applications.application;
        localApps.forEach(localApp => {
          if (!localApp.name[0].toLowerCase().startsWith("oneplatform")) {
            var index = remoteApps.findIndex(remoteApp => remoteApp.name[0] === localApp.name[0]);
            if (index === -1)  {
              combinedApps.application.push(localApp);
              console.log('added ', localApp.name);
            } else {
              combinedApps.application[index] = localApp;
              console.log('replaced ', localApp.name);
            }
          }
          combinedAppsSubscriber.next(combinedApps);
          combinedAppsSubscriber.complete();  
        })

      });
    });
    
    combinedAppsObserver.subscribe(combinedApps => {
    });
  });
});

app.use(
  '!/eureka/apps',
  proxy(localEurekaConfig)
);

app.get("/eureka/apps", function(req, res) {
  res.set('Content-Type', 'application/xml');
  result.applications = combinedApps;
  res.send(new xml2js.Builder({headless:true, explicitRoot:true}).buildObject(result));
})

app.listen(9761);



