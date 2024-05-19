# Use the official Node.js image.
FROM node:18

# Install nc (netcat)
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Copy the entrypoint script
COPY entrypoint.sh /usr/src/app/entrypoint.sh

# Ensure the script is executable
RUN chmod +x /usr/src/app/entrypoint.sh

# Expose the application port
EXPOSE 3000

# Command to run the application
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["tenant1_db", "tenant2_db", "yarn", "start:dev"]
