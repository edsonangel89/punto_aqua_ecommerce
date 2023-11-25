import { productModel } from "../models/products.models.js"
import CustomError from "../services/errors/customError.js"
import EErrors from "../services/errors/enumErrors.js"
import { generateUserErrorInfo } from "../services/errors/info.js"

export const getProducts = async (req, res) => {
    const { limit, page, sort, category } = req.query
    try {
        const lim = limit ? limit : 10
        const pag = page ? page : 1
        const sor = sort ? sort : 'asc'
        if (category) {
            const products = await productModel.paginate({category: category},{limit: lim, page: pag, sort:{price: sor}})
            return res.status(200).send(products)
        } 
        else {
            const products = await productModel.paginate({},{limit: lim, page: pag, sort:{price: sor}})
            return res.status(200).send(products)
        }
    }
    catch(error) {
        return res.status(400).send('Error en la consulta de los productos\n' + error)
    }
}

export const getProductId = async (req, res) => {
    const { pid } = req.params
    try {
        const product = await productModel.paginate({_id: pid})
        if (product) {
            return res.status(200).send(product)
        }
        else {
            return res.status(404).send('Producto no encontrado')
        }
    }
    catch (error) {
        return res.status(400).send('Error al consultar el producto\n' + error)       
    }
}

export const addProduct = async (req, res) => {
    const { title, description, code, price, stock, category} = req.body

    if ( !title || !code || !price || !stock ) {
        CustomError.createError({
            name: 'Add product error',
            cause: generateUserErrorInfo({title, description, code, price, stock, category}),
            message: 'Error trying to add a new product',
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    try {
        const addedProduct = await productModel.create({ title, description, code, price, stock, category})
        console.log('Product added:')
        console.log(addedProduct)
        return res.status(201).send('Producto agregado')       
    }
    catch (error) {
        return res.status(400).send('Error en el registro de producto\n' + error)
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params
    const { title, description, code, price, stock, category } = req.body
    try {
        const updatedProduct = await productModel.findByIdAndUpdate( pid, { title, description, code, price, stock, category })
        console.log('Product updated:')
        console.log(updatedProduct)
        return res.status(200).send(updatedProduct)
    }
    catch (error) {
        return res.status(400).send('Error en la actualizacion de producto\n' + error)
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params
    try {
        const deletedProduct = await productModel.findByIdAndDelete(pid)
        console.log('Producto borrado')
        return res.status(200).send('Producto borrado')
    }
    catch (error) {
        return res.status(400).send('Error al borrar producto\n' + error)
    }
}