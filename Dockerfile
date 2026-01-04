FROM node:20.17.0-alpine

WORKDIR /app

ARG SERVICE_PORT=5003
ARG NEXT_PUBLIC_API_URL

ENV SERVICE_PORT=${SERVICE_PORT}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# RUN echo "Based on commit: $NEXT_PUBLIC_BASE_API_URL"

COPY package*.json yarn.lock* ./
COPY . .
RUN yarn install --frozen-lockfile || yarn install

RUN yarn build

EXPOSE $SERVICE_PORT

# Start the application
CMD ["yarn", "start"]