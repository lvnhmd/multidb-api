#!/bin/sh
# wait-for-it script to wait for the tenant databases

set -e

hosts="$1"
shift
cmd="$@"

for host in $hosts; do
  until nc -z "$host" 5432; do
    >&2 echo "Postgres at $host is unavailable - sleeping"
    sleep 1
  done
done

>&2 echo "Postgres is up - executing command"
exec $cmd
