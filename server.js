import express, { json } from "express"
import fs, { stat } from "fs"
import users from "./users.json" assert { type: "json" }
import products from "./products.json" assert { type: "json" }

const app = express()

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let id = 0

//-Web Page Routes - USER

// Show home page
app.get("/", (req, res) => {
  res.render("index")
})

// Show registration form
app.get("/register", (req, res) => {
  res.render("register")
})

// Save registration details and redirect to dashboard
app.post("/users", (req, res) => {
  const { fullName, email, phone, password } = req.body

  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)

    const user = {
      id: users.length + 1,
      fullName,
      email,
      phone,
      password,
    }

    users.push(user)

    fs.writeFile("users.json", JSON.stringify(users), () => {})

    res.redirect("/dashboard")
  })
})

// Show Dashboard with saved user details
app.get("/dashboard", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)

    res.render("dashboard", { users })
  })
})

// Show profile page with the details of a particular user
app.get("/users/:id", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)

    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)

    res.render("profile", { user })
  })
})

// Change the details of a user and save the updated info. Then redirect to Dashboard
app.patch("/users/:id", (req, res) => {
  const { fullName, email, phone, password } = req.body

  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)
    const id = Number(req.params.id)

    const userIndex = users.findIndex((user) => user.id === id)

    users[userIndex] = {
      ...users[userIndex],
      fullName: fullName || users[userIndex].fullName,
      email: email || users[userIndex].email,
      phone: phone || users[userIndex].phone,
      password: password || users[userIndex].password,
    }

    fs.writeFile("users.json", JSON.stringify(users), () => {
      if (err) {
        return res.status(500).send("Error updating user data.")
      }

      res.redirect("/dashboard")
    })
  })
})

app.delete("/users/:id", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)
    const id = Number(req.params.id)
    const userIndex = users.findIndex((user) => user.id === id)

    users.splice(userIndex, 1)

    fs.writeFile("users.json", JSON.stringify(users), (err) => {
      res.redirect("/dashboard")
    })
  })
})

//- API Routes - USER

app.get("/api/users", (req, res) => {
  return res.json(users)
})

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id)
  const user = users.find((user) => user.id === id)
  res.json(user)
})

app.post("/api/users", (req, res) => {
  const { fullName, email, phone, password } = req.body

  const user = {
    id: users.length + 1,
    fullName,
    email,
    phone,
    password,
  }

  users.push(user)

  fs.writeFile("users.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "Error", message: "Failed to write user data." })
    }
    return res.json({ status: "Success", user })
  })
})

app.patch("/api/users/:id", (req, res) => {
  const { fullName, email, phone, password } = req.body

  const id = Number(req.params.id)

  const userIndex = users.findIndex((user) => user.id === id)

  users[userIndex] = {
    ...users[userIndex],
    fullName: fullName || users[userIndex].fullName,
    email: email || users[userIndex].email,
    phone: phone || users[userIndex].phone,
    password: password || users[userIndex].password,
  }

  fs.writeFile("users.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Updated", user: users[userIndex] })
  })
})

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id)
  const userIndex = users.findIndex((user) => user.id === id)

  const deletedUser = users[userIndex]

  users.splice(userIndex, 1)

  fs.writeFile("users.json", JSON.stringify(users), (err) => {
    return res.json({
      status: "Deleted",
      deletedUser,
    })
  })
})

app.listen(8000, () => console.log("Server started at PORT: 8000"))

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
