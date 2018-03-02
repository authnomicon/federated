var providers = {
  'https://accounts.google.com': 'oauth2'
};


exports.getProtocol = function(provider) {
  return providers[provider];
};
