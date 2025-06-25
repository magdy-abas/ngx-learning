function getMainDomain(): string {
  const hostname = window.location.hostname;

  const parts = hostname.split('.');

  if (parts.length >= 3) {
    return parts[parts.length - 3];
  }

  // return parts[0];
  return 'farida';
}
// export const baseUrl = `https://farida.stepsio.com/api/`;
export const baseUrl = `https://${getMainDomain()}.stepsio.com/api/`;

export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const mainDomain = getMainDomain();

console.log('Main Domain:', mainDomain);
console.log('Base URL:', baseUrl);

// // city-center
// //farida
// //total //categories page
// //steps-teem
