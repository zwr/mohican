# Id5 - Mohican Celesta Integration Application

The purpose of this project is to be development and test bed for Mohican framework
as well as to facilitate later Celesta integration.

Thus it runs in two modes:

* Stand alone - where data comes from local Mongo and
* Proxy mode - where resources come from local rack while AJAX is just proxied to Celesta.

The latter is not at the moment described in this document.

# Installation

## Prerequisites

* Linux or MAC
* Ruby 2.x, recommended 2.2 on RVM
* MongoDB
* Git, 2.x (any would work, but instructions might fail)
* NodeJS, recommended 0.12.2 on NVM

## Get it, run it

Note that this project repo includes two git sobmodule - clone with `--recursive` or later do `git submodule update --init`.

    git clone --recursive git@github.com:zmilojko/id5.git
    cd id5
    npm install
    bundle install
    rake db:seed
    rails s

If everything went well, hit [http://localhost:3000/]() and you are good to go.

## Export it

It should be enough to run in the Rails.root:

    rake tmp:clear ; rm -rf public/assets; rm tmp/assets.tar.gz ; rake assets:precompile ; rake zwr:undigest_assets

and everything should be in public/assets, plus the package tmp/assets.tar.gz.

### Naming convention

At this point, releases are ordered by number, so Mohican release 002 is just
that. There can be more apps based on same Mohican release, but Mohican release
must be tagged with a tag mn_002.

Any shipped package should be named the following:

    mn_002_appname_hash.tar.gz

where 002 is the mohican release matching a tag, appname is a free and
possibly empty app name and hash is an exact hash of the commit which is packed.
This hash will mostly not match the tag, but hte tag must be its ancestor and
no changes in Mohican must be in between, only the demo app.
