<img src="./logo.png" alt="Project Logo or Image" width="120" height="100" style="margin-bottom: -30px">

# Reto - Backend ExpressTS/GraphQL/MongoDB

```
Fecha inicio: 25/03/2025
Fecha fin: 27/03/2025
Fecha respuesta: 31/03/2025
```

#### Conocimientos Requeridos:

- [x] MongoDB
- [x] Typescript
- [x] ExpressJS
- [x] GraphQL

#### Descripción:

Los usuarios cliente podrán cargar productos vinculados a sus cuentas. Luego, podrán listar y/o buscar productos donde podrán visualizar el detalle de la cuenta asociada a cada producto.

Este proyecto está conectado a 2 bases de datos **eiAccounts** y **eiInventories**. La lista de productos está relacionada a la cuenta con la que se asoció al momento de la carga inicial.

#### Tareas:

##### A. Cuentas:

- [ ] Crear una mutación para agregar una cuenta cliente
- [ ] Crear una query para listar las cuentas enviando parámetros de **paginación** y filtrado de búsqueda (nombre/email) usando el método **aggregate** de **mongoose**

##### B. Productos:

- [ ] Crear una mutación para agregar un array de productos (debe asociarse a una cuenta cliente)
- [ ] Crear una query listar los productos enviando parámetros de **paginación** y filtrado de búsqueda (nombre/sku) usando el método **aggregate** de **mongoose**
- [ ] Sobre la query anterior, se debe agregar al **schema** del Producto, el campo Account para obtener los detalles de la cuenta asociada

> Para las mutaciones agregar archivos mockups en el proyecto que sirva para la creación de cuentas y/o productos

> Opcional: Se considerará el uso de enums, types en root, validaciones en queries y mutaciones y creaciones de carpetas utils o helpers

#### Mejoras:

```
Según criterio del desarrollador
```

- [ ] Añadir eslint
- [ ] Añadir prettier
- [ ] Añadir test unitarios
- [ ] Añadir un logger

#### Extras:

- [x] ¿Cómo crear un usuario en mongodb shell?

```
~ db.createUser({ user: 'equip', pwd: 'BackendChallenge', roles: ['readWrite', 'dbAdmin'] })
```

- [x] Iniciar servicio mongdb community

```
brew services start mongodb-community@7.0
```

- [x] Detener servicio mongdb community

```
brew services stop mongodb-community@7.0
```
