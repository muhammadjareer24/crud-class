import express from "express"
import fs from "fs"

const app = express()

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let id = 0

//- USER--

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/register", (req, res) => {
  res.render("register")
})

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

app.get("/dashboard", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)

    res.render("dashboard", { users })
  })
})

app.get("/users/:id", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)

    res.render("profile", { user })
  })
})

app.patch("/users/:id", (req, res) => {
  const { fullName, email, phone, password } = req.body

  fs.readFile("users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)

    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          fullName,
          email,
          phone,
          password,
        }
      }
      return user
    })

    fs.writeFile("users.json", JSON.stringify(updatedUsers), (err) => {
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

//- USER API--

//- PRODUCTS--

// app.get("/", (req, res) => {
//   res.render("index")
// })

app.get("/registerProduct", (req, res) => {
  res.render("registerProduct")
})

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

app.get("/productDashboard", (req, res) => {
  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)

    res.render("productDashboard", { products })
  })
})

app.get("/products/:id", (req, res) => {
  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)
    const id = Number(req.params.id)
    const product = products.find((product) => product.id === id)

    if (!product) {
      return res.status(404).send("Product not found")
    }

    res.render("productProfile", { product })
  })
})

app.patch("/products/:id", (req, res) => {
  const { productName, description, price } = req.body

  fs.readFile("products.json", "utf-8", (err, data) => {
    const products = JSON.parse(data)
    const id = Number(req.params.id)
    const product = products.find((product) => product.id === id)

    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          productName,
          description,
          price,
        }
      }
      return product
    })

    fs.writeFile("products.json", JSON.stringify(updatedProducts), (err) => {
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

app.listen(8000, () => console.log("Server started on port 8000"))
