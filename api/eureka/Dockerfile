FROM openjdk:11-jre-slim
WORKDIR /usr/src/app/eureka
COPY target/eureka.jar ./
EXPOSE 8761 
CMD java -jar eureka.jar
