#!/bin/bash

# Create volumes
docker volume create backend
docker network create gameloft-net

# Run docker-compose
docker-compose build
docker-compose up
