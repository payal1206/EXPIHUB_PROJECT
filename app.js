const express = require('express');
const nodemailer = require('nodemailer');
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');   //unique strings
const Router = express.Router();
const User = require("./models/User");

const academic_query = require("./models/academictable");
const Comment = require("./models/comment");

const general_query = require("./models/generaltable");
const CommentGeneral = require("./models/general_comment");

const admin = require("./models/admintable");
const adminpaper = require("./models/papertable");
const interviewexperience = require("./models/interviewExp");
const authenticateUser = require("./middlewares/authenticateUser");
const authadmin = require("./middlewares/admin");
const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const passport = require("passport");

const path = require('path');

// file uploading 
const multer = require('multer')
var empModel = require('./modules/employee');
var uploadModel = require('./modules/upload');  //database sai lene ke liye 
const { request } = require('http');
const connection = require('./config/database');



var employee = empModel.find({});
var imageData = uploadModel.find({});

Router.use(express.static(__dirname + "./public/"));
const match = ["image/png", "image/jpeg"];


var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    var name = file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    req.body.Imagename = "http://localhost:4000/uploads/" + name;
    cb(null, name);
  }
})
const fileFilter = (req, res, cb) => {
  cb(null, true);
}

var upload = multer({
  storage: Storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

// route for serving frontend files

Router.get("/", (req, res) => {
  // console.log(req.session);
  var f = 0;
  console.log(req.session);
  console.log(req.user);
  if (req.user) {
    res.render("index", { user: req.user });
  } else {
    res.render("index", { user: null });
  }
});


//login
Router.get("/login", (req, res) => {
  res.render("login");
})
Router.post("/login", async (req, res, next) => {
  const { email, password } = req.body
  // Validate request 
  if (!email || !password) {
    //  req.flash('error', 'All fields are required')
    return res.redirect('/login')
  }
  function _getRedirectUrl(req) {
    return req.user.role === 'admin' ? '/admin/indexbooks' : '/'                //here user is not schema wala ,this is a user which is already loggedin
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      //  req.flash('error', info.message )
      console.log("error occured");
      // req.flash('error', info.message )
      return next(err)
    }
    if (!user) {
      //  req.flash('error', info.message )
      console.log("user not found");
      // req.flash('error', info.message )
      return res.redirect('/login')
    }

    //  if(!user.confirmed
    //      console.log("Confirm your email");
    //      return new Error("Please confirm your email to login!!");
    //  }



    req.logIn(user, (err) => {
      if (err) {
        //  req.flash('error', info.message ) 
        console.log("error occured");
        return next(err)
      }
      console.log("user has logged in");
      //  req.flash('error', info.message ) 
      return res.redirect(_getRedirectUrl(req))
    })
  })(req, res, next)
})


const randString = () => {
  let randStr = uuidv4();
  return randStr
}

// send Mail fun is starting

const sendEmail = async (email, uniqueString) => {
  const Transport = await nodemailer.createTransport({    // connection
    service: 'gmail',
    port: 587,
    auth: {
      user: process.env.MY_GMAIL_USERID,
      pass: process.env.MY_GMAIL_PASS
    }
  });
  var mailOptions = {
    from: 'btbti18080_payal@banasthali.in',
    to: email,
    subject: "Email Verification",
    html: `Thank you for registeration . <br> Press <a href=http://localhost:4000/verify/${uniqueString}> here </a> to verify your email. Thanks`
  };
  await Transport.sendMail(mailOptions, function (error, res) {
    if (error) {
      console.log(error);
    }
    else
      console.log('message send via nodemailer ');
  });
};

//register
Router.get("/register", (req, res) => {
  res.render("register");
})
Router.get("/submain", (req, res) => {
  res.render("submain");
})


