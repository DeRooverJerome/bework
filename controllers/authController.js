require("dotenv").config();
const User = require("../models/User");
const Note = require("../models/Notes");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

  //incorrect email
  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.email = "that email is already registerd";
    return errors;
  }

  // validation errorss
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const {
    email,
    password,
    firstname,
    lastname,
    github,
    pdfFile,
    profilePicture,
    passwordConfirm,
  } = req.body;

  try {
    const user = await User.create({
      email,
      password,
      firstname,
      lastname,
      github,
      pdfFile,
      profilePicture,
      passwordConfirm,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "net ninja secret", { maxAge: 1 });
  res.redirect("/");
};

module.exports.profil_get = (req, res) => {
  res.render("profil");
};

module.exports.createJob_get = (req, res) => {
  res.render("createJob");
};

module.exports.createJob_post = async (req, res) => {
  const {
    jobTitle,
    company,
    website,
    employerName,
    employerEmail,
    employerPhone,
    employerAddress,
    origin,
    status,
    comments,
    createdAt,
  } = req.body;
  try {
    const note = await Note.create({
      user: req.user.id,
      jobTitle,
      company,
      website,
      employerName,
      employerEmail,
      employerPhone,
      employerAddress,
      origin,
      status,
      comments,
      createdAt,
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

module.exports.dashboardViewNote_get = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.render("dashboard", { user: res.locals.user, notes });
  } catch (err) {
    console.log(err);
  }
};

module.exports.renderJob_get = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({
      user: req.user.id,
    })
    .lean();

  if (note) {
    res.render("renderJob", { noteID: req.params.id, note });
  } else {
    res.send("Something went wrong, no note found");
  }
};

module.exports.deleteJob_delete = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateJob_get = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({
      user: req.user.id,
    })
    .lean();
  if (note) {
    res.render("updateJob", { noteID: req.params.id, note });
  } else {
    res.send("Something went wrong, no note found");
  }
};

module.exports.updateJob_put = async (req, res) => {
  try {
    await Note.findByIdAndUpdate(
      req.params.id,
      {
        jobTitle: req.body.jobTitle,
        company: req.body.company,
        status: req.body.status,
        comments: req.body.comments,
        webiste: req.body.website,
        employerName: req.body.employerName,
        employerEmail: req.body.employerEmail,
        employerPhone: req.body.employerPhone,
        employerAddress: req.body.employerAddress,
        origin: req.body.origin,
      },
      { new: true }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// FILTERS

module.exports.dashboard_get = async (req, res) => {
  const filter = req.query.filter || "createdAt";
  const order = req.query.order || "desc";
  const notes = await Note.find({}).sort({
    [filter]: order === "desc" ? -1 : 1,
  });

  res.render("dashboard", { notes });
};
