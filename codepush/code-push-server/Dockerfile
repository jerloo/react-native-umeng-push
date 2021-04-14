FROM node:8.11.4-alpine
WORKDIR /app
RUN npm config set registry https://registry.npm.taobao.org/ \
    && npm i -g code-push-server@5.7.1 pm2@latest --no-optional

EXPOSE 3000

CMD ["code-push-server"]
