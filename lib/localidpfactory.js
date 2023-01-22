function LocalIDProviderFactory(idp) {
  this._idp = idp;
}

LocalIDProviderFactory.prototype.create = function() {
  // TODO: check the provider and protocol here, and fail if no match
  
  return Promise.resolve(this._idp);
}

module.exports = LocalIDProviderFactory;
