FROM node:latest

MAINTAINER Seth Terry

ENV NODE_ENV=development 

ENV NODE_HTTP_PORT=8080
ENV NODE_HTTPS_PORT=443

ENV MONGO_IP=mongodb

ENV SSL_START=ON

RUN npm install forever -g

COPY package.json /greenease/package.json

RUN cd greenease; npm install

ADD server.js /greenease/server.js

ADD public /greenease/public

ADD index.html /greenease/index.html

ADD cloud /greenease/cloud

WORKDIR   /greenease

EXPOSE $NODE_HTTP_PORT

EXPOSE $NODE_HTTPS_PORT

ENTRYPOINT ["forever", "server.js"]

#docker build . -t greenease:0.0.0

#docker run greenease:0.0.0 -d -p 8080:8080 
#docker run -d --net=host --name greenease_node_app -p 8080:8080 greenease:0.0.0 
#docker push 262704340563.dkr.ecr.us-east-1.amazonaws.com/greenease-test:latest
#docker tag greenease-test:latest 262704340563.dkr.ecr.us-east-1.amazonaws.com/greenease-test:latest