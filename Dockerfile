FROM node:18-alpine

WORKDIR /app

# Install Chromium and fonts (for future headless Chrome tests)
RUN apk add --no-cache chromium udev ttf-freefont nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_BIN=/usr/bin/chromium

COPY package.json ./
RUN npm install

COPY . .

CMD ["npm", "test"]
