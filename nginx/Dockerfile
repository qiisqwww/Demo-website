FROM nginx:1.27.2-alpine-slim

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/
COPY daw.crt /etc/nginx
COPY daw.key /etc/nginx

CMD ["nginx", "-g", "daemon off;"]