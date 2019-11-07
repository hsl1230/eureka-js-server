import { eurekaDb } from '../eureka-db';

export function deleteExpiredInstances() {
  const liveInstances: EurekaData.Instance[] = [];
  if (eurekaDb.exists('/applications')) {
    const localApps = eurekaDb.getData('/applications');
    Object.keys(localApps).forEach((appName) => {
      localApps[appName].instances.forEach((instance: EurekaData.Instance, index: number) => {
        if (!instance.leaseInfo || new Date().getTime() > instance.leaseInfo.lastRenewalTimestamp) {
          console.log(`instance ${instance.instanceId} will be removed`);
        } else {
          liveInstances.push(instance);
        }
      });
    });

    eurekaDb.delete('/applications');

    liveInstances.forEach((instance) => {
      eurekaDb.push(`/applications/${instance.app}/instances`, [instance], false);
    });
  }

  console.log('instances alive: ', liveInstances.map(
    instance => `${instance.app}, ${instance.instanceId}`));
}