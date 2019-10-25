#!/bin/sh/env bash

cd /app/gamebox
set -ex \
  && npm install \
  && $(npm bin)/ng serve --watch --port 80 --host 0.0.0.0 --aot --disable-host-check

exec "$@"
