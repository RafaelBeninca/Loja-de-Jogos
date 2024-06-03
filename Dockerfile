FROM python:3.12.3-alpine


COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt
COPY ./src .

# ARG DATABASE_CONNECTION
# ENV DATABASE_CONNECTION=${DATABASE_CONNECTION}

# ARG JWT_SECRET_KEY
# ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}

ENV PORT 5000

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app