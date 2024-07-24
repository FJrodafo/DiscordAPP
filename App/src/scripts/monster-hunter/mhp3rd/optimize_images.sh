#!/bin/bash

CONVERT="convert"

# on windows there ImageMagick convert is called "magick convert" instead of "convert"
if [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
    CONVERT="magick convert"

    if [[ ! $(command -v magick) ]]; then
        echo "ERR: Could not find magick command"
        exit 1
    fi
else
    if [[ ! $(command -v $CONVERT) ]]; then
        echo "ERR: Could not find $CONVERT command"
        exit 1
    fi
fi

if [[ ! $(command -v optipng) ]]; then
  echo "ERR: Could not find optipng command"
  exit 1
fi

function optimize_path () {
    for file in $(find $1 -name '*.png')
    do
        if [[ $(identify -format "%wx%h" $file) != "84x84" ]]; then
            # resize to 84px height
            $CONVERT -resize 84x84 -gravity center -extent 84x84 -background none "$file" "$file"
        fi

        # optmize images
        optipng -silent -O2 "$file"
    done
}

echo "Optimizing images..."
optimize_path ./App/src/assets/monster-hunter/mhp3rd/monsters
echo "...done"
