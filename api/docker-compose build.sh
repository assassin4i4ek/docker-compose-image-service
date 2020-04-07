cd ../build_sh
./build_gateway.sh
./build_eureka.sh
./build_storage.sh
./build_zuul.sh
cd ../api
docker-compose build
