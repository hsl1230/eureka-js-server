import { eurekaDb } from '../eureka-db';

export function findInstance(appName: string, instanceId: string): EurekaData.Instance | undefined {
  if (eurekaDb.exists(`/applications/${appName}/instances`)) {
    const instances: EurekaData.Instance[] = eurekaDb.getData(`/applications/${appName}/instances`);
    return instances.find(
      (instance: EurekaData.Instance) => instance.instanceId === instanceId);
  }
  return undefined;
}