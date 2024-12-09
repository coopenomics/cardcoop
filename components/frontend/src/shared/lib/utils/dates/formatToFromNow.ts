import moment from './moment';

export function formatToFromNow(dateStr: string): string {
  const result =  moment(dateStr).fromNow()
  return result
}
