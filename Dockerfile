##
##  Dockerfile to build the UI and server back-end
##
##  Note: Docker.io may require a login
##
##  If the image terminates on "docker run", set DEBUG_CONTAINER_STARTUP=true
##  to park the server on a tail command to enable an exec shell command
##
##
FROM docker.io/alpine:latest

## We want to store the image tag inside the image, so that we can display the version to the end user
ARG IMAGE_TAG

## Keystore for the Java server
#ENV SSL_KEYSTORE=/server.jks

## Uncomment to build a dev image with the React dev server
ARG DEV_IMAGE=true

## A yarn build/maven package command should have run to build the server JAR, containing the back-end
## server and UI server
#ADD server.jar /server.jar
ADD etc/certs /etc/certs
#ADD git-commit-id /git-commit-id

# This is specific to the React development server, but
# is not used when running in "production" (i.e. Java) mode
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

#RUN echo -e '#!/bin/sh \n \
#    if [ -z $DEBUG_CONTAINER_STARTUP ]; then \n \
#      java -xlog:gc*::time $JAVA_HEAP_SIZE -DtrustValidationDisabled=true -jar /server.jar \n \
#    else \n \
#      tail -f /entrypoint \n \
#    fi' >/entrypoint && \
#    echo chmod u+rx /entrypoint && \
#    echo cd / && echo apk update && \
#    echo apk add openjdk11 jq curl python3-dev git py-pip && \
#    echo pip install pyaml && \
#    if $DEV_IMAGE; then apk add yarn && yarn install react fi

RUN apk update && \
    apk add jq curl git && \
    apk add openjdk11 maven && \
    apk add yarn && \
    yarn add react


ENTRYPOINT ["/entrypoint"]

EXPOSE 443
