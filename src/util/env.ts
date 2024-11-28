export enum BUILD_ENV {
  LOCAL = 'local',
  DEV = 'dev',
  SIT = 'sit',
  UAT = 'uat',
  PROD = 'prod'
}

export const isLocalBuild = (): boolean => process.env.ENV === BUILD_ENV.LOCAL;

export const isDevBuild = (): boolean => process.env.ENV === BUILD_ENV.DEV;

export const isSitBuild = (): boolean => process.env.ENV === BUILD_ENV.SIT;

export const isUatBuild = (): boolean => process.env.ENV === BUILD_ENV.UAT;

export const isProdBuild = (): boolean => process.env.ENV === BUILD_ENV.PROD;

export const getLocation = () => process.env.LOCATION?.toUpperCase() || '';

export const getLBU = () => process.env.LBU || '';

export const getEnv = () => process.env.ENV || '';
