# ---------------------------------------------------------------
# Building stage
# ---------------------------------------------------------------
# Image of node version 22.16.0-alpine
FROM node:22.16.0-alpine@sha256:41e4389f3d988d2ed55392df4db1420ad048ae53324a8e2b7c6d19508288107e AS builder

# Setting working directory
WORKDIR /builder

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copying the rest of the application code
COPY public ./public
COPY server.js .

# Build the application
RUN npm init -y && npm install express

# -----------------------------------------------------------
# Production stage
# -----------------------------------------------------------
# Image of node version 22.16.0-alpine
FROM node:22.16.0-alpine@sha256:41e4389f3d988d2ed55392df4db1420ad048ae53324a8e2b7c6d19508288107e AS prod

WORKDIR /app

# Changing user to prod for security and changing working directory
RUN addgroup -g 10001 -S prod && \
    adduser -u 10000 -S -G prod prod && \
    chown -R prod:prod /app
USER prod:prod

# Copying only the necessary files from the builder stage
COPY --from=builder /builder/public ./public
COPY --from=builder /builder/server.js ./server.js
COPY --from=builder /builder/package.json ./package.json
COPY --from=builder /builder/node_modules ./node_modules

# Exposing the port on which the application will run
EXPOSE 3000

# Setting the entrypoint to start the Next.js application
ENTRYPOINT ["node", "server.js"]