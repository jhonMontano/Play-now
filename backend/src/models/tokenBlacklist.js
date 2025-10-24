let blacklist = [];

export const addTokenToBlacklist = (token) => {
  blacklist.push(token);
};

export const isTokenBlacklisted = (token) => {
  return blacklist.includes(token);
};
