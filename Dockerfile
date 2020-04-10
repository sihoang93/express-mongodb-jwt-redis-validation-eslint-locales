FROM node:carbon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN npm i

EXPOSE 6789

CMD ["npm run start"]