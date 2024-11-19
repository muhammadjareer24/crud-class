import express from "express"
import path from "path"

import usersApiRoutes from "./routes/api/users.js"
import usersWebRoutes from "./routes/web/users.js"

const app = express()

app.set("view engine", "ejs")
app.set("views", path.resolve("views"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("public"))

// Routes
app.use("/api/users", usersApiRoutes)
app.use("/", usersWebRoutes)

app.listen(8000, () => console.log("Server started at PORT 8000"))

//-Web Page Routes - USER

// MVC -done

//- API Routes - USER

// MVC -done

//- *******************************************************************

//-Web Page Routes - PRODUCT

// Show home page
app.get("/", (req, res) => {
  res.render("index")
})

// Show Product registration form
app.get("/registerProduct", (req, res) => {
  res.render("registerProduct")
})

// Save registration details and redirect to Product Dashboard
app.post("/products", (req, res) => {
  const { productName, description, price } = req.body

  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)

    const product = {
      id: products.length + 1,
      productName,
      description,
      price,
    }

    products.push(product)

    fs.writeFile("products.json", JSON.stringify(products), () => {})

    res.redirect("/productDashboard")
  })
})

// Show Product Dashboard with saved product details
app.get("/productDashboard", (req, res) => {
  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)

    res.render("productDashboard", { products })
  })
})

// Show Product Profile page with the details of a particular product
app.get("/products/:id", (req, res) => {
  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)

    const id = Number(req.params.id)
    const product = products.find((product) => product.id === id)

    res.render("productProfile", { product })
  })
})

// Change the details of a product and save the updated info. Then redirect to Product Dashboard
app.patch("/products/:id", (req, res) => {
  const { productName, description, price } = req.body

  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)
    const id = Number(req.params.id)

    const productIndex = products.findIndex((product) => product.id === id)

    products[productIndex] = {
      ...products[productIndex],
      productName: productName || products[productIndex].productName,
      description: description || products[productIndex].description,
      price: price || products[productIndex].price,
    }

    fs.writeFile("products.json", JSON.stringify(products), () => {
      if (err) {
        return res.status(500).send("Error updating product data.")
      }

      res.redirect("/productDashboard")
    })
  })
})

app.delete("/products/:id", (req, res) => {
  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)
    const id = Number(req.params.id)
    const productIndex = products.findIndex((product) => product.id === id)

    products.splice(productIndex, 1)

    fs.writeFile("products.json", JSON.stringify(products), (err) => {
      res.redirect("/productDashboard")
    })
  })
})

//- API Routes - PRODUCT

app.get("/api/products", (req, res) => {
  return res.json(products)
})

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id)
  const product = products.find((product) => product.id === id)
  res.json(product)
})

app.post("/api/products", (req, res) => {
  const { productName, description, price } = req.body

  const product = {
    id: products.length + 1,
    productName,
    description,
    price,
  }

  products.push(product)

  fs.writeFile("products.json", JSON.stringify(products), (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "Error", message: "Failed to write product data." })
    }
    return res.json({ status: "Success", product })
  })
})

app.patch("/api/products/:id", (req, res) => {
  const { productName, description, price } = req.body

  const id = Number(req.params.id)

  const productIndex = products.findIndex((product) => product.id === id)

  products[productIndex] = {
    ...products[productIndex],
    productName: productName || products[productIndex].productName,
    description: description || products[productIndex].description,
    price: price || products[productIndex].price,
  }

  fs.writeFile("products.json", JSON.stringify(products), (err, data) => {
    return res.json({ status: "Updated", product: products[productIndex] })
  })
})

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id)
  const productIndex = products.findIndex((product) => product.id === id)

  const deletedProduct = products[productIndex]

  products.splice(productIndex, 1)

  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    return res.json({
      status: "Deleted",
      deletedProduct,
    })
  })
})
