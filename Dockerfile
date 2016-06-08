FROM node

RUN mkdir /home/boilerplate
WORKDIR /home/boilerplate

RUN git clone https://github.com/semyenov/boilerplate.git .
RUN npm install -g bower
RUN npm install -g gulpjs/gulp.git#4.0
RUN apt-get update && apt-get install -y wget
RUN wget -v https://gist.github.com/semyenov/03954f5f86067be606120e251ea5a208/raw/f0efe0e43f6d019861a3202ccca76928dd25786a/npm-f3-install.sh
RUN /bin/bash npm-f3-install.sh all
RUN bower install --allow-root

VOLUME /home/boilerplate/workspace
WORKDIR /home/boilerplate/workspace
EXPOSE 8000
EXPOSE 35729

CMD ["gulp"]
