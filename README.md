# Proyecto CRUD de Usuarios con Next.js (App Router) y API REST

Este documento detalla la implementación de una aplicación web para la gestión de usuarios (CRUD: Crear, Leer, Actualizar, Eliminar) utilizando Next.js con el App Router, complementado con una API REST independiente. El objetivo principal ha sido migrar y adaptar la lógica de una aplicación React tradicional y un servidor Node.js/Express existente a un entorno moderno de Next.js, siguiendo las mejores prácticas y los requerimientos de la prueba.

## 1. Objetivo del Proyecto

El objetivo principal fue desarrollar un CRUD de usuarios con las siguientes funcionalidades y reglas:

*   **Autenticación:** Implementar una página de inicio de sesión (`/signin`) para autenticar usuarios. La validación se realiza contra un usuario previamente registrado en la API.
*   **Gestión de Sesión:** El token de autenticación se almacena y gestiona en el lado del cliente para mantener la sesión del usuario.
*   **Acceso Restringido:** Las funcionalidades de registro (creación) y visualización de usuarios (`/users`) solo son accesibles para usuarios autenticados.
*   **Consumo de API:** La aplicación frontend consume una API REST creada previamente para todas las operaciones relacionadas con los usuarios.

## 2. Arquitectura y Tecnologías Utilizadas

La aplicación se ha construido sobre el siguiente stack tecnológico, priorizando la integración y eficiencia del ecosistema Next.js:

*   **Frontend:**
    *   **Next.js (App Router):** Marco de React con capacidades de renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG) y componentes de servidor (Server Components).
    *   **React:** Biblioteca para construir interfaces de usuario interactivas.
    *   **Tailwind CSS:** Framework de CSS utilitario para un estilizado rápido, modular y responsivo.
    *   **Shadcn/ui:** Colección de componentes de interfaz de usuario re-utilizables y accesibles, construidos sobre Tailwind CSS, que proporcionan una base sólida para la UI.
    *   **Lucide React:** Biblioteca de iconos vectoriales ligeros y personalizables.
    *   **`useActionState` y Server Actions:** Utilizados para manejar las mutaciones de datos de forma segura y eficiente, ejecutando código directamente en el servidor desde componentes de cliente.
    *   **Context API:** Para la gestión global del estado de autenticación, permitiendo que la información del usuario y el estado de la sesión sean accesibles en toda la aplicación.
*   **Backend (Integrado en Next.js):**
    *   **Node.js:** El entorno de ejecución para la lógica del servidor. Los Route Handlers de Next.js se ejecutan en Node.js, lo que permite manejar las peticiones API y la lógica de negocio del lado del servidor.
    *   **Route Handlers de Next.js:** Se utilizaron para crear puntos finales API locales (`/api/auth`, `/api/users`, `/api/users/[id]`) que simulan la interacción con una API REST externa. Esto permite que la aplicación Next.js actúe como un *proxy* o una capa de abstracción para la API real, manejando la lógica de negocio y seguridad en el servidor.
    *   **Next.js Server Components:** Utilizados para la carga inicial de datos y la representación de páginas, mejorando el rendimiento, la seguridad y la experiencia del desarrollador.

## 3. Estructura del Proyecto

La estructura de carpetas sigue las convenciones del App Router de Next.js, optimizando la organización y escalabilidad:

```
.
├── app/                 # Contiene las rutas de la aplicación y los componentes de página.
│   ├── api/             # Route Handlers (simulación de API REST)
│   │   ├── auth/
│   │   │   └── route.ts # Lógica de autenticación (inicio de sesión)
│   │   ├── users/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts # Operaciones CRUD para un usuario específico (GET, PUT, DELETE)
│   │   │   └── route.ts     # Operaciones CRUD para todos los usuarios (GET, POST)
│   │   ├── users/create/page.tsx # Página para el formulario de creación de un nuevo usuario.
│   │   ├── users/[id]/page.tsx   # Página para el formulario de edición de un usuario existente.
│   │   ├── users/page.tsx        # Página principal para listar todos los usuarios.
│   │   ├── signin/page.tsx       # Página de inicio de sesión.
│   │   ├── layout.tsx            # Layout principal de la aplicación, aplica a todas las rutas.
│   │   └── page.tsx              # Página de inicio (redirecciona a usuarios si está autenticado)
├── components/          # Componentes de React reutilizables de la interfaz de usuario.
│   ├── navbar.tsx       # Barra de navegación.
│   └── protected-route.tsx # Componente de orden superior para proteger rutas.
├── context/             # Contextos de React para gestión de estado global.
│   └── auth-context.tsx # Provee el estado de autenticación a los componentes.
├── lib/                 # Utilidades, funciones auxiliares y lógica de negocio.
│   ├── auth.ts          # Funciones relacionadas con la lógica de autenticación.
│   ├── types.ts         # Definiciones de tipos de TypeScript para los datos del proyecto.
│   ├── user-service.ts  # Lógica para interactuar con los Route Handlers de la API.
│   └── users.ts         # Funciones de utilidad relacionadas con los datos de usuario.
├── public/              # Archivos estáticos (imágenes, favicons, etc.).
├── .gitignore           # Archivos y carpetas a ignorar por Git.
├── next.config.mjs      # Configuración de Next.js.
├── package.json         # Metadatos del proyecto y dependencias.
├── tailwind.config.ts   # Configuración de Tailwind CSS.
├── tsconfig.json        # Configuración de TypeScript.
└── README.md            # Este archivo de documentación.
```

