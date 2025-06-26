# Dify Web Dockerfile
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    git \
    curl

# 复制 package 文件
COPY web/package*.json ./

# 安装依赖 (使用 npm install 而不是 npm ci)
RUN npm install --only=production

# 复制应用代码
COPY web/ ./

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]

