@echo off
echo Instalando Odoo 16 con Docker en Windows...
echo.

echo Verificando Docker...
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta instalado o no esta en el PATH
    pause
    exit /b 1
)

echo Creando estructura de directorios...
if not exist "addons" mkdir addons
if not exist "config" mkdir config
if not exist "logs" mkdir logs
if not exist "postgresql\data" mkdir postgresql\data

echo Iniciando contenedores...
docker-compose up -d

echo Esperando a que los servicios inicien...
timeout /t 30 /nobreak

echo.
echo ========================================
echo Odoo 16 instalado correctamente!
echo URL: http://localhost:8070
echo Usuario: odoo
echo Password: odoo
echo ========================================
echo.

echo Presiona cualquier tecla para ver los logs...
pause
docker-compose logs -f web