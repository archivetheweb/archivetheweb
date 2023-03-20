export enum Steps {
  WebsiteInput,
  ArchivingOptions,
  Payment,
}

export enum Terms {
  None,
  Once,
  Multiple,
}

export enum TimeUnit {
  Hours,
  Days,
}

export enum Depth {
  PageOnly,
  PageAndLinks,
}

export enum CrawlTypes {
  DomainOnly = "domainOnly",
  DomainWithPageLinks = "domainWithPageLinks",
  DomainAndLinks = "domainAndLinks",
}

export enum ModalStep {
  Connect,
  Review,
  Pending,
  Success,
  Failure,
}

export interface Duration {
  value: string;
  unit: TimeUnit;
}
