const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");
const { isValid, isValidValue } = require("../controllers/collegeController");

// ....................................Create Interns...................................//
const createIntern = async function (req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let data = req.body;
    const { name, email, mobile, collegeName, isDeleted } = req.body;

    if (!isValid(data))
      return res
        .status(400)
        .send({ status: false, message: "No information pass" });

    // validation for Student's name
    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    if (!isValidValue(name) || /\d/.test(name))
      return res
        .status(400)
        .send({ status: false, message: "Name is in wrong format" });

    // validation for Student's email
    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    if (!isValidValue(email))
      return res
        .status(400)
        .send({ status: false, message: "email is in wrong format" });
    if (!email.match(/\S+@\S+\.\S+/))
      return res
        .status(400)
        .send({ status: false, message: "Email is invalid" });

    // validation for Student's mobile number
    if (!mobile)
      return res
        .status(400)
        .send({ status: false, message: "mobile is required" });
    if (!isValidValue(mobile))
      return res
        .status(400)
        .send({ status: false, message: "mobile is in wrong format" });

    if (!mobile.match(/^\d{10}$/))
      return res
        .status(400)
        .send({ status: false, message: "mobile is invalid" });

    // Make a DB call on intern model to find email or mobile are exist or not
    let internEmail = await internModel.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (internEmail)
      return res.status(400).send({
        status: false,
        message: "Email or Mobile number already in use.",
      });

    // validation for College Name
    if (!collegeName)
      return res
        .status(400)
        .send({ status: false, message: "collegeName is required" });
    if (!isValidValue(collegeName))
      return res
        .status(400)
        .send({ status: false, message: "collegeName is in wrong format" });

    // validation for isDeleted Key
    if (isDeleted && typeof isDeleted !== "boolean")
      return res
        .status(400)
        .send({ status: false, message: "isDeleted is in wrong format" });

    let college = await collegeModel
      .findOne({
        $or: [{ name: collegeName }, { fullName: collegeName }],
        isDeleted: false,
      })
      .select({ _id: 1 });

    if (!college)
      return res
        .status(400)
        .send({ status: false, message: "college not exists" });
    delete data.collegeName;
    data.collegeId = college._id;

    let intern = await internModel.create(data);
    return res.status(201).send({ status: true, data: intern });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createIntern = createIntern;
