# README

A test bed that relatively closely matches my production environment as of
April, 2018. I use it to share issues I bump into.

Currently used to showcase a syntax error I see with braintree on internet
explorer.

Originally it was for rollbar.js jssue #594. But I think this was just an awful
error message so I'm reusing this repo.

It's a react app written in typescript with a button that throws an exception.
It was originally used to test that source maps were working.

There isn't a lot of code here but there is some configuration.
It's a relatively standard, if modern, rails app using the following.

* Webpacker
* Babel
* Typescript
* React

To run it use ruby version 2.5.0 && node version 9.10.1

```
./bin/yarn should install javascript dependencies
bundle install should install ruby dependencies
```

rails server

To show internet explorer bug I use virtualbox

```
RAILS_ENV=production NODE_ENV=production rails assets:clobber && rails assets:precompile
SECRET_KEY_BASE="asdfasdf" RAILS_ENV=production NODE_ENV=production rails server -b 0.0.0.0
```
Virtual box, windows, IE, 10.0.2.2 (IP address may change).

