import { RemoteEurekaClient } from '../remote-eureka-client';
import { eurekaDb } from '../eureka-db';

export const queryAllInstances = (req: any, res: any) => {
  res.set('Content-Type', 'application/json');

  new RemoteEurekaClient().getApplications().subscribe(
    (data: any) => {
      if (eurekaDb.exists('/applications')) {
        const localApps = eurekaDb.getData('/applications');
        const remoteApps: EurekaData.Application[] = data.applications.application;
        Object.keys(localApps).forEach((appName) => {
          if (!appName.toLowerCase().startsWith('oneplatform')) {
            const index = remoteApps.findIndex(remoteApp => remoteApp.name === appName);
            const newApp = { name: appName, instance: localApps[appName].instances };
            if (index === -1) {
              console.log(`use app ${appName} of local.`);
              remoteApps.push(newApp);
            } else {
              console.log(`replace app ${appName} with local.`);
              remoteApps[index] = newApp;
            }
          }
        });
      }
      res.json(data);
    },
    (error) => {
      console.error(error);
      res.status(500);
    });
};