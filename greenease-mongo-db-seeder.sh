docker build . -t greenease-mongo-db-seeder:latest -f ./mongo.dockerFile

docker tag greenease-mongo-db-seeder:latest 262704340563.dkr.ecr.us-east-1.amazonaws.com/greenease-mongo-db-seeder:latest

docker push 262704340563.dkr.ecr.us-east-1.amazonaws.com/greenease-mongo-db-seeder:latest