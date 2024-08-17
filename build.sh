#!/bin/bash

# docker build -t your-app-builder .
# # docker run --rm -v $(pwd):/app your-app-builder
docker build -t my-go-app .
# docker run --rm -v $(pwd)/bin:/app  my-go-app

# รัน container เพื่อคัดลอก binary ออกมา
docker create --name extract my-go-app
docker cp extract:/app/main ./bin/webgsso
docker rm extract
