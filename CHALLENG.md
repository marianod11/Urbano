## Challenge Técnico – Urbano
En este repositorio vas a encontrar la solución al challenge propuesto. A continuación, detallo los puntos trabajados, cómo abordé cada uno y algunos extras que sumé al proyecto.

### Despliegue con Docker
Como primera parte del desarrollo, solucione el error que venia el Dockerfile del backend y del frontend, este se levanto en modo produccion, asi que procedi a crear un Dockerfile en modo dev asi poder trabajar como mas comodidad.

Importante: hay dos archivos docker-compose preparados:

docker-compose.dev.yml: pensado para desarrollo .

docker-compose.yml: listo para producción .

#### Uso

#### up
- Modo desarrollo: docker-compose -f docker-compose.dev.yml up -d
- Modo producción:  docker-compose up  -d

Con esto, se levantan los 3 servicios de la aplicación, el backend, el frontend y la base de datos ya listo para usar. 

- Luego de prender el Docker:
 - cd frontend
 - npm install
 - cd ..
 - cd backend
 - npm install
 - cd ..

#### down
- Modo desarrollo: docker-compose -f docker-compose.dev.yml down
- Modo producción: docker-compose  down

#### logs
- Modo desarrollo: docker-compose -f docker-compose.dev.yml logs backend -f
- Modo producción: docker-compose logs backend -f


### Funcionalidades Desarrolladas

- Se cambió el título del sitio.

- Se agregó el favicon oficial desde la carpeta assets.

- Se colocó el logo de Urbano y un background personalizado en el sidebar.

- Se modificaron los estilos globales para adaptarlos a la paleta de colores de Urbano.

- Se agrego en tailwind.config.js los colores de la marca.

- Las peticiones a la API se hacían cada 1 segundo, se modifico el react-query esto para que los datos se actualicen solo cuando el usuario lo necesite:

- Se agregó un botón de búsqueda para que el usuario dispare la actualización.

- Los datos se solicitan solo si el usuario interactúa con los filtros y preciona el boton de búsqueda.

- Ademas de filtrar por nombre, descripción, se pueden filtrar por paginacion, trear una cantidad reducida de resultados, acomodarlos ascendentemente o descendentemente, por favoritos o inscripciones.

- Es necesario seleccionar una opción y luego hacer clic en "Buscar" para aplicar el filtro.

- Se agrego la funcionabilidad para cargar imagenes tanto en cursos como en contenidos. Estas se guardan en la carpeta "uploads/course-contents" y se desde el frontend se consume la url de la imagen.

- Se refactorizaron varios componentes del frontend para una mejor legibilidad, reuitlizacion y mantenimiento del codigo .

- Favoritos: Se puede agregar o quitar cursos a una lista de favoritos, directamente desde el listado.

- Inscripción a cursos: El usuario puede inscribirse o darse de baja de un curso. El front muestra a los q estan insciptos

- Agrege una pagina de User Data donde se pueden ver los cursos favoritos y inscripciones del usuario.
