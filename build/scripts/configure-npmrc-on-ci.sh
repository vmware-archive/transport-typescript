#!/bin/bash

ROOT=$(cd $(dirname $0)/../.. ; pwd)

if [ -e "${CI}" ] ; then
    echo "This script is meant to be run in GitLab CI environment!" >&2
    exit 1
fi

if [ -e "${NPM_AUTH}" ] ; then
    echo "npm credentials not found!" >&2
    exit 1
fi

cat <<EOF >> $ROOT/.npmrc
_auth=${NPM_AUTH}
email=appfabric-auto@vmware.com
always-auth=true
EOF

if [ $? -gt 0 ] ; then
    echo "Failed to append to .npmrc! Check if you have the correct permissions" >&2
    exit 1
fi

echo "Successfully configured .npmrc"