Router.post("/register", async (req, res) => {
  if (
    Object.entries(req.body).length === 0 &&
    req.body.constructor === Object
  ) {
    // req.flash('error', 'All fields are required')
    res.send({ message: "Please provide a body" });
  } else {
    const { firstName, lastName, collegeId, email, course, graduationYear, password, RepeatPassword } = req.body;
    try {
      const doesUserExitsAlready = await User.findOne({ email });
      if (doesUserExitsAlready) {
        res.send("A user with that email already exits please try another one!");
        // res.redirect('/login');
        // req.flash('error', 'Email already taken')
        res.render("home", { user: { email: "samsonnkrumah253@gmail.com" } })
      } else {
        let salt = await bcryptjs.genSalt(10);
        let hashedPassword = await bcryptjs.hash(password, salt);
        // const hashedPassword = await bcrypt.hash(password, 12);
        // const hashedRepeatPassword = await bcrypt.hash(RepeatPassword, 12);
        const uniqueString = randString()
        const latestUser = new User({ firstName, lastName, collegeId, email, course, graduationYear, password: hashedPassword, RepeatPassword: hashedPassword, uniqueString: uniqueString });
        await latestUser.save().then((user) => {



          console.log("registered successfully");
          sendEmail(user.email, uniqueString);
          //  req.flash('success', 'Verification mail has been sent to your registered email address!')
          res.send('please verify your email-id');
          //  res.redirect('/login');
        }).catch(error => {
          console.log(error);
        })

        //-----------------------------------
        // res.send("registered account!");
        //-----------------------------------
        // res.render('home',{user:{...latestUser._doc}});

      }
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  }
});



/* GET home page. */
Router.get("/home", (req, res) => {
  res.render("home", { user: req.session.user });
});

//upload
Router.get('/uploads', function (req, res, next) {
  imageData.exec(function (err, data) {
    if (err) throw err;
    res.render('file_upload', { title: 'Upload File', records: data, success: '' });
  });
});
Router.post('/uploads', upload.single("file"), function (req, res, next) {
  var imageFile = req.file.filename;
  var success = req.file.filename + " uploaded successfully";

  var imageDetails = new uploadModel({
    imagename: imageFile
  });
  imageDetails.save(function (err, doc) {
    if (err) throw err;

    imageData.exec(function (err, data) {      //to view the existing file also 
      if (err) throw err;
      res.render('file_upload', { title: 'Upload File', records: data, success: success });
    });  //saara data records mai save hojayege

  });
});





Router.get('/verify/:uniqueString', async (req, res) => {
  const { uniqueString } = req.params
  const user = await User.findOne({ uniqueString: uniqueString })
  if (user) {
    user.confirmed = true
    await user.save()
    res.redirect('/login')
  } else {
    res.json('User not found')
  }
});

//books
Router.get("/books", authenticateUser, async (req, res) => {
  const books = await admin.find({ status: { $eq: "true" } }, null, { sort: { 'createdAt': -1 } }).exec((err, books) => {
    // console.log(books);            //bs db ko call krdiya 
    res.render("books", {
      books: books
    })
  })
});


Router.post("/books", upload.single("myfile"), (req, res) => {
  console.log(req.body);
  // res.send(req.body)

  const { BookName, AuthorName, Edition, Publications, Imagename } = req.body;                 //destructuring
  // if (match.indexOf(file.mimetype) === -1) {
  //     alert("upload as per user request");
  //     res.redirect("/");
  // }
  var fileinfo = req.file;
  console.log(fileinfo);

  const latest = new admin({
    BookName,
    AuthorName,
    Edition,
    Publications,
    Imagename: req.body.Imagename
  });

  latest.save();
  res.redirect('/books');

});

//booksearch
Router.post("/searchbook", function (req, res) {
  console.log("chloo");
  var name = req.body.name;
  var Author = req.body.Author;
  var edition = req.body.edition;
  var Publisher = req.body.Publisher;
  console.log("name-",name);
  console.log("Author-",Author);
  console.log("edition-",edition);
  console.log("Publisher-",Publisher);

  if (name != '' && Author != '' && edition != '' && Publisher != '') {
    var filter1 =
    {
      $and: [{ name: name }, { $and: [{ Author: Author }, { $and: [{ edition: edition }, { $and: [{ Publisher: Publisher }] }] }] }]

    }
    // console.log("Filter1",filter1);
  }
  else if (name != '' && Author != '' && edition == '' && Publisher == '') {
    var filter1 = { $and: [{ name: name }, { Author: Author }] }
  }
  else {
    var filter1 = {}
  }
  var bookfilter = admin.find(filter1);
  console.log("bookfilter-----------",bookfilter);
  bookfilter.exec(function (err, data) { 
    console.log("data---------",data)     //to view the existing file also 
    if (err) throw err;
    res.render('books', { title: 'book Record', books: data });
  });  //saara data records mai save hojayege

});






//interview experience
Router.get("/interviewexperience", authenticateUser, async (req, res) => {
  const exps = await interviewexperience.find().populate("postedBy").exec();
  try {
    console.log(exps);
    // res.send(exps);
    if (!exps) {
      res.render("interviewexperience", {
        exps: new interviewexperience(),
      });
    } else {
      res.render("interviewexperience", { exps: exps });
    }
  } catch (err) {
    console.log(err);
  }
});

Router.post("/interviewexperience", async (req, res) => {
  const { title, description, jobType, companyName, year, isoncampus, created } = req.body;
  if (!title || !description || !jobType || !companyName) {
    return res.redirect("/interviewexperience");
  }
  const inexp = new interviewexperience({
    postedBy: req.user._id,
    title,
    description,
    jobType,
    companyName,
    year,
    isoncampus,
    created
  });
  console.log(inexp);
  await inexp
    .save()
    .then((data) => {
      console.log("Interview Exp successfully entered!!");
      return res.redirect("/interviewexperience");
    })
    .catch((err) => {
      console.log(err);
    });
});

Router.get("/interviewexperience/:id", authenticateUser, function (req, res) {
  interviewexperience.findById(req.params.id).populate("postedBy").exec(function (err, experience) {
    if (err) {
      console.log("ERROR");
    } else {
      res.render("showinterview", { exp: experience });
    }
  });
});


Router.get("/paper", authenticateUser, async (req, res) => {
  const papers = await adminpaper.find({ status: { $eq: "true" } }, null, { sort: { 'createdAt': -1 } }).exec((err, papers) => {
    // console.log(books);   
    res.render("paper", {
      papers: papers
    })
  })
})

Router.post("/paper", authenticateUser, upload.single("Imagename"), (req, res) => {
  console.log(req.body);
  // res.send(req.body)

  const { papercode, papername, semester, yearofexam, subject, papertype, Imagename } = req.body;                 //destructuring
  // if (match.indexOf(file.mimetype) === -1) {
  //     alert("upload as per user request");
  //     res.redirect("/");
  // }
  console.log(req.body.type);
  var fileinfo = req.file;
  console.log(fileinfo);

  const latest = new adminpaper({
    papercode,
    papername,
    semester,
    yearofexam,
    subject: req.body.subject,
    papertype: req.body.papertype,
    Imagename: req.body.Imagename

  });

  latest.save();
  res.redirect('/paper');
});


//papersearch
Router.get("/search", function (req, res) {
  var PC = req.query.PC;
  var Sem = req.query.Sem;
  var YR = req.query.YR;
  var PT = req.query.PT;


  console.log(PT);
  if (PC != '' && Sem != '' && YR != '' && PT != '') {
    var filter =
    {
      $and: [{ papercode: PC }, { $and: [{ semester: Sem }, { $and: [{ yearofexam: YR }, { $and: [{ papertype: PT }] }] }] }]

    }
  }
  else if (PC != '' && Sem != '' && YR == '' && PT == '') {
    var filter = { $and: [{ papercode: PC }, { semester: Sem }] }
  }
  else {
    var filter = {}
  }
  var paperfilter = adminpaper.find(filter);
  console.log(paperfilter);
  paperfilter.exec(function (err, data) {
    console.log("data-------------",data); //to view the existing file also 
    if (err) throw err;
    else {
      res.render('paper', { title: 'Paper Record', papers: data });
    }

  });  //saara data records mai save hojayege

});



//discussion forum
Router.get("/forum", (req, res) => {
  res.render("discussionforum");
})

//academic
Router.get("/academicforum", authenticateUser, async (req, res) => {
  const academicquery = await academic_query.find().populate("author").exec();
  try {
    if (!academicquery) {
      res.render("academicforum", {
        academicquery: new academic_query(),
      });
    } else {
      res.render("academicforum", { academicquery: academicquery });
    }
  } catch (err) {
    console.log(err);
  }
});

Router.post("/academicforum", authenticateUser, async (req, res) => {
  const { question, created, comments } = req.body;
  if (!question) {
    return res.redirect("/academicforum");
  }
  const academicquery = new academic_query({
    author: req.user._id,
    question,
    created,
    comments
  });
  console.log(academicquery);
  await academicquery
    .save()
    .then((data) => {
      console.log("Posted Query Successfully");
      return res.redirect("/academicforum");
    })
    .catch((err) => {
      console.log(err);
    });
});



// SHOW - shows more info about one question
Router.get("/academicforum/:id", authenticateUser, function (req, res) {
  academic_query.findById(req.params.id).populate({
    path: "comments",
    populate: {
      path: "comment_head"
    }
  }).exec(function (err, experience) {
    if (err || !experience) {
      console.log("ERROR");
      res.redirect("back");
    } else {
      res.render("showaforum", { aforum: experience });
    }
  });
});


Router.post("/academicforum/:id", authenticateUser, async (req, res) => {
  academic_query.findById(req.params.id, (err, aquestion) => {
    console.log("BODY-", req.body);
    const { comment_text } = req.body;
    if (!req.body.c_text) {
      return res.redirect("/academicforum" + aquestion._id);
    }
    else {
      const comment = new Comment({
        comment_head: req.user._id,
        comment_text: req.body.c_text
      });
      comment.save();
      aquestion.comments.push(comment);
      aquestion.save();
      res.redirect("/academicforum/" + aquestion._id);
    }
  });
});


// Router.delete("/academicforum/:id", (req, res) => {
//   academic_query.findByIdAndRemove(req.params.id, (err, aquestion) => {
//     if (err) {
//        res.redirect("/academicforum/"+aquestion._id)
//        }
//     else {
//       res.redirect("/academicforum");
//     }
//   });
// });



//general
Router.get("/generalforum", authenticateUser, async (req, res) => {
  const generalquery = await general_query.find().populate("author").exec();
  try {
    if (!generalquery) {
      res.render("generalforum", {
        generalquery: new general_query(),
      });
    } else {
      res.render("generalforum", { generalquery: generalquery });
    }
  } catch (err) {
    console.log(err);
  }
});

Router.post("/generalforum", authenticateUser, async (req, res) => {
  const { question, created, comments } = req.body;
  if (!question) {
    return res.redirect("/generalforum");
  }
  const generalquery = new general_query({
    author: req.user._id,
    question,
    created,
    comments
  });
  console.log(generalquery);
  await generalquery
    .save()
    .then((data) => {
      console.log("Posted Query Successfully");
      return res.redirect("/generalforum");
    })
    .catch((err) => {
      console.log(err);
    });
});


// SHOW - shows more info about one question
Router.get("/generalforum/:id", authenticateUser, function (req, res) {
  general_query.findById(req.params.id).populate({
    path: "comments",
    populate: {
      path: "comment_head"
    }
  }).exec(function (err, experience) {
    if (err) {
      console.log("ERROR");
      res.redirect("back");
    } else {
      res.render("showgforum", { gforum: experience });
    }
  });
});


Router.post("/generalforum/:id", authenticateUser, async (req, res) => {
  general_query.findById(req.params.id, (err, gquestion) => {
    console.log("BODY-", req.body);
    const { comment_text } = req.body;
    if (!req.body.c_text) {
      return res.redirect("/generalforum" + gquestion._id);
    }
    else {
      const comment = new CommentGeneral({
        comment_head: req.user._id,
        comment_text: req.body.c_text
      });
      comment.save();
      gquestion.comments.push(comment);
      gquestion.save();
      res.redirect("/generalforum/" + gquestion._id);
    }
  });
});




//admin page 
// Router.get("/admin", authadmin,async(req, res) => {
//       const books=await admin.find()                   //bs db ko call krdiya 
//       res.render("Admin_table",{
//         books:books
//       });
// });



Router.post("/logout", (req, res) => {
  req.logout();   //passport predefined function
  return res.redirect('/');
})



Router.get("/admin/indexuser", (req, res) => {
  res.render("indexuser");
});
Router.get("/admin/indexbooks", authadmin, async (req, res) => {
  const books = await admin.find()                   //bs db ko call krdiya 
  res.render("indexbooks", {
    books: books
  });
});


Router.post("/statuschange", async (req, res) => {
  try{
    var resStatus = req.body.status;
    console.log("111",resStatus);
    if (resStatus) {
      let doc = await admin.findOneAndUpdate({ BookName: req.body.bookname }, { status: resStatus });
      doc.save()
      res.redirect('/admin/indexbooks');
    }
  }catch(e){
    console.log("e----",e)
  }
});


Router.get("/admin/indexpaper", authadmin, async (req, res) => {
  const paper = await adminpaper.find()                   //bs db ko call krdiya 
  res.render("indexpaper", {
    papers: paper
  });
});

Router.post("/statuschangepaper", async (req, res) => {
  try{
    var resStatus = req.body.status;
  console.log("111",resStatus);
  if (resStatus) {
    
    let doc = await adminpaper.findOneAndUpdate({ papercode: req.body.papercode }, { status: resStatus });
    doc.save()
    res.redirect('/admin/indexpaper');
  }
  }catch(e){
    console.log("e----",e)
  }
  
});

module.exports = Router;
