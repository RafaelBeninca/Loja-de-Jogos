FROM python:3.10.1


COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY src/ app/

ENV PORT 8080

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app