## 4. Contexto de las Carpetas Originales (`test-sps-react` y `test-sps-server`)

Las carpetas `test-sps-react` y `test-sps-server` se incluyeron en el contexto inicial del proyecto para proporcionar los requisitos y la base de la API que debía ser consumida. Sin embargo, **no se utilizan directamente en la implementación actual de esta aplicación Next.js**.

*   **`test-sps-react`:** Esta carpeta contiene el proyecto React original (probablemente un Create React App). La interfaz de usuario y la lógica de frontend de este proyecto se han reescrito completamente en los componentes de Next.js bajo la carpeta `app/`. Se mantiene en el repositorio como referencia histórica y para contextualizar el punto de partida de la prueba, pero no forma parte del proceso de `build` o `runtime` de la aplicación actual.
*   **`test-sps-server`:** Esta carpeta contiene el proyecto de servidor Node.js/Express que servía la API REST original. En esta implementación de Next.js, la funcionalidad de esta API se ha **integrado y simulado** directamente en los **Route Handlers de Next.js** (ubicados en `app/api/`). Al igual que `test-sps-react`, se mantiene por motivos de referencia histórica, pero no se ejecuta ni se utiliza en la aplicación funcional.

Esta estrategia de consolidación en Next.js simplifica el despliegue, mejora la cohesión del código y aprovecha al máximo las capacidades de renderizado del lado del servidor y las API Routes del framework.

## 5. Características Implementadas

### 5.1. Autenticación de Usuarios
*   **Página de Inicio de Sesión (`/signin`):** Interfaz de usuario para que los usuarios ingresen sus credenciales.
*   **Validación de Credenciales:** Las credenciales se envían a un Route Handler (`/api/auth`) que simula la validación contra un usuario pre-registrado.
*   **Gestión de Token:** Tras una autenticación exitosa, se recibe un token JWT que se almacena en el cliente (ej. en `localStorage` o `cookies`) para mantener la sesión.
*   **Contexto de Autenticación:** El `AuthContext` (`context/auth-context.tsx`) gestiona el estado de autenticación global, permitiendo que los componentes de la aplicación accedan fácilmente a la información del usuario y al estado de la sesión.

### 5.2. Gestión de Usuarios (CRUD)
*   **Listado de Usuarios (`/users`):** Muestra una tabla o lista de todos los usuarios obtenidos a través del Route Handler `/api/users`.
*   **Creación de Usuarios (`/users/create`):** Formulario para registrar nuevos usuarios, enviando los datos al Route Handler `/api/users` mediante un Server Action.
*   **Edición de Usuarios (`/users/[id]`):** Formulario para modificar los datos de un usuario existente, cargando los datos iniciales desde `/api/users/[id]` y enviando las actualizaciones mediante un Server Action.
*   **Eliminación de Usuarios:** Funcionalidad para borrar usuarios, interactuando con el Route Handler `/api/users/[id]` mediante un Server Action.

### 5.3. Protección de Rutas
*   **Rutas Protegidas:** Las páginas de gestión de usuarios (`/users`, `/users/create`, `/users/[id]`) están protegidas y solo son accesibles para usuarios autenticados.
*   **Redirección:** Si un usuario no autenticado intenta acceder a una ruta protegida, es automáticamente redirigido a la página de inicio de sesión (`/signin`). Esto se implementa utilizando el componente `protected-route.tsx` y lógica en los `page.tsx` de las rutas protegidas.

