#!/bin/bash

# Source folder path
source_folder="./App/src/assets/dauntless/icons"

# Destination folder path
destination_folder="./App/src/assets/dauntless/builds"

# Create the destination folder if it doesn't exist
mkdir -p "$destination_folder"

# Copy all images from the source folder to the destination folder
find "$source_folder" -type f \( -iname \*.jpg -o -iname \*.jpeg -o -iname \*.png \) -exec cp {} "$destination_folder" \;

echo "Process completed. Images copied to $destination_folder"
