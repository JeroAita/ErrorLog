FROM node:20-slim

WORKDIR /app

# Copiamos primero solo los manifiestos para aprovechar la cache de Docker:
# si el código cambia pero las dependencias no, no vuelve a correr npm install.
COPY package.json package-lock.json ./
RUN npm install

# Ahora sí copiamos el resto del código de la app
COPY . .

# Puerto del dev server (Vite por defecto; si usás Create React App, cambiar a 3000)
EXPOSE 5173

# "--host" es necesario para que el servidor escuche en 0.0.0.0
# y sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]