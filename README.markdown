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

## Get it, run it

Note that this project repo includes two git sobmodule - clone with `--recursive` or later do `git submodule update --init`.

    git clone --recursive git@github.com:zmilojko/id5.git
    cd id5
    bundle install
    rake db:seed
    rails s
    
If everything went well, hit [http://localhost:3000/]() and you are good to go.
