import moment from './moment';

export function formatToHumanDate(dateStr: string): string {
  const result =  moment(dateStr).format('YYYY-MM-DD HH:mm');
  return result
}
