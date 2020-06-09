#!/bin/bash

docker volume rm $(docker volume ls)
docker rmi -f $(docker images | awk '($1 ~ /dev-peer.*.logchain.*/) {print $3}')
docker rm $(docker ps -aq)


