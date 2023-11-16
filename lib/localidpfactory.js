function LocalIDProviderFactory(idp) {
  this._idp = idp;
}

LocalIDProviderFactory.prototype.create = function(provider, protocol) {
  if (provider) {
    return Promise.reject(new Error('Unsupported identity provider: ' + provider));
  }
  return Promise.resolve(this._idp);
}

module.exports = LocalIDProviderFactory;
