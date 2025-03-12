FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.12.3-alpine3.20
WORKDIR /app
COPY requirements.txt requirements.txt
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache gcc musl-dev libffi-dev && \
    pip install --no-cache-dir -r requirements.txt
COPY . .

COPY --from=frontend /app/frontend/build /app/frontend/build
EXPOSE 5069
CMD ["gunicorn", "-w", "1", "-t", "60", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:5069", "app:app_asgi"]
