function getMainDomain(): string {
  let hostname = window.location.hostname;

  if (hostname.startsWith('www.')) {
    hostname = hostname.replace('www.', '');
  }
  const parts = hostname.split('.');

  if (parts.length >= 3) {
    return parts[parts.length - 3];
  }

  return parts[0];
  // return 'farida';
}
export const baseUrl = `https://farida.stepsio.com/api/`;

export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const mainDomain = getMainDomain();

// // city-center
// //farida
// //total //categories page
// //steps-teem
