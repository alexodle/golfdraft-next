import * as fs from 'fs';
import * as request from 'request';
import moment = require('moment');

export function fetchData(url: string): Promise<any> {
  const ts = moment().format('YMMDD_HHmmss');
  return new Promise((fulfill, reject) => {
    request({ url }, (error, _response, body) => {
      if (error) {
        reject(error);
        return;
      }
      fulfill(body);
    });
  });
}
