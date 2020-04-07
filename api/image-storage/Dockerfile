FROM node:12.16.1-alpine
WORKDIR /usr/src/app/image-storage
COPY package*.json ./
RUN npm ci --only=production
COPY ./dist ./dist
ENV PORT 3000
ENV EUREKA_HOST localhost
ENV EUREKA_PORT 8761
ENV MAPPED_PORT 3000
EXPOSE 3000
CMD npm run serve
