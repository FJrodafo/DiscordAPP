# DiscordAPP

[![GitHub Pages](https://img.shields.io/badge/%20-FFFFFF?style=social&logo=githubpages&logoColor=black&logoSize=auto)](https://fjrodafo.github.io/DiscordAPP/)
[![GitHub Stars](https://img.shields.io/github/stars/FJrodafo/DiscordAPP?style=social&logo=github&logoColor=black&label=Stars&labelColor=FFFFFF&color=FFFFFF)](https://github.com/FJrodafo/DiscordAPP/stargazers)

[![Discord](https://img.shields.io/discord/1055998258025091102?style=flat&logo=discord&logoColor=ffffff&label=&color=5865F2)](https://discord.com/oauth2/authorize?client_id=1260588948544290927)

## Index

1. [Introduction](#introduction)
2. [Project structure](#project-structure)
3. [Clone the repository](#clone-the-repository)
4. [Set up the project](#set-up-the-project)
5. [Install dependencies](#install-dependencies)
6. [Final steps](#final-steps)
7. [Using Docker](#using-docker)
8. [Available Scripts](#available-scripts)
9. [Additional information](#additional-information)
10. [Credits](#credits)

## Introduction

A simple Discord Application made in JavaScript!

This project has been developed on a [Linux](https://github.com/torvalds/linux) system. To learn more about the system, visit the [Dotfiles](https://github.com/FJrodafo/Dotfiles) repository.

This project was built by following the [Discordjs guide](https://discordjs.guide/). I have modified small details of the code. This is just an example of what the final project would look like.

## Project structure

```
/
├── dashboard/
│   ├── public/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── routes/
│   │   ├── api.js
│   │   ├── logs.js
│   │   └── metrics.js
│   ├── utils/
│   │   ├── format.js
│   │   └── logs.js
│   └── index.js
├── docs/
|   ├── _config.yaml
|   ├── CODE_OF_CONDUCT.md
|   ├── README.md
|   └── SECURITY.md
├── src/
│   ├── commands/
│   │   ├── admin/
│   │   │   ├── ping.js
│   │   │   ├── prune.js
│   │   │   └── reload.js
│   │   ├── context-menu/
│   │   │   ├── avatar.js
│   │   │   └── user.js
│   │   ├── help/
│   │   │   └── help.js
│   │   ├── moderation/
│   │   │   └── kick.js
│   │   └── utility/
│   │       └── *.js
│   ├── events/
│   │   ├── interactionCreate.js
│   │   ├── messageCreate.js
│   │   └── ready.js
│   ├── utils/
│   │   └── emoji.js
│   ├── config.json
│   ├── deploy-commands.js
│   └── index.js
├── CONTRIBUTING
├── LICENSE
├── docker-compose.yaml
├── Dockerfile
├── eslint.config.js
├── package-lock.json
└── package.json
```

## Clone the repository

Open a terminal in the directory where you store your repositories and clone it with the following command:

```shell
# HTTPS
git clone https://github.com/FJrodafo/DiscordAPP.git
```

```shell
# SSH
git clone git@github.com:FJrodafo/DiscordAPP.git
```

## Set up the project

This project needs a `config.json` into the `src/` directory with some data related to your Discord server and your APP token (Make sure you have an APP created in the [Discord Developer Portal](https://discord.com/developers/applications)):

```shell
cp src/config.example.json src/config.json
```

## Install dependencies

This project must be initialized and the necessary dependencies installed with the following command:

```shell
npm i
```

## Final steps

If you have the `config.json` file into the `src/` directory correctly configured and Node v24.x installed on your machine, then you are good to go!

To check if you already have Node installed on your machine, run `node -v` in your terminal. Otherwise, you will need to install Node v24.x or higher or, as a last option, check out the [Docker](#using-docker) alternative.

Finally, if you have Node installed, run the following command to activate your Discord APP:

```shell
npm start
# Press 'Ctrl + C' to exit
```

Open Discord and access the server where your Discord APP is located to see the result.

## Using Docker

You can find a Docker image of this project ready to be pulled on [GitHub Packages](https://github.com/FJrodafo/DiscordAPP/pkgs/container/discord-app) or [Docker Hub](https://hub.docker.com/r/fjrodafo/discord-app) official website!

Pull the latest image with the following commands:

```shell
# GitHub Packages
docker pull ghcr.io/fjrodafo/discord-app:latest
```

```shell
# Docker Hub
docker pull fjrodafo/discord-app:latest
```

> [!IMPORTANT]
> 
> Please note that when using Docker, port 3000 on localhost will be occupied by the Discord application for its proper functioning.
> 
> If you already have applications that use port 3000, don't worry, the dashboard uses the [@fjrodafo/port-finder](https://github.com/FJrodafo/PortFinder) library, which will always search for a free port to run the application without any problems.

### Run with Docker Compose (Recommended)

Make sure to create the `config.json` file into the `src/` directory before continuing (This file is used only at runtime, is ignored by Git and Docker, and is not included in the image).

Build the container:

```shell
docker compose build
```

> [!NOTE]
> 
> If you want to build the image locally, uncomment the `build` section in `docker-compose.yaml` and run `docker compose build`. Otherwise, skip directly to the next step.

Run the container:

```shell
docker compose up -d
```

Stop the Container:

```shell
docker compose down
```

### Build Docker image manually

If you prefer not to use Docker Compose, you can build and run the image manually.

If you don't have Node v24.x or higher installed on your machine, you can build a Docker image by running the [Dockerfile](https://github.com/FJrodafo/DiscordAPP/blob/main/Dockerfile) (Make sure to create and configure the `config.json` file correctly into the `src/` directory before building the docker image).

Open a terminal and run the following command:

```shell
docker build -t discord-app:latest .
```

After the build completes, you can run your container with the following command:

```shell
docker run -dp 127.0.0.1:3000:3000 discord-app:latest
```

### Build & Push (Ignore this subsection)

```shell
docker build \
  -t ghcr.io/fjrodafo/discord-app:1 \
  -t ghcr.io/fjrodafo/discord-app:1.0 \
  -t ghcr.io/fjrodafo/discord-app:1.0.0 \
  -t ghcr.io/fjrodafo/discord-app:latest \
  -t fjrodafo/discord-app:1.0.0 \
  -t fjrodafo/discord-app:latest \
  .

docker push ghcr.io/fjrodafo/discord-app:1
docker push ghcr.io/fjrodafo/discord-app:1.0
docker push ghcr.io/fjrodafo/discord-app:1.0.0
docker push ghcr.io/fjrodafo/discord-app:latest
docker push fjrodafo/discord-app:1.0.0
docker push fjrodafo/discord-app:latest
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Once configured, run the APP. It first deploy the commands, updating both on the guild server and globally (You can edit the commented lines of code in the [deploy-commands.js](./src/deploy-commands.js) file to customize the deploy of the APP commands).

### `npm run canary`

Once configured, run a Canary version of the APP. It works exactly the same as the main APP. This version is intended to test new commands and experimental implementations to ensure they work before publishing changes, preventing any bugs that may cause malfunctions.

### `npm run eslint`

Runs the eslint to find possible formatting errors in the code.

### `npm run eslintfix`

Automatically fixes all errors caught by eslint.

### `npm test`

There are currently no tests configured.

### `npm run tarball`

Simulates packaging a project into a `.tgz` archive (as if preparing it for distribution) without actually generating the file.

## Additional information

Do you want to try a sample of the APP yourself? Add it to any server! [link](https://discord.com/oauth2/authorize?client_id=1260588948544290927)

## Credits

Thanks to the [Discordjs](https://discord.js.org/) team for creating an amazing library and making Discord APP development easier!
