#!/bin/bash

# Source directory path
SOURCE_DIRECTORY="./../../../assets/monster-hunter/mhtri/original"

# Destination directory path
DESTINATION_DIRECTORY="./../../../assets/monster-hunter/mhtri/monsters"

# Create the destination directory if it doesn't exist
mkdir -p "$DESTINATION_DIRECTORY"

# Copy all images from the source directory to the destination directory
find "$SOURCE_DIRECTORY" -type f \( -iname \*.jpg -o -iname \*.jpeg -o -iname \*.png \) -exec cp {} "$DESTINATION_DIRECTORY" \;

echo "Process completed. Images copied to $DESTINATION_DIRECTORY"
