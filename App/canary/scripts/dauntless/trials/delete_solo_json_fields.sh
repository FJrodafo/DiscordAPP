#!/bin/bash

# Directory where the JSON files are located
JSON_DIRECTORY="./../../../database/dauntless/trials/solo"

# Loop through all JSON files in the directory
for FILE in "$JSON_DIRECTORY"/*.json; do
    # We use jq to process each JSON file
    jq '
    .payload.entries |= map(
        del(.phx_account_id, .player_role_id, .objectives_completed, .session_id)
    ) | .payload.entries
    ' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
done

echo "Fields removed in all solo JSON files!"
