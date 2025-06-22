function getMainDomain(): string {
  const hostname = window.location.hostname;

  const parts = hostname.split('.');

  let main: string;

  if (parts[0] === 'www') {
    // www.farida.com case
    main = parts[1];
  } else if (parts.length > 2) {
    // dev.farida.com case
    main = parts[1];
  } else {
    // farida.com case
    main = parts[0];
  }

  return 'farida';

  // return main;
}

export const baseUrl = `https://${getMainDomain()}.stepsio.com/api/`;
// export const baseUrl = `https://farida.stepsio.com/api/`;

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
