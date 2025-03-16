FROM apify/actor-node:20 AS builder

RUN npm ls apify

COPY package*.json ./

RUN npm install --include=dev --audit=false

COPY . ./

RUN npm run build

FROM apify/actor-node:20

RUN npm ls apify

COPY package*.json ./

RUN npm --quiet set progress=false \
    && npm install --omit=dev --omit=optional \
    && echo "Installed NPM packages:" \
    && (npm list --omit=dev --all || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version \
    && rm -r ~/.npm

COPY --from=builder /usr/src/app/dist ./dist

COPY . ./

RUN adduser -h /home/apify -D apify && \
    chown -R apify:apify ./
USER apify

CMD npm run start:prod --silent
