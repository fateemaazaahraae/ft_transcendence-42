FROM nginx:alpine

RUN apk update && apk add openssl

RUN mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/certs/transcendence.key \
    -out /etc/nginx/certs/transcendence.crt \
    -subj "/CN=localhost"

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
