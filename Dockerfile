FROM node:16.0.0-alpine AS build

MAINTAINER Jaympion

## work dir  
WORKDIR /Users/alexanderx/gopath/src/tqxd/hermes-aitd
COPY . /Users/alexanderx/gopath/src/tqxd/hermes-aitd

#RUN npm config set registry http://registry.npm.taobao.org/

## install & build  
#RUN npm install  --legacy-peer-deps
RUN yarn && yarn build 

FROM nginx:alpine as runtime 

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=build /Users/alexanderx/gopath/src/tqxd/hermes-aitd/build /usr/share/nginx/html/ 
COPY --from=build /Users/alexanderx/gopath/src/tqxd/hermes-aitd/nginx/default.conf /etc/nginx/conf.d/default.conf  

EXPOSE 7251
EXPOSE 80

