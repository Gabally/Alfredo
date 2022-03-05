FROM node:16
WORKDIR /temp
EXPOSE 3000
COPY start-dev.sh . 
RUN chmod +x start-dev.sh
WORKDIR /workapi
ENTRYPOINT [ "/temp/start-dev.sh" ]