FROM python:3.12.3-alpine


COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt
COPY ./src .

ENV PORT 5000

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app