# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `GatewayIntentBits.MessageContent` privileged intent to enable the bot to read and respond to messages via the `messageCreate` event.

### Changed

- ...

### Deprecated

- ...

### Removed

- ...

### Fixed

- ...

### Security

- ...

## [1.0.3] - 2026/05/18

### Added

- Dashboard support for the canary version.

### Changed

- Moved `randomMovie`, `randomGame`, and `status` array inside `updateStatus()` so new random values are computed on every call.

### Fixed

- Random game and movie titles not rotating on each status update interval.

## [1.0.2] - 2026/04/13

### Added

- npm Badges in `README.md`.

### Changed

- Project description.

## [1.0.1] - 2026/04/13

### Added

- npm package published to npmjs and GitHub Packages (`@fjrodafo/discord-app`).
- Publish scripts: `publish:npm` and `publish:github`.

### Security

- Added `/.env.*` to `.dockerignore` to prevent environment files from being included in the Docker image.

## [1.0.0] - 2026/04/12

### Added

- Discord APP with command handler and event system.
- Admin commands: `ping`, `prune` and `reload`.
- Context menu commands: `avatar` and `user`.
- Help command: `help`.
- Moderation command: `kick`.
- Utility commands: `buttons`, `embed`, `info`, `paginate` and `select-menus`.
- Automatic command deployment via `deploy-commands.js` (guild and global).
- Command cooldown system with per-user cooldown tracking.
- Bot presence with rotating status (custom, listening, watching, playing, competing, streaming).
- Event listeners: `interactionCreate`, `messageCreate` and `ready`.
- Responds to `hello` messages with `Hello, World!`.
- Web dashboard with public UI (`index.html`, `script.js`, `style.css`).
- Dashboard routes: `api`, `logs` and `metrics`.
- Dashboard logging on bot ready (bot tag and server count).
- Docker support: `Dockerfile`, `docker-compose.yaml` and `.dockerignore`.

[Unreleased]: https://github.com/FJrodafo/DiscordAPP/compare/1.0.3...HEAD
[1.0.3]: https://github.com/FJrodafo/DiscordAPP/releases/tag/1.0.3
[1.0.2]: https://github.com/FJrodafo/DiscordAPP/releases/tag/1.0.2
[1.0.1]: https://github.com/FJrodafo/DiscordAPP/releases/tag/1.0.1
[1.0.0]: https://github.com/FJrodafo/DiscordAPP/releases/tag/1.0.0
