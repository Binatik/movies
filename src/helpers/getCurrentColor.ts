function getCurrentColor(number: number) {
  const average = number;

  if (average < 3) {
    return "#E90000";
  }

  if (average > 2 && average < 4) {
    return "#E97E00";
  }

  if (average > 4 && average < 7) {
    return "#E9D100";
  }

  if (average > 7) {
    return "#66E900";
  }
}

export { getCurrentColor };
