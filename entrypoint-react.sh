#!/bin/sh/env bash

cd /app/gamebox-react
set -ex \
  && npm install \
  && npm start

exec "$@"
