var providers = {
  'https://www.facebook.com': 'oauth2',
  'https://accounts.google.com': 'oauth2',
  'https://api.twitter.com': 'oauth'
};


exports.getProtocol = function(provider) {
  return providers[provider];
};
