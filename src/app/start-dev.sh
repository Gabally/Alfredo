#!/bin/sh
if [ -f "/app/package.json" ];
then
    npm install
    npm run serve
fi