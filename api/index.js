const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const port = 2024;
const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "mongodb+srv://robertomejiar7:MANBlogger7@cluster0.fegrfox.mongodb.net/"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
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
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
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
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    // Use updateOne instead of update
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
});

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

app.listen(port, () => console.log(`Server listening on port ${port}`));









//  const cors = require("cors");
// const mongoose = require("mongoose");
// const express = require("express");
// const User = require("./models/User");
// const Post = require("./models/Post");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const multer = require("multer");
// const uploadMiddleware = multer({ dest: "uploads/" });
// const fs = require("fs");

// const salt = bcrypt.genSaltSync(10);
// const secret = "blablablablablablablableblibloblu";

// const app = express();
// const port = 2024;

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use(
//   cors({
//     origin: "http://localhost:2024", //same port as the client?
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, //added this
//   })
// );

// // Connect to MongoDB
// mongoose.connect(
//   "mongodb+srv://robertomejiar7:MANBlogger7@cluster0.fegrfox.mongodb.net/"
// );

// // Routes

// // Register route
// app.post('/register', async(req, res) => {
//     const { username, password } = req.body;
//     try {
//         const userDoc = await User.create({
//           username,
//           password: bcrypt.hashSync(password, salt),
//         });
//         res.json(userDoc)
//     } catch (e) {
//         res.status(400).json(e )
//     }
// });

// // Login route
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const userDoc = await User.findOne({ username });

//     if (!userDoc) {
//       // User not found
//       return res.status(400).json("wrong credentials");
//     }

//     const passOk = bcrypt.compareSync(password, userDoc.password);

//     if (passOk) {
//       // User found and password is correct
//       jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
//         if (err) throw err;
//         res.cookie("token", token).json({
//           id: userDoc._id,
//           username,
//         });
//       });
//     } else {
//       // User found, but password is incorrect
//       res.status(400).json("wrong credentials");
//     }
//   } catch (error) {
//     // Handle other errors
//     console.error("Error during login:", error);
//     res.status(500).json("Internal Server Error");
//   }
// });

// // Logout route
// app.post('/logout', (req, res) => {
//     res.cookie('token', '').json('ok');
// });

// // Profile route
// app.get("/profile", (req, res) => {
//   const { token } = req.cookies;
//   console.log(token);
//   jwt.verify(token, secret, {}, (err, info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });

// // Create post
// app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
//   if (req.file) {
//     const { originalname, path } = req.file;
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     const newPath = path + "." + ext;
//     fs.renameSync(path, newPath);

//     const { token } = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//       if (err) throw err;
//       const { title, summary, content } = req.body;
//       const postDoc = await Post.create({
//         title,
//         summary,
//         content,
//         cover: newPath,
//         author: info.id,
//       });
//       res.json(postDoc);
//     });
//   } else {
//     res.status(400).json("No file provided");
//   }
// });

// // Update post
// app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
//   let newPath = null;
//   if (req.file) {
//     const { originalname, path } = req.file;
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//   }

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { id, title, summary, content } = req.body;
//     const postDoc = await Post.findById(id);
//     const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//     if (!isAuthor) {
//       return res
//         .status(400)
//         .json("Lo siento camarada, pero tu no eres el autor.");
//     }

//     // Use updateOne instead of deprecated update method
//     await Post.updateOne(
//       { _id: id },
//       {
//         $set: {
//           title,
//           summary,
//           content,
//           cover: newPath ? newPath : postDoc.cover,
//         },
//       }
//     );

//     // Fetch the updated post
//     const updatedPost = await Post.findById(id).populate("author", ["username"]);
//     res.json(updatedPost);
//   });
// });

// // Get posts
// app.get("/post", async (req, res) => {
//   res.json(
//     await Post.find()
//       .populate("author", ["username"])
//       .sort({ createdAt: -1 })
//       .limit(50)
//   );
// });

// // Get post by ID
// app.get("/post/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const postDoc = await Post.findById(id).populate("author", ["username"]);
//     if (!postDoc) {
//       return res.status(404).json("Post not found");
//     }
//     res.json(postDoc);
//   } catch (error) {
//     console.error(`Error fetching post with ID ${id}:`, error);
//     res.status(500).json("Internal Server Error");
//   }
// });

// app.listen(port, () => console.log(`Server listening on port ${port}`));

// const cors = require("cors");
// const mongoose = require("mongoose");
// const express = require("express");
// const User = require("./models/User");
// const Post = require("./models/Post");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const multer = require("multer");
// const uploadMiddleware = multer({ dest: "uploads/" }); // Updated middleware declaration
// const fs = require("fs");

// const salt = bcrypt.genSaltSync(10);
// const secret = "blablablablablablablableblibloblu";

// const app = express();
// const port = 2024;

// ///////////middlewares////

// app.use(express.json());
// app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use(
//   cors({
//     origin: "http://localhost:5173", //link to the front end port
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, //add credentials or I guess change to true
//   })
// );

// // app.use(cors())

// mongoose.connect(
//   "mongodb+srv://robertomejiar7:MANBlogger7@cluster0.fegrfox.mongodb.net/"
// );

// //this app.post will get the requests/inputs from react/front-end. That's pretty much why it's a post method instead of get or put. Hence post basically means CREATE
// app.post('/register', async(req, res) => {
//     const { username, password } = req.body;
//     try {
//         const userDoc = await User.create({
//           username,
//           password: bcrypt.hashSync(password, salt),
//         });
//         res.json(userDoc)
//     } catch (e) {
//         res.status(400).json(e )
//     }
// })

// //Creating the login route/path

// // app.post("/login", async (req, res) => {
// //   const { username, password } = req.body;
// //   const userDoc = await User.findOne({ username });
// //   const passOk = bcrypt.compareSync(password, userDoc.password);
// //   if (passOk) {
// //     // logged in
// //       jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
// //           console.log(token);
// //       if (err) throw err;
// //       res.cookie("token", token).json({
// //         id: userDoc._id,
// //         username,
// //       });
// //     });
// //   } else {
// //     res.status(400).json("wrong credentials");
// //   }
// // });

// // Creating the login route/path
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const userDoc = await User.findOne({ username });

//     if (!userDoc) {
//       // User not found
//       return res.status(400).json("wrong credentials");
//     }

//     const passOk = bcrypt.compareSync(password, userDoc.password);

//     if (passOk) {
//       // User found and password is correct
//       jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
//         if (err) throw err;
//         res.cookie("token", token).json({
//           id: userDoc._id,
//           username,
//         });
//       });
//     } else {
//       // User found, but password is incorrect
//       res.status(400).json("wrong credentials");
//     }
//   } catch (error) {
//     // Handle other errors
//     console.error('Error during login:', error);
//     res.status(500).json("Internal Server Error");
//   }
// });

// //creating a profile endpoint
// app.get('/profile', (req, res) => {
//     const { token } = req.cookies;
//     console.log(token)
//     jwt.verify(token, secret, {}, (err, info) => {
//         if (err) throw err;
//         res.json(info);
//     })
// })

// //this is for the logout functionality
// app.post('/logout', (req, res) => {
//     res.cookie('token', '').json('ok');
// })

// //This is for creating posts
// app.post('/post', uploadMiddleware.single('file'),
//     async (req, res) => {
//     const { originalname, path} = req.file;
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + "." + ext;
//     fs.renameSync(path, newPath);

//     const { token } = req.cookies;
//     jwt.verify(token, secret, {}, async(err, info) => {
//         if (err) throw err;
//     const { title, summary, content } = req.body;
//     const postDoc = await Post.create({
//         title,
//         summary,
//         content,
//         cover: newPath,
//         author: info.id,
//     })
//     res.json(postDoc)
// })

//         app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
//           let newPath = null;
//           if (req.file) {
//             const { originalname, path } = req.file;
//             const parts = originalname.split(".");
//             const ext = parts[parts.length - 1];
//             newPath = path + "." + ext;
//             fs.renameSync(path, newPath);
//           }

//           const { token } = req.cookies;
//           jwt.verify(token, secret, {}, async (err, info) => {
//             if (err) throw err;
//             const { id, title, summary, content } = req.body;
//             const postDoc = await Post.findById(id);
//             const isAuthor =
//               JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//             if (!isAuthor) {
//               return res.status(400).json("Lo siento camarada, pero tu no eres el autor.");
//             }
//             await postDoc.update({
//               title,
//               summary,
//               content,
//               cover: newPath ? newPath : postDoc.cover,
//             });

//             res.json(postDoc);
//           });
//         });

//     app.get('/post', async (req, res) => {
//         res.json(
//             await Post.find()
//                 .populate('author', ['username'])
//                 .sort({ createdAt: -1 })
//             .limit(50)//Limiting the amount of posts
//         );
//     })
//     })

//     app.get("/post/:id", async (req, res) => {
//       const { id } = req.params;
//       const postDoc = await Post.findById(id).populate("author", ["username"]);
//       res.json(postDoc);
//     });

// app.listen(port, () => console.log(`Server listening on port ${port}`));

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const User = require("./models/User");
// const Post = require("./models/Post");
// const bcrypt = require("bcryptjs");
// const app = express();
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const multer = require("multer");
// const uploadMiddleware = multer({ dest: "uploads/" });
// const fs = require("fs");

// const salt = bcrypt.genSaltSync(10);
// const secret = "asdfe45we45w345wegw345werjktjwertkj";

// app.use(cors({ credentials: true, origin: "http://localhost:4000" }));
// app.use(express.json());
// app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));

// mongoose.connect(
//   "mongodb+srv://robertomejiar7:MANBlogger7@cluster0.fegrfox.mongodb.net/"
// );

// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const userDoc = await User.create({
//       username,
//       password: bcrypt.hashSync(password, salt),
//     });
//     res.json(userDoc);
//   } catch (e) {
//     console.log(e);
//     res.status(400).json(e);
//   }
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const userDoc = await User.findOne({ username });
//   const passOk = bcrypt.compareSync(password, userDoc.password);
//   if (passOk) {
//     // logged in
//     jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
//       if (err) throw err;
//       res.cookie("token", token).json({
//         id: userDoc._id,
//         username,
//       });
//     });
//   } else {
//     res.status(400).json("wrong credentials");
//   }
// });

// app.get("/profile", (req, res) => {
//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, (err, info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });

// app.post("/logout", (req, res) => {
//   res.cookie("token", "").json("ok");
// });

// app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
//   const { originalname, path } = req.file;
//   const parts = originalname.split(".");
//   const ext = parts[parts.length - 1];
//   const newPath = path + "." + ext;
//   fs.renameSync(path, newPath);

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { title, summary, content } = req.body;
//     const postDoc = await Post.create({
//       title,
//       summary,
//       content,
//       cover: newPath,
//       author: info.id,
//     });
//     res.json(postDoc);
//   });
// });

// app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
//   let newPath = null;
//   if (req.file) {
//     const { originalname, path } = req.file;
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//   }

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { id, title, summary, content } = req.body;
//     const postDoc = await Post.findById(id);
//     const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//     if (!isAuthor) {
//       return res.status(400).json("you are not the author");
//     }
//     await postDoc.update({
//       title,
//       summary,
//       content,
//       cover: newPath ? newPath : postDoc.cover,
//     });

//     res.json(postDoc);
//   });
// });

// app.get("/post", async (req, res) => {
//   res.json(
//     await Post.find()
//       .populate("author", ["username"])
//       .sort({ createdAt: -1 })
//       .limit(20)
//   );
// });

// app.get("/post/:id", async (req, res) => {
//   const { id } = req.params;
//   const postDoc = await Post.findById(id).populate("author", ["username"]);
//   res.json(postDoc);
// });

// app.listen(4000);
