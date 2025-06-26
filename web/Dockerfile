FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache git curl

COPY web/package*.json ./
RUN npm install --only=production

COPY web/ ./

# 关键：加大 Node 构建内存限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
