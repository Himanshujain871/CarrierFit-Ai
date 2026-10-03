FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5173

# Configure nginx to listen on 5173 and fallback to index.html for SPA routing
RUN sed -i 's/listen       80;/listen       5173;/g' /etc/nginx/conf.d/default.conf
RUN sed -i '/location \/ {/a \        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
