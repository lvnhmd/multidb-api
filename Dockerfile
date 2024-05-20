FROM node:18

# Install nc (netcat)
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Wait for tenant databases to be seeded with the below commands
COPY entrypoint.sh /usr/src/app/entrypoint.sh

RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["tenant1_db", "tenant2_db", "yarn", "start:dev"]
