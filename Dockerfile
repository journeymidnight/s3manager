from node:5.10
maintainer Kerwin Piao <piaoyuankui@gmail.com>

add ./ /app
workdir /app

run npm install cnpm -g --registry=https://registry.npm.taobao.org
run cnpm install
run npm run lint
run npm run test
run npm run clean
run npm run build

workdir /app
