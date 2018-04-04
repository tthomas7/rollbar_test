# README

A rails configuration to test rollbar issue #594.

It's a react app written in typescript with a button that throws an exception.
I'm hoping the exception will show the function where the exception is thrown
rather than the rollbar library.

There isn't a lot of code here but there is a lot of configuration.
Rollbar,
Webpacker,
Babel,
Typescript,
React,

To run it:

ruby version 2.5.0
node version 9.10.1

./bin/yarn should install javascript dependencies
bundle install should install ruby dependencies

rails server

For deploying onto heroku

heroku labs:enable runtime-dyno-metadata

Need environment variables for
ROLLBAR_CLIENT_TOKEN

After deployment the following two commands should push sourcemaps to rollbar.

heroku run bash
./rollbar-deploy

