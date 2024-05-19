import express from "express";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize Multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1 MB limit
}).single("imageUrl");

// Default posts
const defaultPosts = [
  {
    id: 1,
    title: "HeratGrandMosque",
    description:"One of the largest and most beautiful mosques in Afghanistan, also known as the Friday Mosque of Herat, dating back to the Ghaznavid and Seljuk periods Herat Grand Mosque is one of the biggest mosques in the city of Herat, a historical place built during the Timurid era of Herat.",
    imageUrl: "images/HeratGrandMosque1.jpg",
  },
  {
    id: 2,
    title: "AkhtaruddinCastle",
    description:
      " A historic fortress that dates back to the time of Alexander the Great and has been rebuilt by various kings over the centuries..",
    imageUrl: "images/AkhtaruddinCastle2.jpg",
  },
  {
    id: 3,
    title: "The minarets of Herat",
    description:
      "  Including five historical minarets from the Timurid period, which are among the prominent architectural works of that era..",
    imageUrl: "images/The minarets of Herat3.jpg",
  },
  {
    id: 4,
    title: "Minar Jam",
    description:
      "Minar Jam is one of the famous minbars in Ghor province, which is located near a mountain and is 64 meters high.",
    imageUrl: "images/Minar Jam4.jpg",
  },

];

let posts = [...defaultPosts];

app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/newpost", (req, res) => {
  res.render("newpost");
});

app.post("/newpost", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); // Generate a unique ID for the post

      const newPost = { id, title, description, imageUrl };
      posts.push(newPost);

      res.redirect("/");
    }
  });
});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
    } else {
      
     const postId = parseInt(req.params.id);
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); 

       const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    posts[index].title = title;
    posts[index].description = description;
    if (imageUrl) {
      posts[index].imageUrl = imageUrl;
    }
  }
      res.redirect("/");
    }
  });
});


app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== postId);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
