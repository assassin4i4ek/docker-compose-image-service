cd ../app
npm run build
mv build ../api/gateway/dist
cd ../api/gateway/dist
rm -rf app 
mv build app
