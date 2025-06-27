FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache git curl

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./
ENV NODE_ENV=production
RUN pnpm install --prod

COPY ./ ./

# 关键：加大 Node 构建内存限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 临时跳过生产构建，直接用开发模式启动
CMD ["npm", "run", "dev"]

EXPOSE 3000

CMD ["npm", "start"]
