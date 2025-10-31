# Usar la imagen oficial de Odoo 16 como base
FROM odoo:16.0

# Cambiar al usuario root para poder instalar paquetes
USER root

# Copiar el archivo de requerimientos dentro de la imagen
COPY ./requirements.txt /etc/odoo/

# Instalar las dependencias de Python listadas en el archivo
RUN pip install --no-cache-dir -r /etc/odoo/requirements.txt

# Devolver el control al usuario por defecto de Odoo
USER odoo