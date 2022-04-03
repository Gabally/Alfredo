FROM node:16
RUN apt-get update -y
RUN apt-get install -y ffmpeg
EXPOSE 3000
WORKDIR /api
COPY package.json .
COPY src src
RUN npm install
CMD ["npm", "run", "start"]