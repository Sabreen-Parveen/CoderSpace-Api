FROM node:10.22.0-jessie
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
