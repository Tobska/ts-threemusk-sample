FROM node:lts-alpine3.19

WORKDIR /build

COPY . .

RUN npm ci

RUN npm run compile

RUN npm prune --production

###

FROM node:lts-alpine3.19

ARG CI_COMMIT_SHORT_SHA
ENV COMMIT_HASH="${CI_COMMIT_SHORT_SHA}"

WORKDIR /app

COPY --from=builder /build/.github/scripts/start.sh ./scripts/start.sh

COPY --from=builder /build/assets ./assets

COPY --from=builder /build/node_modules ./node_modules

COPY --from=builder /build/dist ./dist

EXPOSE 4000

CMD ["node", "./dist/server.js"]
