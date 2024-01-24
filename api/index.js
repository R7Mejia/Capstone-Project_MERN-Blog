require("dotenv").config()


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const user = require("./models/user");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
// const uploadMiddleware = multer({ dest: "uploads/" });

// Updated Multer configuration with increased limits
const uploadMiddleware = multer({
  dest: "uploads/",
  limits: {
    fieldSize: 10 * 1024 * 1024, // Increase the size limit (10MB in this example)
    fieldNameSize: 100, // Increase the field name size limit
  },
}); 

const fs = require("fs");

const port = 2024;

const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";
app.use(cookieParser());
/////////////////CORS////////
 app.use(
   cors({
     credentials: true,
     origin:"http://localhost:5173"
   })
 );
// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://capstone-project-mern-blog.vercel.app"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/uploads", express.static(__dirname + "/uploads"));

//MONGOOSE
mongoose.connect(
  process.env.MONGO_URI
);

//ROUTES
// //TESTING
// app.get('/testing', (req, res) => {
//  res.send("Hello from test endpoint");
// })

//

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await user.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user with the given username
        const userDoc = await user.findOne({ username });

        // Check if userDoc is not null
        if (userDoc) {
            // Compare the passwords if the user exists
            const passOk = bcrypt.compareSync(password, userDoc.password);

            if (passOk) {
                // Generate JWT token if passwords match
                jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie("token", token).json({
                        id: userDoc._id,
                        username,
                    });
                });
            } else {
                // Handle case where passwords don't match
                res.status(400).json("wrong credentials");
            }
        } else {
            // Handle case where user with the given username was not found
            res.status(400).json("user not found");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json("Internal Server Error");
    }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    console.log(req.cookies)
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("Sorry son, you are not the author");
      }

      // Use updateOne instead of postDoc.update
      await Post.updateOne(
        { _id: id },
        {
          $set: {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
          },
        }
      );

      // Fetch the updated document
      const updatedPostDoc = await Post.findById(id).populate("author", [
        "username",
      ]);

      res.json(updatedPostDoc);
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json("Internal Server Error");
  }
});
//random console.log
console.log("hello")

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

//DELETE un post
app.delete("/post/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({success: true})
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json("Internal Server Error")
   }
})

app.listen(port, () => console.log(`Server listening on port ${port}`));

