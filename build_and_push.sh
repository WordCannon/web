#!/bin/bash

export TAG="0.0.21"

echo "TAG IS $TAG"

docker build -t "wordcannon/web:${TAG}" .
docker push "wordcannon/web:${TAG}"