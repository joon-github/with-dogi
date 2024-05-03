# Node.js를 포함하는 베이스 이미지 선택
FROM node:latest

# pnpm 설치
RUN npm install -g pnpm

RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD [ "node", "dist/main.js" ]