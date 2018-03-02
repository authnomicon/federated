var providers = {
  'https://accounts.google.com': 'passport-google-oauth20'
};


exports.getPackage = function(provider) {
  return providers[provider];
};
