#!/bin/bash
source ./env.sh
docker swarm leave --force
ip="192.168.14.10"
echo $ip
docker swarm init --advertise-addr $ip
docker swarm join-token manager > token.txt 
grep docker token.txt > token.sh
ex -sc 's/$/ --advertise-addr 192.168.14.11/|w|q' token.sh
cat token.sh
scp token.sh ubuntu@192.168.14.11:/home/ubuntu/work/Sla-Violation-Multi/Sla-comp-2
scp env.sh ubuntu@192.168.14.11:/home/ubuntu/work/Sla-Violation-Multi/Sla-comp-2
docker network create --attachable --driver overlay $SWARM_NETWORK
echo "swarm connection established"

 
