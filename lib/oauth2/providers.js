var providers = {
  'https://www.facebook.com': 'passport-facebook',
  'https://accounts.google.com': 'passport-google-oauth20'
};


exports.getPackage = function(provider) {
  return providers[provider];
};
