import { productModel } from "../models/products.models.js"
import { userModel } from "../models/users.models.js"
import { cartModel } from "../models/carts.models.js"
import { getProducts } from "./products.controller.js"
import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const getRoot = async (req, res) => {
    try {
        if (req.user) {
            const user = await userModel.findOne({_id: req.user._id})
            if (user) {
                console.log(user)
                if (user.role == 'admin') {
                    const productsList = await productModel.find()
                    res.status(200).render('home_admin', {
                        title: 'Admin',
                        name: user.fname,
                        productsList
                    })
                }
                else {
                    res.status(200).render('home_user', {
                        title: 'Home',
                        name: user.fname,
                        cart: user.cart
                    })
                }
            }
        }
        else {
            res.status(200).render('home_logout', { 
                title: 'Home'
                })
        }
    }
    catch (error) {
        res.status(400).send('Error de consulta en raiz\n' + error)
    }
}

export const getLogin = async (req, res) => {
    try {
        res.status(200).render('login', {
            title: 'Login'
        })
    }
    catch (error) {
        res.status(400).send('Error en la consulta de login page\n' + error)
    }
}

export const getProds = async (req, res) => {
    try {
        const products = await productModel.find()
        if (req.user) {
            if (req.user.role == 'user') {
                res.status(200).render('products_user', {
                    title: 'Products',
                    productsList: products,
                })
            }
            else if (req.user.role == 'premium') {
                const productsPrem = await productModel.find()
                productsPrem.forEach(element => {
                    if (element) {
                        element.price = element.price - (element.price * 0.1)
                    }
                })
                return res.status(200).render('products_premium', {
                    title: 'Products',
                    productsList: productsPrem,
                })
            }
        }
        else {
            res.status(200).render('products_logout', {
                title: 'Products',
                productsList: products,
            })
        }
    }
    catch (error) {
        res.status(400).send('Error al consultar productos\n' + error)
    }
}

export const getDetails = async (req, res) => {
    const { pid } = req.params
    try {
        const prodDetail = await productModel.findOne({_id: pid})
        if (req.user) {
            const user = await userModel.findById(req.user._id)
            if (req.user.role == 'premium') {
                prodDetail.price = prodDetail.price - (prodDetail.price * 0.1)
                res.status(200).render('product_detail_premium', {
                    title: 'Product',
                    product: prodDetail,
                    cin: user.cart
                })
            }
            else {
                res.status(200).render('product_detail_user', {
                    title: 'Product',
                    product: prodDetail,
                    cin: user.cart
                })
            }
        }
        else {
            return res.status(200).render('product_detail_logout', {
                title: 'Product',
                product: prodDetail
            })
        }
    }
    catch (error) {
        res.status(400).send('Error al consutar producto\n' + error)
    }
}

export const getCart = async (req, res) => {
    try {
        if (req.user) {
            const pid = req.user._id
            const user = await userModel.findOne({_id: pid})
            if (user) {
                const cart = await cartModel.findOne({_id: user.cart})
                if (req.user.role == 'user') {
                    return res.status(200).render('cart', {
                        title: 'Cart',
                        productsList: cart.products,
                        cid: user.cart
                    })
                }
                else if (req.user.role == 'premium') {
                    cart.products.forEach(element => {
                        const obj = element.id_product
                        if (obj) {
                            obj.price = obj.price - (obj.price * 0.1)
                        }
                    })
                    return res.status(200).render('cart', {
                        title: 'Cart',
                        productsListPremium: cart.products,
                        cid: user.cart
                    })
                }
            }
            else {
                res.status(404).send('Usuario no encontrado')
            }
        }
        else {
            return res.status(200).render('cart', {
                title: 'Cart'
            })
        }
    }
    catch (error) {
        res.status(400).send('Error al consultar carrito\n' + error)
    }
}

export const getSign = async (req, res) => {
    try {
        res.status(200).render('signup', {
            title: 'Sign up'
        })
    }
    catch (error) {
        res.status(400).send('Error al consultar sign page\n' + error)
    }
}

export const getHome = async (req, res) => {
    try {
        const products = await productModel.find()
        const user = await userModel.findOne({_id: req.session.passport.user})
        if (user) {
            res.status(200).render('home_user', {
                title: 'Home',
                productsList: products,
                name: user.fname
            })
        }
        else {
            res.status(404).send('Usuario no encontrado')
        }
    }
    catch (error) {
        res.status(400).send('Error al consultar vistas\n' + error)
    }
}

