FROM node:10.14.2-jessie
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
