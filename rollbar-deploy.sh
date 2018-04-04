#!/bin/bash

ENVIRONMENT=$RAILS_ENV
ACCESS_TOKEN=$ROLLBAR_ACCESS_TOKEN
ASSET_HOST=$ASSET_HOST

LOCAL_USERNAME=$HEROKU_APP_NAME
REVISION=$HEROKU_SLUG_COMMIT

# find lists the files, xargs runs ls on each to sort by modified date,
# sed cuts them down to just the hash, and sed grabs just the first one.
HASH=$(find public/packs -name 'application*.js' -print0 | xargs -0 ls -lt | sed 's/.*application-\(.*\).js/\1/' | sed -n '1p')

# find lists the files, sed adds webpack info, tr removes new lines, sed trims
# trailing space.
# FILES=$(find -s app/javascript -name '*.js' |\
# sed 's/\(.*\)/\-F webpack:\/\/\/\.\/\1=@\1/' | tr '\n' ' ' | xargs)

FILES=$(find app/javascript -name '*.tsx' |\
  sed 's/\(.*\)/\-F "webpack:\/\/\/\.\/\1"="@\1"/' |\
  tr '\n' ' ' | sed 's/[ \t]*$//')

echo "Running on ${ENVIRONMENT} with token: ${ACCESS_TOKEN}, \
host: ${ASSET_HOST}, and HASH: ${HASH}."
echo "User is ${LOCAL_USERNAME}, revision: ${REVISION}"

# echo $FILES

echo '**Deploy**'
curl -v "https://api.rollbar.com/api/1/deploy/" \
  -F "access_token"="$ACCESS_TOKEN" \
  -F "environment"="$ENVIRONMENT" \
  -F "revision"="$REVISION" \
  -F "local_username"="$LOCAL_USERNAME"

echo '**Done Deploy**'
echo '**Source Maps**'

curl -v "https://api.rollbar.com/api/1/sourcemap" \
  -F "access_token"="$ACCESS_TOKEN" \
  -F "version"="$REVISION" \
  -F "minified_url"="$ASSET_HOST/packs/application-$HASH.js" \
  -F "source_map"="@public/packs/application-$HASH.js.map" \
  $FILES

echo '**Done Source Maps**'
