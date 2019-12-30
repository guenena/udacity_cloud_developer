FROM node:12

FROM beevelop/ionic AS ionic

WORKDIR /Users/omar.guenena/docker-images

COPY . ./

RUN npm ci

RUN ionic build

EXPOSE 8080

FROM nginx:alpine
#COPY www /usr/share/nginx/html
COPY --from=ionic  /Users/omar.guenena/docker-images/www /usr/share/nginx/html