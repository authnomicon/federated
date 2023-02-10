function LocalIDPSchemeFactory(scheme) {
  this._scheme = scheme;
}

LocalIDPSchemeFactory.prototype.create = function(provider, protocol) {
  // TODO: check the provider and protocol here, and fail if no match
  
  if (provider) {
    return Promise.reject(new Error('Unsupported identity provider: ' + provider));
  }
  
  return Promise.resolve(this._scheme);
}

module.exports = LocalIDPSchemeFactory;
