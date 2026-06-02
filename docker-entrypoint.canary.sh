#!/bin/sh

chown -R appuser:appgroup /app/canary/database
chown -R appuser:appgroup /app/canary/assets

exec su-exec appuser "$@"
