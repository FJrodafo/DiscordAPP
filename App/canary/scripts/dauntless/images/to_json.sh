#!/bin/bash

# Path to the directory containing the image files
DIRECTORY="./../../../assets/dauntless/builds"

# Output JSON file path
JSON_FILE="./../../../assets/dauntless/icons.json"

# Create the header of the JSON file
echo "[" > $JSON_FILE

# Iterate over the .jpg, .jpeg, and .png files in the directory
for IMAGE_FILE in "$DIRECTORY"/*.{jpg,jpeg,png}; do
    # Get only the file name (without the path)
    FILE_NAME=$(basename "$IMAGE_FILE")

    # Add the file name to the JSON file
    echo "  \"$FILE_NAME\"," >> "$JSON_FILE"
done

# Use find to get all .jpg, .jpeg, and .png files in the directory and its subdirectories
# find "$DIRECTORY" -type f \( -iname \*.jpg -o -iname \*.jpeg -o -iname \*.png \) | while read -r IMAGE_FILE; do
#     # Get only the file name (without the path)
#     FILE_NAME=$(basename "$IMAGE_FILE")
# 
#     # Add the file name to the JSON file
#     echo "  \"$FILE_NAME\"," >> "$JSON_FILE"
# done

# Remove the last comma from the JSON file
sed -i '$ s/,$//' $JSON_FILE

# Close the JSON file
echo "]" >> $JSON_FILE

echo "Generated JSON file: $JSON_FILE"
