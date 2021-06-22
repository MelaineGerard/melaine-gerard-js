FROM alpine:latest
LABEL maintainer="Melaine GERARD <pro@melaine-gerard.fr>"
LABEL version="0.1"

WORKDIR /app

run mkdir /app



RUN apk add --update --no-cache \
git \
openssh-client \
openssh-server \
nodejs \
npm

EXPOSE 3000
CMD [ "npm", "start"]
