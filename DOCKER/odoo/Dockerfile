FROM odoo:16.0

USER root

# Instalar dependencias del sistema necesarias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3-pip \
        python3-dev \
        build-essential \
        gcc \
        g++ \
        libxml2-dev \
        libxslt-dev \
        zlib1g-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt ANTES de instalar
COPY requirements.txt /tmp/requirements.txt

# Instalar todas las dependencias Python
RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r /tmp/requirements.txt

# Limpiar cache de pip
RUN pip3 cache purge

USER odoo