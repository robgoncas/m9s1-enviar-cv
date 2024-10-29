const express = require('express');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir la subida de archivos
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Ruta para mostrar el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para manejar el envío del formulario
app.post('/enviar-cv', (req, res) => {
    const { name, email, message } = req.body;
    const file = req.files ? req.files.cv : null; // Verifica si hay un archivo

    // Configuración del transportador de nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Puedes usar otro servicio de correo
        auth: {
            user: 'rob.goncas.chile@gmail.com', // Reemplaza con tu email
            pass: contrasenia // Reemplaza con tu contraseña
        }
    });

    // Configuración del correo electrónico
    const mailOptions = {
        from: email,
        to: 'rob.goncas.chile@gmail.com', // Reemplaza con el email del destinatario
        subject: 'Nuevo mensaje de contacto',
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
        attachments: []
    };

    // Si hay un archivo, lo guardamos en el servidor
    if (file) {
        const filePath = path.join(__dirname, 'uploads', file.name);
        file.mv(filePath, (err) => {
            if (err) {
                return res.status(500).send('Error al guardar el archivo: ' + err.message);
            }
            // Agregar el archivo adjunto al correo
            mailOptions.attachments.push({
                filename: file.name,
                path: filePath
            });

            // Enviar el correo
            sendEmail(transporter, mailOptions, res);
        });
    } else {
        // Enviar el correo sin archivo adjunto
        sendEmail(transporter, mailOptions, res);
    }
});

// Función para enviar el correo
const sendEmail = (transporter, mailOptions, res) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error al enviar el email: ' + error.message);
        }
        //res.send('Email enviado: ' + info.response);
        res.sendFile(path.join(__dirname, 'public', 'exito.html'));
    });
};

// Iniciar el servidor
// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

export default app































let contrasenia = 'qbcvwbunxmqahcnc';