FROM ruby:2.6.5-alpine3.11

RUN apk add --no-cache \
  g++ \
  make \
  nodejs \
  npm

RUN gem install bundler

WORKDIR /web

COPY Gemfile* /web/

RUN bundle install

COPY package.json package-lock.json /web/

RUN npm ci