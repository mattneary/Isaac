#!/bin/bash

BASEDIR=$(dirname $0)
echo $BASEDIR

cd $BASEDIR
rm ./engine.min.js
cat ./components/IO.js ./components/Scene.js ./components/Shapes.js ./components/Character.js ./components/CharacterList.js > ./engine.js

./minify ./engine.js

afplay /System/Library/Sounds/Glass.aiff