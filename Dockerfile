FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5069
CMD ["uwsgi", "--http", "0.0.0.0:5069", "--module", "app:app", "--processes", "4", "--threads", "2"]
