#!/bin/bash

docker build -t my-go-app .

# รัน container เพื่อคัดลอก binary ออกมา
docker create --name extract my-go-app
docker cp extract:/app/main ./bin/webgsso
docker rm extract
