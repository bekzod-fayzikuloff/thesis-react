export const toRepresent = (seconds) => {
  if (seconds < 60) {
    return `${seconds} секунд назад`;
  } else if (seconds > 60 && seconds < 60 * 60) {
    return `${Math.round(seconds / 60)} минут назад`;
  } else if (seconds > 60 * 60 && seconds < 60 * 60 * 24) {
    return `${Math.round(seconds / 60 / 60)} час назад`;
  } else if (seconds > 60 * 60 * 24 && seconds < 60 * 60 * 24 * 7) {
    return `${Math.round(seconds / 60 / 60 / 24)} дней назад`;
  } else {
    return `${Math.round(seconds / 60 / 60 / 24 / 7)} недель назад`;
  }
};
