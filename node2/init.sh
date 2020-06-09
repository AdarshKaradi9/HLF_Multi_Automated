#!/bin/bash

#docker swarm leave --force
rm -r crypto-config channel-artifacts
rm connection-org2.json
cd ca_scripts
rm docker-compose-ca2.yaml
cd ..
echo "Initialized the network"
