import * as moment from 'moment';

export function formatUnixTimestamp(unixTimestamp) {
  const date = moment.unix(unixTimestamp / 1000);

  const formattedTime = date.format('DD-MM-YYYY HH:mm:ss');

  return formattedTime;
}
