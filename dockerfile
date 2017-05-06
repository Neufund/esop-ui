FROM nginx:stable-alpine

RUN rm /usr/share/nginx/html/*

COPY ./build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf