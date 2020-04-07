FROM openjdk:11-jre-slim
WORKDIR /usr/src/app/zuul
COPY target/zuul.jar ./
EXPOSE 8080
CMD java -jar zuul.jar
