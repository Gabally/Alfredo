FROM nginx:1.21.6
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN rm -rf /usr/share/nginx/html/*
RUN cp -r dist/. /staticfiles
RUN rm -rf /usr/src/app
RUN chmod -R 755 /staticfiles