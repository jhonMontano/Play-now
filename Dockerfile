FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "=== VERIFICANDO ESTRUCTURA ===" && \
    ls -la && \
    echo "=== CONTENIDO DE SRC ===" && \
    ls -la src/ && \
    echo "=== BUSCANDO app.js ===" && \
    find . -name "app.js" || echo "⚠️  No se encontró app.js"

EXPOSE 4000

CMD ["node", "server.js"]