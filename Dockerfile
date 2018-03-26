FROM node:6.6

MAINTAINER Jeff Scelza <jeffrey.scelza@charter.com>
MAINTAINER Stefan Liedle <stefan.liedle@charter.com>

ENV PATH=/usr/local/bin/:${PATH}

# Update apt-get & Install apt packages
RUN apt-get -qq update && apt-get -qq install -y \
    apt-utils \
    git \
    libssl-dev \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set NPM properties
RUN npm set progress=false

# Install global dependencies
RUN npm cache clean  && npm cache clean -g
RUN npm install --global \
  gulp-cli \
  bower \
  gulp \
  phantomjs \
  jasmine

# Obtain and install Docker brinaries
RUN wget -N -P /tmp https://get.docker.com/builds/Linux/x86_64/docker-latest.tgz
RUN tar -xvzf /tmp/docker-latest.tgz -C /tmp
RUN mv /tmp/docker/* /usr/bin/
RUN rm -rf /tmp/docker /tmp/docker-latest.tgz

# Download docker-compose
RUN curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose
RUN chmod +x /usr/bin/docker-compose

ENV PHANTOMJS_BIN=/usr/local/lib/node_modules/phantomjs/bin/phantomjs

# SSH
COPY ./.docker/ssh/* /root/.ssh/
RUN chmod -R 700 /root/.ssh

# Install project dependencies
COPY ./package.json /package.json
RUN npm install --unsafe-perm

WORKDIR /builds/portals/ovp
