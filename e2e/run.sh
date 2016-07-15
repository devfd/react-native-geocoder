#!/usr/bin/env bash

set -o nounset
set -o errtrace
set -o errexit
set -o pipefail

echo "Start Appium"
node_modules/.bin/appium &
APPIUM_PID=$!

echo "Start static http server"
http-server &
HTTPSERVER_PID=$!

echo "Start packager"
node e2e/GeocoderE2EApp/node_modules/react-native/local-cli/cli.js start --reset-cache &
PACKAGER_PID=$!

sleep 5

node_modules/.bin/mocha --require test/setup.js test/e2e && SUCCESS=$? || SUCCESS=$?

kill $APPIUM_PID
kill $HTTPSERVER_PID
kill $PACKAGER_PID

exit $SUCCESS
