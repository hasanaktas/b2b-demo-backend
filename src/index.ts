import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import * as responses from './responses'

const port = process.env.PORT || 5532
const app = express()

const waiting = (duration: number = 500) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({})
        }, duration)
    })

app.use(cors())
app.use(express.json())

//To pause before sending a res
app.use(async (req: Request, res: Response, next: NextFunction) => {
    await waiting()
    next()
})

app.get(`/`, async (req, res) => {
    res.json({
        name: 'b2b-app api',
        createdBy: 'Hasan Aktas',
    })
})

app.get('/member', async (req, res) => {
    if (req.headers['x-onblok-auth-token'] === responses.signIn.success.data.authToken) {
        return res.json(responses.signIn.success)
    }
    return res.status(401).json(responses.signIn.error)
})

app.post('/member/sign-in', async (req, res) => {
    const { email, password } = req.body

    if (email === 'casestudy@example.com' && password === '12345') {
        return res.json(responses.signIn.success)
    }
    return res.status(400).json(responses.signIn.error)
})

app.get(`/products`, async (req, res) => {
    res.json(responses.products)
})

app.get('/similiar-products/:id', async (req, res) => {
    const { id } = req.params
    const findedIndex = responses.products.data.findIndex((product) => product.id === id)

    if (findedIndex === -1) {
        return res.json(responses.productError)
    }

    const products = responses.products.data.filter((product) => product.id !== id)

    return res.json({ data: products })
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const findedProduct = responses.products.data.find((product) => product.id === id)

    if (findedProduct) {
        return res.json({ data: findedProduct })
    }

    return res.status(400).json(responses.productError)
})

app.get(`/members`, async (req, res) => {
    res.json(responses.members)
})

app.listen(port, () => console.log(`🚀 Server ready at: http://localhost:${port}`))
