#!/usr/bin/env bash

set -o nounset
set -o errtrace
set -o errexit
set -o pipefail

npm pack > /dev/null

PROJECT="GeocoderE2EApp"
NPM_PACKAGE="react-native-geocoder-*.tgz"

cd e2e
echo "Init project ${PROJECT}"
rm -rf $PROJECT
react-native init $PROJECT

cd $PROJECT
echo "Install package under test ${NPM_PACKAGE}"
npm install ../../$NPM_PACKAGE > /dev/null
rm -rf ../../$NPM_PACKAGE

echo "Prepare android"
cp -r ../android .

echo "Prepare JS app"
cp ../js/index.android.js .

echo "Compile android"
cd android
./gradlew clean > /dev/null
./gradlew assemble > /dev/null
