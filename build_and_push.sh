#!/bin/bash

docker build -t wordcannon/web .
docker push wordcannon/web
