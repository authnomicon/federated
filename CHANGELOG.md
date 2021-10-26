# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added

- Support for dispatching to multiple actions from OAuth 2.0 redirect endpoint.
- Added `authorize` action for storing tokens authorized by users.
- Added OpenID Connect `StateStore` component at `openidconnect/http/statestore`.

### Changed

- Login action no longer resumes state, instead calls next middleware in stack
to support subsequent actions after login.

### Fixed

- `repository` and `bugs` URLs in `package.json` pointed to correct GitHub
repository.


## [0.0.1] - 2021-10-21

- Initial release.

[Unreleased]: https://github.com/authnomicon/federated/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/authnomicon/federated/releases/tag/v0.0.1
