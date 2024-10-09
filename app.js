// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvUrRAvk5RI8FFuMXEB0de39qCgxZDYiI",
  authDomain: "taller-65019.firebaseapp.com",
  projectId: "taller-65019",
  storageBucket: "taller-65019.appspot.com",
  messagingSenderId: "597607922168",
  appId: "1:597607922168:web:8ef5714fb846f620313e0d",
  measurementId: "G-M29RDF4E7V"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Funciones de registro
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Guardar el nombre en Firestore
            db.collection("users").doc(userCredential.user.uid).set({
                name: name,
                email: email
            });
            alert("Registro exitoso");
            document.getElementById('registerForm').reset();
            window.location.href = "index.html"; // Redirigir a la página principal
        })
        .catch(error => {
            console.error("Error en el registro:", error);
            alert(error.message);
        });
});

// Funciones de inicio de sesión
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Inicio de sesión exitoso");
            loadUserList(); // Cargar la lista de usuarios
        })
        .catch(error => {
            console.error("Error en el inicio de sesión:", error);
            alert(error.message);
        });
});

// Aqui podremos Cargar la lista de usuarios registrados
function loadUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Limpiar la lista anterior

    db.collection("users").get().then(snapshot => {
        snapshot.forEach(doc => {
            const user = doc.data();
            const li = document.createElement('li');
            li.textContent = `${user.name} (${user.email})`;
            userList.appendChild(li);
        });
    }).catch(error => {
        console.error("Error al cargar la lista de usuarios:", error);
    });
}

// Aqui podremos Enviar formulario de contacto
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = e.target[0].value;
    const correo = e.target[1].value;
    const mensaje = e.target[2].value;

    //  Aqui podremos Guardar mensaje en Firestore
    db.collection("contactos").add({
        nombre,
        correo,
        mensaje
    }).then(() => {
        alert("Mensaje enviado exitosamente");
        e.target.reset();
    }).catch(error => {
        console.error("Error al enviar el mensaje:", error);
        alert(error.message);
    });
});


// Función de inicio de sesión
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Inicio de sesión exitoso");
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('tabla-info').style.display = 'block';
            loadContactTable(); // Cargar la tabla de contactos después de iniciar sesión
            window.location.href = "admin.html"; 
        })
        .catch(error => {
            console.error("Error en el inicio de sesión:", error);
            alert(error.message);
        });
});

// Función para cargar la tabla de contactos
function loadContactTable() {
    const contactTableBody = document.getElementById('contactTableBody');
    contactTableBody.innerHTML = ''; // Limpiar la tabla

    db.collection("contactos").get().then(snapshot => {
        snapshot.forEach(doc => {
            const contacto = doc.data();
            const row = document.createElement('tr');

            // Crear y agregar las celdas a la fila
            const nameCell = document.createElement('td');
            nameCell.textContent = contacto.nombre;
            row.appendChild(nameCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = contacto.correo;
            row.appendChild(emailCell);

            const messageCell = document.createElement('td');
            messageCell.textContent = contacto.mensaje;
            row.appendChild(messageCell);

            // Agregar la fila a la tabla
            contactTableBody.appendChild(row);
        });
    }).catch(error => {
        console.error("Error al cargar la tabla de contactos:", error);
    });
}
