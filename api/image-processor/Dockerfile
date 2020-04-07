FROM python:3.7
WORKDIR /usr/src/app/processor
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY src ./
ENV PORT 3000
EXPOSE 3000
CMD gunicorn --bind 0.0.0.0:${PORT} wsgi:app
