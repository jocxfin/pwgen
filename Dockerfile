FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt requirements.txt
RUN apk add --no-cache gcc musl-dev libffi-dev && \
    pip install --no-cache-dir -r requirements.txt
COPY . .
ENV WORKERS=2 THREADS=4
EXPOSE 5069
CMD gunicorn -w $WORKERS --threads $THREADS -k uvicorn.workers.UvicornWorker -b 0.0.0.0:5069 app:app_asgi
