export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function compactNumbers(number: number) {
  return number.toLocaleString("en-Us", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  });
}
