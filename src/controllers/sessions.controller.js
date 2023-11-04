import { makeToken, authToken } from "../utils/jwt.js"
import { userModel } from "../models/users.models.js"

export const sessionLogin = async (req, res) => {
    const token = makeToken(req.user)
    res.cookie('jwtCookie', token, {
        maxAge: 40000000
    })
    if (req.user.role == 'user') {
        console.log('User ' + req.user._id + ' logged in')
        return res.redirect('/home',200,{})
    }
    else {
        console.log('User ' + req.user._id + ' logged in')
        return res.redirect('/realtimeproducts',200,{})
    }
}
   
export const sessionSign = async (req, res) => {
    try {
        console.log('New user added:\n')
        console.log(req.user)
        res.redirect('/',200,{})
    }
    catch (error) {
        res.status(400).send('Error al iniciar sesion\n' + error)
    }
}

export const getSessionSign = async (req, res) => {
    res.status(200).render('sign')
}

export const sessionLogout = async (req, res) => {
    if (req.session) {
        console.log('User ' + req.session.passport.user + ' logged out')
        req.session.destroy()
    }
    res.clearCookie('jwtCookie')
    return res.redirect('/',200,{})
}

export const currentSession = async (req, res) => {
    console.log('Current user: ')
    console.log(req.user)
    return res.status(200).send(req.user)
}

export const githubCallback = async (req, res) => {
    req.session.user = req.user
    if (req.session.user) {
        return res.redirect('/home',200,{})
    }
    else {
        return res.status(400).send('Error de login')
    }
}