import { deleteExpiredInstances } from './delete-expired-instances';
import { findInstance } from './find-instance';
import { instanceHeartbeat } from './instance-heartbeat-controller';
import { queryAllInstances } from './query-all-instances-controller';
import { registerApplication } from './register-application-controller';

export { deleteExpiredInstances, findInstance, instanceHeartbeat,
  queryAllInstances, registerApplication };
