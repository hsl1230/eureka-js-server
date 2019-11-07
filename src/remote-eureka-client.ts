import request = require('request');
import { Observable } from 'rxjs';

const EUREKA_SERVER_URL = 'http://ziongw1-dev.neterra.skrill.net:8761/eureka/apps';

export class RemoteEurekaClient {
  getApplications(): Observable<any> {
    return Observable.create((observer: any) => {
      request.get(
        EUREKA_SERVER_URL,
        {
          headers: {
            accept: 'application/json',
          },
        },
        (err, res, body) => {
          if (err) {
            observer.error(err);
          } else {
            observer.next(JSON.parse(body));
            observer.complete();
          }
        });
    });
  }
}
