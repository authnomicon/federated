function LocalIDPSchemeFactory(scheme) {
  this._scheme = scheme;
}

LocalIDPSchemeFactory.prototype.create = function() {
  // TODO: check the provider and protocol here, and fail if no match
  
  return Promise.resolve(this._scheme);
}

module.exports = LocalIDPSchemeFactory;
