#!/bin/sh

chown -R appuser:appgroup /app/canary/database
chown -R appuser:appgroup /app/canary/assets/command-output

exec su-exec appuser "$@"
