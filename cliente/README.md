# Cliente Fame Race

## Cómo correr el cliente localmente

1. Asegúrate que el backend esté arriba (servidor) y aceptando solicitudes.
2. Muevete hacia la carpeta cliente con `cd cliente`.
3. Instala las dependencias con `npm install`.
4. Instala el linter con `npx install-peerdeps --dev eslint-config-airbnb`. 
5. Inicia el cliente con `npm start`.
6. Listo! Ahora puedes hacerte una cuenta en la sección de registrarse y luego login para ver, crear y jugar partidas. 

## Cómo correr el cliente en la web (deploy a netlify)
Link: https://jacfront.netlify.app/
Se realizo una copia del repositorio JAC_front_s2 llamado JAC_front_s2_netlify y se subio a netlify conectado al backend en render.

## Diseño HTML y CSS

### Arquitectura de Componentes
El frontend está desarrollado en React utilizando una arquitectura basada en componentes reutilizables:

- **Components**: Elementos reutilizables como `NavBar`, `Board`, `DicePanel`, `TurnInfo`, `LeaveButton`
- **Views**: Páginas principales como `Home`, `GameView`, `Login`, `SignUp`, `AdminDashboard`, etc.
- **Assets**: Recursos estáticos organizados en carpetas (`avatars`, `img`, `styles`)

### Consideraciones sobre las Reglas del Juego

#### Cambios Implementados:
1. **Sistema de Turnos**: Implementación de un temporizador de 20 segundos por turno
2. **Cartas Spotlight**: Sistema de cartas especiales que aparecen al caer en casillas específicas
3. **Visualización de Otras Cartas**: Las cartas robadas por otros jugadores se muestran por 5 segundos automáticamente
4. **Posiciones Dinámicas**: El tablero actualiza las posiciones de los jugadores en tiempo real
5. **Sistema de Avatares**: Selección personalizada de avatares para cada jugador

#### Restricciones y Supuestos:
- Máximo 4 jugadores por partida
- El juego requiere conexión constante al servidor (actualización cada 2 segundos)
- Las partidas se eliminan automáticamente cuando todos los jugadores se desconectan
- Solo el administrador puede acceder al panel de administración

### Mejoras de Diseño Visual (HTML y CSS)

#### Respecto a la Entrega Cero:

Las principales mejoras con respecto a la entrega 0 son en el navBar y en la vista de partida. También se detallan otras mejoras que podrían ser relevantes.

1. **Ajustes en NavBar**:
   - Se incluye `Home`, `Nosotras` y `Partidas`. Además de un botón de `Logout` cuando se está inciado sesión y un saludo del tipo `Hola, usuario`.

2. **Ajustes en la UI de Partida**:
   - Simplificación de la vista y de los componentes para un diseño más minimalista y funcional. Ver `/documents/mockups Actualizados E3`como referencia. 

3. **Diseño Responsivo**:
   - Implementación de media queries para dispositivos móviles, tablets y desktop
   - Uso de unidades relativas (`vw`, `rem`, `clamp()`) para escalado automático
   - Layout flexible que se adapta a diferentes tamaños de pantalla

4. **Componentes Interactivos**:
   - Cartas Spotlight con efectos de aparición (`fadeIn` animation)
   - Tablero de juego interactivo con posiciones dinámicas de jugadores
   - Sistema de avatares visuales
   - Indicadores de turno y temporizador

5.⁠ ⁠**Vista Salón de la Fama**:
   - Temporalmente, esta vista se dejó estática y con datos falsos, pero se espera que para próxima entrega se conecte con el backend y muestre usuarios reales.

6. ⁠⁠**Eliminación de vista Cuenta**:
   - Se elimina la vista “Cuenta” que permitía ver al usuario su puntaje actual.

#### Estructura CSS:
- **style.css**: Estilos globales y componentes base
- **game-view.css**: Estilos específicos para la vista del juego
- **board.css**: Estilos del tablero de juego
- **login.css**: Estilos de autenticación
- **Otros CSS**: Estilos específicos por vista (`salon.css`, `nosotros.css`, etc.)

### Consideraciones Técnicas

#### Supuestos:
- El servidor backend está disponible en `http://localhost:3001` y se corre con docker.
- Los usuarios tienen JavaScript habilitado
- Navegadores modernos con soporte para CSS Grid y Flexbox

#### Restricciones:
- Requiere conexión a internet para funcionamiento completo
- No hay modo offline
- Las sesiones expiran al cerrar el navegador
- Cuando el timer en la partida termina, no pasa nada (por ahora). Se espera que en el futuro se implemente el pasar turno luego de que se acabe el timer. 

#### Información Relevante para Corrección:
1. **Dependencias**: El proyecto utiliza React 18, React Router Dom, y Axios
2. **Estructura de Estado**: Uso de React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
3. **Comunicación con Backend**: API REST con interceptores para manejo de errores
4. **Gestión de Rutas**: Protección de rutas basada en autenticación
5. **Optimización**: Componentes optimizados con `useCallback` para evitar re-renders innecesarios

#### Cambios por implementar en proxima entrega:
1. El boton de salir de un juego en curso (actualmente no lleva a ninguna parte).
2. Ganar juego y generar podio (actualmente se lanza dado hasta que se gana, el ultimo lanzar dado para ganar no genera nada).
3. La vista de Salón de la Fama debe ser conectada con datos reales del backend para la próxima entrega.
4. El contador regresivo de la partida actualmente solo funciona para el usuario que está jugando (no los que esperan su turno) y no ocurre nada al llegar a 0. En la siguiente entrega se espera implementar el "pasar turno" que ocurre cuando a un jugador se le acaba el tiempo, además de un contador en tiempo real para el resto de los jugadores. 