export const getRtp = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.session.passport.user})
        const productsList = await productModel.find()
        res.status(200).render('home_admin', {
            productsList,
            title: 'Admin',
            name: user.fname
        })
    }
    catch (error) {
        res.status(400).send('Error al consultar vista en tiempo real\n' + error)
    }
}

export const postRtp = async (req, res) => {
    const { title, description, code, price, stock, category } = req.body
    try {
        const user = await userModel.findOne({email: req.user.email})
        await productModel.create({ title, description, code, price, stock, category })
        const productsList = await productModel.find()
        res.status(200).render('home_admin', {
            productsList,
            title: 'Real Time',
            name: user.fname
        })
    }
    catch (error) {
        res.status(400).send('Error al agregar articulos\n' + error)
    }
}

export const delRtp = async (req, res) => {
    const { pid } = req.body
    try {
        const user = await userModel.findOne({email: req.user.email})
        await productModel.findByIdAndDelete(pid)
        const productsList = await productModel.find()
        res.status(200).render('home_admin', {
            productsList,
            title: 'Real Time',
            name: user.fname
        })
    }
    catch (error) {
        res.status(400).send('Error al borrar el producto por medio de las vistas\n' + error)
    }
}

export const deleteProductView = async (req, res) => {
    const { pid } = req.params
    try {
        const user = await userModel.findOne({_id: req.user._id})
        const cid = user.cart
        if (user) {
            const cart = await cartModel.findOne({_id: cid})
            if (cart) {
                const prodArray = cart.products
                const product = await productModel.findOne({_id: pid})
                if (product) {
                    const newProducts = prodArray.filter(p => p.id_product._id != pid)
                    await cartModel.findByIdAndUpdate(cid, {products: newProducts})
                    if (req.user.role == 'user') {
                        return res.status(200).render('cart', {
                            title: 'Cart',
                            productsList: newProducts,
                            cid: user.cart
                        })
                    }
                    else if (req.user.role == 'premium') {
                        cart.products.forEach(element => {
                            const obj = element.id_product
                            if (obj) {
                                obj.price = obj.price - (obj.price * 0.1)
                            }
                        });
                        return res.status(200).render('cart', {
                            title: 'Cart',
                            productsListPremium: newProducts,
                            cid: user.cart
                        })
                    }
                }
                else {
                    res.status(404).send('Producto no encontrado')
                }
            }
            else {
                res.status(404).send('Carrito no encontrado')
            }
        }
        else {
            res.status(404).send('Usuario no encontrado')
        }
    }
    catch (error) {
        res.status(400).send('Error al eliminar producto en Views\n' + error)
    }
}

export const getNewPassword = async (req, res) => {
    try {
        res.status(200).render('confirm_email', {
            title: 'Restore Password'
        })
    }
    catch (error) {
        res.status(400).send('Error al restaurar la contrasena\n' + error)
    }
}

export const setNewPassword = async (req, res) => {
    const { token } = req.params
    const { user } = jwt.verify(token,process.env.JWT_SECRET)
    try {
        if (jwt.verify(token, process.env.JWT_SECRET)) {
            res.status(200).render('new_passwords', {
                title: 'New password',
                email: user
                //,check: 'checkPassword'
            })
        }
    }
    catch (error) {
        res.status(400).send('Error en la restauracion de contrasena')
    }
}

export const getSupport = async (req, res) => {
    try {
        res.status(200).render('support',{})
    }
    catch (error) {
        res.status(400).send('Error en la vista de soporte\n' + error)
    }
}

export const getInfo = async (req, res) => {
    try {
        res.status(200).render('info',{})
    }
    catch (error) {
        res.status(400).send('Error en la vista de soporte\n' + error)
    }
}

export const getTerms = async (req, res) => {
    try {
        res.status(200).render('terms',{})
    }
    catch (error) {
        res.status(400).send('Error en la vista de soporte\n' + error)
    }
}

export const getPrivacy = async (req, res) => {
    try {
        res.status(200).render('privacy',{})
    }
    catch (error) {
        res.status(400).send('Error en la vista de soporte\n' + error)
    }
}

export const getThank = async (req, res) => {
    try {
        res.status(200).render('thank',{})
    }
    catch (error) {
        res.status(400).send('Error en la vista de soporte\n' + error)
    }
}

export const getAdd = async (req, res) => {
    try {
        res.status(200).render('add_product',{})
    }
    catch (error) {
        res.status(400).send('Error en la vista de soporte\n' + error)
    }
}

export const getDelete = async (req, res) => {
    try {
        res.status(200).render('del_product',{})
    }
    catch (error) {
        res.status(400).send('Error en la vista de soporte\n' + error)
    }
}