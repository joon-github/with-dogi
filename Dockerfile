# Node.js를 포함하는 베이스 이미지 선택
FROM node:16-alpine 

# pnpm 설치
RUN apk add --no-cache curl bash && \
  curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm && \
  pnpm --version

RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD [ "node", "dist/main.js" ]