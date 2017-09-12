FROM mongo:latest

MAINTAINER Seth Terry

COPY dump /dump

#docker exec -it d73ac62d9fc4 /bin/bash