### 5.4. Consumo de API (Route Handlers)
*   **API Interna:** Todas las operaciones de datos (autenticación, CRUD de usuarios) se realizan a través de los Route Handlers de Next.js (`app/api/`). Estos actúan como la capa de "backend" para la aplicación.
*   **Servicios de Cliente:** Las funciones en `lib/user-service.ts` encapsulan la lógica de las peticiones HTTP (usando `fetch`) a estos Route Handlers, proporcionando una interfaz limpia para la interacción con la API.

## 6. Variables de Entorno

Para el correcto funcionamiento de la aplicación, es necesario configurar las siguientes variables de entorno. Estas variables deben definirse en un archivo `.env.local` en la raíz del proyecto.

*   **`JWT_SECRET`**:
    *   **Propósito:** Esta variable es crucial para la seguridad de la autenticación. Se utiliza en los Route Handlers de la API (específicamente en `app/api/auth/route.ts`) para firmar y verificar los JSON Web Tokens (JWT) que se generan durante el proceso de inicio de sesión. Un secreto fuerte y único es fundamental para prevenir la manipulación de los tokens de sesión y asegurar la integridad de la autenticación.
    *   **Ejemplo de configuración en `.env.local`:**
        ```
        JWT_SECRET=key_secret_jwt
        ```
        **Nota:** Este secreto debe ser una cadena de caracteres compleja, aleatoria y no debe ser compartida públicamente ni versionada en el control de código fuente.

**Consideraciones sobre `REACT_APP_SERVER_URL`:**
En las versiones anteriores del proyecto (específicamente en la carpeta `test-sps-react`), existía una variable de entorno `REACT_APP_SERVER_URL` que apuntaba a la URL del servidor backend (`test-sps-server`). En esta implementación de Next.js con el App Router, **esta variable no es necesaria** para la comunicación con la API de usuarios, ya que las operaciones de backend se manejan directamente a través de los Route Handlers de Next.js (`app/api/`). Esto simplifica la arquitectura al consolidar frontend y "backend" en una única aplicación Next.js.

## 7. Configuración y Ejecución del Proyecto

Para ejecutar este proyecto localmente, sigue los siguientes pasos:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/kirusiya/Gestion-de-usuarios-CRUD.git
    cd <NOMBRE_DEL_PROYECTO>
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y define la variable `JWT_SECRET` como se describe en la sección "Variables de Entorno" anterior.

4.  **Ejecutar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```

5.  **Acceder a la Aplicación:**
    La aplicación estará disponible en tu navegador en `http://localhost:3000` (o el puerto que Next.js asigne automáticamente).

## 8. Guía de Uso y Pruebas

*   **Inicio de Sesión:**
    *   Abre tu navegador y navega a `http://localhost:3000/signin`.
    *   Utiliza las credenciales de prueba predefinidas en los Route Handlers de la API de autenticación (ejemplo: **Usuario:** `admin@spsgroup.com.br`, **Contraseña:** `1234`).
*   **Gestión de Usuarios (CRUD):**
    *   Después de iniciar sesión exitosamente, serás redirigido automáticamente a la página de listado de usuarios (`/users`).
    *   Desde esta página, podrás:
        *   **Ver la lista de usuarios:** Se mostrarán los usuarios existentes.
        *   **Crear un nuevo usuario:** Haz clic en el botón o navega a `/users/create` para acceder al formulario de creación.
        *   **Editar un usuario existente:** Haz clic en el nombre de un usuario en la lista para ir a su página de edición (`/users/[id]`).
        *   **Eliminar un usuario:** Utiliza la opción de eliminación disponible en la lista de usuarios.
*   **Protección de Rutas:**
    *   Intenta acceder directamente a rutas como `/users` o `/users/create` sin haber iniciado sesión. La aplicación te redirigirá automáticamente a la página de inicio de sesión, demostrando la protección de rutas implementada.

Este proyecto demuestra una comprensión sólida de Next.js con el App Router, la gestión de estado de autenticación y la interacción con APIs REST, manteniendo la compatibilidad con los requerimientos de la prueba inicial y proporcionando una base robusta para futuras expansiones.

---

## 🔣 Developer   

- 👨‍💻 **Ing. Edward Avalos** - *Full Stack Developer y Desarrollador Principal* - [GitHub](https://github.com/kirusiya/) | [LinkedIn](https://www.linkedin.com/in/edward-avalos-severiche/)
- 📧 **Email**: edward@ajamba.org
- 📱 **WhatsApp Business**: (+591) 61781119 | [Whatsapp](https://wa.me/59161781119)



*For technical support or questions about this implementation, please refer to the troubleshooting section or review the comprehensive code documentation within the project files.*
