# 使用轻量级的nginx镜像
FROM nginx:alpine

# 删除nginx默认的静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制项目文件到nginx html目录
COPY index.html style.css game.js morning.jpg /usr/share/nginx/html/

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
