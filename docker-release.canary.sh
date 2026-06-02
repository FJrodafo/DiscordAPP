#!/usr/bin/env bash
set -euo pipefail

docker build \
    -f Dockerfile.canary \
    -t "ghcr.io/fjrodafo/discord-app:canary" \
    -t "fjrodafo/discord-app:canary" \
    .
docker push "ghcr.io/fjrodafo/discord-app:canary"
docker push "fjrodafo/discord-app:canary"
