cd ../api/eureka
rm -rf target
mvn package -Dmaven.test.skip=true
cd target
mv demo-0.0.1-SNAPSHOT.jar eureka.jar
