import {Router} from 'express'
import {ProductManager,Product} from '../ProductManager.js'
import fs from 'fs'

const prodsR = Router()
const manager = new ProductManager()


/*prodsR.get('/', async (req, res) => {

    const lim = req.query.limit

    if (lim) {
        res.status(200).send(await manager.getProducts(lim))
    } else {
        res.status(200).send(await manager.getProducts())
    }

})*/

prodsR.get('/:pid', async (req, res) => {

    const productId = parseInt(req.params.pid)
    
    res.status(200).send(await manager.getProductById(productId))
    
})

prodsR.post('/', (req, res) => {

    const file = JSON.parse(fs.readFile('../products.json','utf-8'))
    const currId = file[file.length - 1].id

    const {title,description,code,price,status,stock,category,thumbnail} = req.body
    const thumb = []
    const pric = parseInt(price)
    const sto = parseInt(stock)

    thumb.push(thumbnail)
    const prod = new Product(currId,title,description,code,pric,status,sto,category,thumb)

    //console.log(prod)
    manager.addProduct(prod)
    res.status(200).send("Producto agregado")
    
})

prodsR.put('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid)
    const {title,description,code,price,status,stock,category,thumbnails} = req.body

    await manager.updateProduct(pid,title,description,code,price,status,stock,category,thumbnails)
    res.status(200).send("Producto actualizado")

})

prodsR.delete('/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid)

    await manager.deleteProduct(pid)
    res.status(200).send("Producto borrado")

})

export default prodsR