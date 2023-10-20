FROM docker.io/alpine:latest

ADD ./artifacts.zip /artifacts.zip
ADD ./build /build
ADD ./etc/nginx.conf /nginx.conf
RUN apk update && apk add zip nginx openjdk17 && mv /nginx.conf /etc/nginx/ && unzip /artifacts.zip && echo -e "nginx\njava -classpath /server.jar io.hostmanager.Server" >> /entrypoint && chmod u+rx /entrypoint
EXPOSE 80
ENTRYPOINT /entrypoint

