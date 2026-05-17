#!/usr/bin/env bash
set -euo pipefail

MAJOR="1"
MINOR="1.0"
PATCH="1.0.0"

build_and_push() {
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

    for tag in "${MAJOR}" "${MINOR}" "${PATCH}" "latest"; do
        docker push "ghcr.io/fjrodafo/discord-app:${tag}"
        docker push "fjrodafo/discord-app:${tag}"
    done
}

build_and_push
