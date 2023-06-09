FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=8080
EXPOSE ${PORT}
CMD [ "npm", "start" ]
