FROM node:lts
WORKDIR /usr/discordplayspokemon
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm", "start" ]
