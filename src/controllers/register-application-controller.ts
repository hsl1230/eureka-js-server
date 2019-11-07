import { eurekaDb } from '../eureka-db';
import { findInstance } from './find-instance';

export const registerApplication = (req: any, res: any, next: any) => {
  const errors = [];
  if (!req.body.instance) {
    errors.push('invalid input.');
  }

  if (req.body.instance.app !== req.params.appName) {
    errors.push(`invalid app name ${req.body.instance.app}.`);
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(',') });
    return;
  }

  const appName: string = req.params.appName;

  console.log(`Registering app ${appName}...`);

  if (!req.body.instance.leaseInfo) {
    req.body.instance.leaseInfo = {};
  }

  if (!req.body.instance.leaseInfo.durationInSecs) {
    req.body.instance.leaseInfo.durationInSecs = 90;
    req.body.instance.leaseInfo.renewalIntervalInSecs = 30;
  }

  if (!req.body.instance.leaseInfo.lastRenewalTimestamp) {
    req.body.instance.leaseInfo.lastRenewalTimestamp =
      new Date().getTime() + req.body.instance.leaseInfo.durationInSecs * 1000;
    req.body.instance.leaseInfo.registrationTimestamp = new Date().getTime();
  }

  const inputInstance: EurekaData.Instance = req.body.instance;

  const storedInstance = findInstance(inputInstance.app, inputInstance.instanceId);

  if (storedInstance) {
    const durationInSecs = inputInstance.leaseInfo.durationInSecs;
    storedInstance.leaseInfo.lastRenewalTimestamp = new Date().getTime() + durationInSecs * 1000;
  } else {
    eurekaDb.push(`/applications/${appName}/instances`, [inputInstance], false);
  }

  res.status(204);
  res.json();
};