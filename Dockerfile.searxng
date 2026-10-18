FROM searxng/searxng:latest

# Copy customized settings into image so it does not rely on host volume mounts
COPY config/searxng/settings.yml /etc/searxng/settings.yml

ENV SEARXNG_BASE_URL=http://localhost:8080/
ENV UWSGI_WORKERS=4
ENV UWSGI_THREADS=4

EXPOSE 8080
