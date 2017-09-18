docker build -t greenease-test .

docker tag greenease-test:latest 262704340563.dkr.ecr.us-east-1.amazonaws.com/greenease-test:latest
docker push 262704340563.dkr.ecr.us-east-1.amazonaws.com/greenease-test:latest