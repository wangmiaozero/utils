const mathIsPrime = n => {
  if (n === 2 || n === 3) {
    return true
  }
  if (isNaN(n) || n <= 1 || n % 1 != 0 || n % 2 == 0 || n % 3 == 0) {
    return false;
  }
  for (let x = 6; x <= Math.sqrt(n) + 1; x += 6) {
    if (n % (x - 1) == 0 || n % (x + 1) == 0) {
      return false
    }
  }
  return true
}
mathIsPrime(0) // true