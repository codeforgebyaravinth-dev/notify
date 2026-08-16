import { BadRequestException } from '@nestjs/common';

import { ExpectedDnsRecordDto } from '../dtos/expected-dns-record.dto';

export function getMailServerDomain(): string | undefined {
  return process.env.MAIL_SERVER_DOMAIN?.replace(/^https?:\/\//i, '').replace(/\/+$/, '') || undefined;
}

export function buildExpectedDnsRecords(domainName: string): ExpectedDnsRecordDto[] {
  let mailServerDomain = getMailServerDomain();

  if (!mailServerDomain) {
    mailServerDomain = 'inbound.notify.com';
  }

  return [
    {
      type: 'MX',
      name: domainName,
      content: mailServerDomain,
      ttl: 'Auto',
      priority: 10,
    },
  ];
}
