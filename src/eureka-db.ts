import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

export const eurekaDb = new JsonDB(new Config('eurekaDb', true, false, '/'));

eurekaDb.delete('/applications');
