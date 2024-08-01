#!/bin/bash

docker build -t your-app-builder .
docker run --rm -v $(pwd):/app your-app-builder
