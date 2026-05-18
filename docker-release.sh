#!/usr/bin/env bash
set -euo pipefail

MAJOR="1"
MINOR="1.1"
PATCH="1.1.0"

docker build \
    -t "ghcr.io/fjrodafo/discord-app:${MAJOR}" \
    -t "ghcr.io/fjrodafo/discord-app:${MINOR}" \
    -t "ghcr.io/fjrodafo/discord-app:${PATCH}" \
    -t "ghcr.io/fjrodafo/discord-app:latest" \
    -t "fjrodafo/discord-app:${MAJOR}" \
    -t "fjrodafo/discord-app:${MINOR}" \
    -t "fjrodafo/discord-app:${PATCH}" \
    -t "fjrodafo/discord-app:latest" \
    .

docker build \
    -f Dockerfile.canary \
    -t "ghcr.io/fjrodafo/discord-app:canary" \
    -t "fjrodafo/discord-app:canary" \
    .

for tag in "${MAJOR}" "${MINOR}" "${PATCH}" "latest" "canary"; do
    docker push "ghcr.io/fjrodafo/discord-app:${tag}"
    docker push "fjrodafo/discord-app:${tag}"
done
