export function getDeclension(number, forms) {
    if (number === 1) {
        return forms[0];
    } else if (number > 1 && number < 5) {
        return forms[1];
    } else {
        return forms[2];
    }
}
  
export function formatDate(date) {
    const now = new Date();
    const newDate = new Date(date);
    const diff = now - newDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = now.getFullYear() - newDate.getFullYear();

    if (seconds < 60) {
      return `${seconds} ${getDeclension(seconds, ['sekunda', 'sekundy', 'sekund'])} temu`;
  } else if (minutes < 60) {
      return `${minutes} ${getDeclension(minutes, ['minuta', 'minuty', 'minut'])} temu`;
  } else if (hours < 24) {
      return `${hours} ${getDeclension(hours, ['godzina', 'godziny', 'godzin'])} temu`;
  } else if (days < 7) {
      return `${days} ${getDeclension(days, ['dzień', 'dni', 'dni'])} temu`;
  } else if (years < 1) {
      return newDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
  } else {
      return newDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}