#
FROM node:21.7.3 AS front-builder
COPY package.json yarn.lock ./
RUN sed -i -e 's#https://registry.yarnpkg.com/#http://172.24.19.70/repository/npm-proxy/#g' /yarn.lock
RUN npm config set registry  http://172.24.19.70/repository/npm-proxy/
RUN npm install
RUN mkdir /react-ui
RUN mv ./node_modules ./react-ui
WORKDIR /react-ui
COPY . .
RUN npm run build

FROM nginx:1.22.1


RUN rm -rf /usr/share/nginx/html/*
COPY Nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=front-builder /react-ui/build /usr/share/nginx/html
COPY Nginx/index.html /usr/share/nginx/html/docs/index.html


ENTRYPOINT ["nginx", "-g", "daemon off;"]

