var providers = {
  'https://api.twitter.com': 'passport-twitter',
};


exports.getPackage = function(provider) {
  return providers[provider];
};
