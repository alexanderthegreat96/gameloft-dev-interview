# Use Node.js as the base image
FROM node:latest as build

RUN mkdir -p /src/src/app
WORKDIR /usr/src/app
COPY ./frontend/package.json ./

RUN npm install

COPY ./frontend/. ./

VOLUME [ "/usr/src/app/node_modules" ]

RUN npm run build

FROM nginx:latest


RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
