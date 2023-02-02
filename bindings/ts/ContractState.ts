/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ContractState = State;

export interface State {
  archiveRequests: {
    [k: string]: ArchiveRequest;
  };
  archives: {
    [k: string]: {
      [k: string]: ArchiveSubmission;
    };
  };
  canEvolve?: boolean | null;
  evolve?: string | null;
  owner: string;
  uploaders: {
    [k: string]: Uploader;
  };
}
export interface ArchiveRequest {
  endTimestamp: number;
  frequency: string;
  id: string;
  latestArchivedTimestamp: number;
  options: Options;
  requestedBy: string;
  startTimestamp: number;
  uploaderAddress: string;
}
export interface Options {
  depth: number;
  domainOnly: boolean;
  urls: string[];
}
export interface ArchiveSubmission {
  archiveRequestId: string;
  arweaveTx: string;
  fullUrl: string;
  options: ArchiveOptions;
  screenshotTx: string;
  size: number;
  timestamp: number;
  title: string;
  uploaderAddress: string;
}
export interface ArchiveOptions {
  depth: number;
  domainOnly: boolean;
}
export interface Uploader {
  friendlyName: string;
  uploadCount: number;
}