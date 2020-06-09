#!/bin/bash

docker swarm leave --force
ip="$(ifconfig | grep -A 1 'enp' | tail -1 | cut -d ':' -f 2 | cut -d ' ' -f 1)"
echo $ip
docker swarm init --advertise-addr $ip
docker swarm join-token manager
echo "Give name for overlay network"
read net
export STACK_NAME=$net
docker network create --attachable --driver overlay $net
./bymn.sh generate crypto-config.yaml
cd crypto
rm -R *
cd ..
cp  -r -t crypto crypto-config channel-artifacts
cp ca_scripts/docker-compose-ca2.yaml ./crypto
cp connection-org2.json ./crypto
cd ca_scripts
rm docker-compose-ca2.yaml
cd ..
echo "Start the network when ready"

