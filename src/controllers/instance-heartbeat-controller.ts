import { findInstance } from './find-instance';

export const instanceHeartbeat = (req: any, res: any, next: any) => {
  const appName = req.params.appName;
  const instanceId = req.params.instanceId;
  const storedInstance = findInstance(appName, instanceId);
  if (storedInstance) {
    const durationInSecs = storedInstance.leaseInfo.durationInSecs;
    storedInstance.leaseInfo.lastRenewalTimestamp = new Date().getTime() + durationInSecs * 1000;
    res.status(200);
  } else {
    res.status(404);
  }
  res.json();
};