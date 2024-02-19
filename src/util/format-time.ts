import * as moment from 'moment';

export function formatUnixTimestamp(unixTimestamp) {
  const date = moment.unix(unixTimestamp / 1000);

  const formattedTime = date.format('DD-MM-YYYY HH:mm:ss');

  return formattedTime;
}

export function generateRandomString(length) {
  let randomString = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}
