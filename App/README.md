## Index

1. [Attribution](#attribution)
2. [Project Structure](#project-structure)
3. [Download the code](#download-the-code)
4. [Set up the project](#set-up-the-project)
5. [Install dependencies](#install-dependencies)
6. [Final steps](#final-steps)
7. [Using Docker](#using-docker)
8. [Available Scripts](#available-scripts)
9. [Resources](#resources)

## Attribution

This project was build by following the [Discordjs guide](https://discordjs.guide/). I have modified small details of the code. This is just an example of what the final project would look like. Thanks to the [Discordjs](https://discord.js.org/) team for creating an amazing library and making Discord APP development easier!

## Project Structure

<details>
<summary>Click me</summary>

```
App/
├── node_modules/
│   └── ...
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
├── docker-compose.yaml
├── Dockerfile
├── eslint.config.js
├── package-lock.json
└── package.json
```
</details>

## Download the code

Open your directory where you save your repositories and clone it with the following command:

```shell
# From GitHub
git clone https://github.com/FJrodafo/DiscordAPP.git
```

## Set up the project

This project needs a `config.json` into the `src` directory with some data related to your Discord server and your APP token (Make sure you have an APP created in the [Discord Developer Portal](https://discord.com/developers/applications)):

```json
{
    "guildId": "",
    "clientId": "",
    "token": ""
}
```

## Install dependencies

As well, this project must be initialized and the necessary dependencies installed with the following command (Make sure you are in the `App` directory):

```shell
npm install
```

## Final steps

If you have the `config.json` file into the `src` directory correctly configurated and Node v22.14.0 installed on your machine, then you are good to go!

To check if you already have Node installed on your machine, run `node -v` in your terminal. Otherwise, you will need to install Node v22.14.0 or, as a last option, check out the [Docker](#using-docker) alternative.

Finally, if you have Node installed, run the following command to activate your Discord APP (Make sure you are in the `App` directory):

```shell
npm start
# Press 'Ctrl + C' to exit
```

Open Discord and access the server where your Discord APP is located to see the result.

## Using Docker

### Run with Docker Compose

Make sure to create and configurate the `config.json` file correctly into the `src` directory before running Docker commands...

Build the container (Make sure you are in the `App` directory):

```shell
docker compose build
```

Run the container:

```shell
docker compose up -d
```

Stop the Container:

```shell
docker compose down
```

### Build Docker image on your own

If you don't have Node v22.14.0 installed on your machine, you can build a Docker image by running the [Dockerfile](./Dockerfile) (Make sure to create and configurate the `config.json` file correctly into the `src` directory before building the docker image).

Open a terminal and run the following command (Make sure you are in the `App` directory):

```shell
docker build -t discord-app .
```

After the build completes, you can run your container with the following command:

```shell
docker run -dp 127.0.0.1:3000:3000 discord-app
```

Get the container ID:

```shell
docker ps -a
```

Stop the container:

```shell
docker stop <container-id>
```

Delete the container:

```shell
docker rm <container-id>
```

> [!IMPORTANT]
> 
> Please note that when using Docker, port 3000 on localhost will be occupied by the Discord application for its proper functioning.
> 
> If you already have applications that use port 3000, you will need to adjust certain parameters before creating the Docker container so that it can run correctly on a free port.

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

## Resources

Do you want to try a sample of the APP yourself? Add it to any server by clicking the following link: https://discord.com/oauth2/authorize?client_id=1260588948544290927