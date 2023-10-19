FROM docker.io/alpine:latest

ADD ./artifacts.zip /artifacts.zip
ADD ./build /build
RUN apk update && apk add zip openjdk17 && unzip /artifacts.zip && echo "java -classpath /server.jar io.hostmanager.Server" >> /entrypoint && chmod u+rx /entrypoint
EXPOSE 80
ENTRYPOINT /entrypoint

