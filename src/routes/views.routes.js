import { Router } from 'express'
import { authorize } from '../utils/msgsErrors.js'
import { getRoot, 
        getHome, 
        getLogin, 
        getSign, 
        getProds, 
        deleteProductView, 
        getDetails, 
        getCart, 
        postRtp, 
        delRtp, 
        getNewPassword, 
        setNewPassword,
        getSupport,
        getInfo,
        getTerms,
        getPrivacy,
        getThank,
        getAdd,
        getDelete,
        errorUser 
    } from '../controllers/views.controller.js'

const viewsRouter = Router()

viewsRouter.get('/', getRoot)
viewsRouter.get('/home', getHome)
viewsRouter.get('/login', getLogin)
viewsRouter.get('/signup', getSign)
viewsRouter.get('/products', getProds)
viewsRouter.get('/cart', getCart)
viewsRouter.get('/cart/:pid', deleteProductView)
viewsRouter.get('/details/:pid', getDetails)
viewsRouter.post('/admin', authorize('admin'), postRtp)
viewsRouter.post('/admin/:pid', authorize('admin'), delRtp)
viewsRouter.get('/updatePassword/:token', setNewPassword)
viewsRouter.get('/reset', getNewPassword)
viewsRouter.get('/support', getSupport)
viewsRouter.get('/info', getInfo)
viewsRouter.get('/terms', getTerms)
viewsRouter.get('/privacy', getPrivacy)
viewsRouter.get('/thank', getThank)
viewsRouter.get('/add', authorize('admin'), getAdd)
viewsRouter.get('/delete', authorize('admin'), getDelete)
viewsRouter.get('/erroruser', errorUser)

viewsRouter.post('/test', async (req, res) => {
    const obj = req.body
    console.log(req.headers) 
    res.status(200).send('ok')
})

export default viewsRouter