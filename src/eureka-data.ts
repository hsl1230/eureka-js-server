declare namespace EurekaData {

  export interface Port {
    $: number;
    '@enabled': string;
  }

  export interface SecurePort {
    $: number;
    '@enabled': string;
  }

  export interface DataCenterInfo {
    '@class': string;
    name: string;
  }

  export interface LeaseInfo {
    renewalIntervalInSecs: number;
    durationInSecs: number;
    registrationTimestamp?: number;
    lastRenewalTimestamp: number;
    evictionTimestamp?: number;
    serviceUpTimestamp?: number;
  }

  export interface Metadata {
    instanceId: string;
    'management.port': string;
  }

  export interface Instance {
    instanceId: string;
    hostName: string;
    app: string;
    ipAddr: string;
    status: string;
    overriddenStatus?: string;
    port: Port;
    securePort?: SecurePort;
    countryId?: number;
    dataCenterInfo: DataCenterInfo;
    leaseInfo: LeaseInfo;
    metadata?: Metadata;
    homePageUrl?: string;
    statusPageUrl?: string;
    healthCheckUrl?: string;
    vipAddress: string;
    secureVipAddress?: string;
    isCoordinatingDiscoveryServer?: string;
    lastUpdatedTimestamp?: string;
    lastDirtyTimestamp?: string;
    actionType?: string;
  }

  export interface Application {
    name: string;
    instance: Instance[];
  }

  export interface Applications {
    versions__delta: string;
    apps__hashcode: string;
    application: Application[];
  }

  export interface RootObject {
    applications: Applications;
  }

}
