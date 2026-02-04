// utils.js

export function generateSerialNumbers(count = 500) {
  return Array.from({ length: count }, (_, i) =>
    `SN-${String(i).padStart(3, '0')}`
  );
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
