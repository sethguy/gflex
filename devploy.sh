eval $(docker-machine env dev)

docker stop greenease_node_app

docker rm greenease_node_app
docker build . -t greenease:0.0.0
docker run -d --net=host --name greenease_node_app -p 8080:8080 greenease:0.0.0 