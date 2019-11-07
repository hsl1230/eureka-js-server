import express from 'express';
import bodyParser from 'body-parser';
import { queryAllInstances, registerApplication, instanceHeartbeat } from './controllers';
import { deleteExpiredInstances } from './controllers/delete-expired-instances';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/**', (req: any, res: any, next: any) => {
  console.log(req.method, req.url, '\nheaders:', req.headers, '\nbody: ', req.body);
  next();
});

app.get('/eureka/apps', queryAllInstances);

app.post('/eureka/apps/:appName', registerApplication);

app.put('/eureka/apps/:appName/:instanceId', instanceHeartbeat);

// Server port
const HTTP_PORT = 9761;
// Start server
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}...`);
});

setInterval(deleteExpiredInstances, 30000);
