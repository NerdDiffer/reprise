#!/bin/sh

init() {
  PGUSER=$1
  PGDATABASE=$2

  # initialize the user
  createuser $PGUSER -deRSU postgres

  # create a db
  createdb $PGDATABASE -eU $PGUSER
}

reset() {
  PGUSER=$1
  PGDATABASE=$2

  dropdb $PGDATABASE --if-exists -eU postgres
  dropuser $PGUSER --if-exists -eU postgres
  init $PGUSER $PGDATABASE
}

reset 'reprise' 'reprise_development'
