import moment from 'moment-with-locales-es6';

export function convertToEOSDate(dateStr: string): string {
  const result =  moment(dateStr, 'YYYY/MM/DD HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS');
  return result
}
