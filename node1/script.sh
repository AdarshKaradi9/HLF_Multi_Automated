#!/bin/bash

docker exec $(docker ps | awk '($2 ~ /.*.tools.*./) {print $10}') scripts/script.sh
echo "done"
