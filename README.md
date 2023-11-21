# Reto - Backend ExpressTS/GraphQL/MongoDB

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

#### Mejoras:

- [ ] Añadir eslint
- [ ] Añadir prettier
- [ ] Añadir test unitarios

#### Extras:

- [x] ¿Cómo crear un usuario en mongodb shell?

```
~ db.createUser({ user: 'equip', pwd: 'BackendChallenge', roles: ['readWrite', 'dbAdmin'] })
```
