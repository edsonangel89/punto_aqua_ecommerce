import nodemailer from 'nodemailer'
import 'dotenv/config'
import { passToken } from './jwt.js'
import { userModel } from '../models/users.models.js'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'puntoaquaoficial@gmail.com',
        pass: process.env.MAIL_PASSWORD,
        authMethod: 'LOGIN'
    }
})

export const send = async (fname, email) => {
    const tokMail = passToken(email)
    const resultado = await transporter.sendMail({
    from: 'Restauracion puntoaquaoficial@gmail.com',
    to: email,
    subject: 'Restauracion de contrasena',
    html: 
        `
            <div>
                <h1>Hola ${fname}</h1>
                <p>Haz click en el siguiente link para restaurar tu contrasena</p>
                <a href='https://ecommerce-example-enor.onrender.com/updatePassword/${tokMail}'>Link para restaurar la contrasena</a>
                <p>El link tiene una vigencia de 5 minutos</p>
            </div>
        `
    })
    return true
}

export const thanks = async (fname, email) => {
    const tokMail = passToken(email)
    const resultado = await transporter.sendMail({
    from: 'Punto Aqua puntoaquaoficial@gmail.com',
    to: email,
    subject: 'Muchas gracias!!!',
    html: 
        `
            <div>
                <h1>Hola ${fname}</h1>
                <h3>Muchas gracias por tu compra</h3>
                <p>Agradecemos tu preferencia, esperamos seguir sirviendote</p>
            </div>
        `
    })
    return true
}

