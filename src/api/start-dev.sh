#!/bin/sh
if [ -f "/workapi/package.json" ];
then
    npm install
    npm run dev
fi