export function likesDeclension(likes) {
    if (likes < 1000) {
      return likes;
    } else if (likes < 1000000) {
      return `${(likes / 1000).toFixed(1)} tys.`;
    } else {
      return `${(likes / 1000000).toFixed(1)} mln`;
    }
  }