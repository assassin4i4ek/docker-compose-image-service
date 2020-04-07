FROM node:12.16.1-alpine
WORKDIR /usr/src/app/gateway
COPY package*.json ./
RUN npm ci --only=production
COPY ./dist ./dist
ENV PORT 3000
EXPOSE 3000
CMD npm run serve
