#!/bin/bash

# Directory where the JSON files are located
JSON_DIRECTORY="./../../../database/dauntless/trials/group"

# Loop through all JSON files in the directory
for FILE in "$JSON_DIRECTORY"/*.json; do
    # We use jq to process each JSON file
    jq '
    .payload.entries |= map(
        .entries |= map(
            del(.phx_account_id, .player_role_id)
        )
        | del(.session_id, .objectives_completed)
    ) | .payload.entries
    ' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
done

echo "Fields removed in all group JSON files!"
