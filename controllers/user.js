const otpGenerator = require("otp-generator");
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const Patient = require("../models/Patient");
const generateCode = require("../helpers/generateCode");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    // console.log("hi");
    const { name, password, email } = req.body;
    console.log(req.body);
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "invalid email address" + email,
      });
    }
    const check = await Patient.findOne({ email });
    if (check) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "password must be atleast 6 characters.",
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    // let tempUsername = first_name + last_name;
    // let newUsername = await validateUsername(tempUsername);
    const patient = await new Patient({
      name,
      email,
      password: cryptedPassword,
    }).save();
    // const emailVerificationToken = generateToken(
    //   { id: patient._id.toString() },
    //   "30m"
    // );
    // const url = `${process.env.BASE_URL}/activate/${patient?._id}`;
    // sendVerificationEmail(patient?.email, patient?.name, url);
    const token = generateToken({ id: patient?._id.toString() }, "7d");
    res.send({
      id: patient?._id,
      name: patient?.name,
      token: token,
      verified: patient?.verified,
      message: "Registration Successful !",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.activateAccount = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const check = await Patient.findById(id);
    if (check.verified == true) {
      return res
        .status(400)
        .json({ message: "This email is already activated." });
    } else {
      await Patient.findByIdAndUpdate(check._id, { verified: true });
      return res
        .status(200)
        .json({ message: "Account has beeen activated successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    console.log("hi");
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email, password);
    const user = await Patient.findOne({ email });
    if (!user) {
      console.log("shd");
      return res.status(400).json({
        message:
          "the email address you entered is not connected to an account.",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials.Please try again.",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.status(200).json({ message: "successfully logged in", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await Patient.findById(id);
    if (user.verified === true) {
      return res.status(400).json({
        message: "This account is already activated.",
      });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    // const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    // sendVerificationEmail(user.email, user.first_name, url);
    // console.log("object");
    return res.status(200).json({
      message: "Email verification link has been sent to your email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account does not exist",
      });
    } else {
      return res.status(200).json({
        email: user.email,
        picture: user.picture,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.sendResetPasswordCode = async (req, res) => {
  try {
    console.log("hi");
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await new Code({
      code,
      user: user._id,
    });
    console.log("iii");
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    console.log("object");
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
exports.addImageToDB = async (req, res) => {
  try {
    // console.log("hi");
    const { email, image_url, dd, mm, yy, category } = req.body;
    // console.log({email});
    console.log({ email, image_url, dd, mm, yy, category });
    const user = await Patient.findOne({ email: email });
    console.log(user);
    let prevrecords = user.prev_record;
    // console.log(prevrecords);
    // prevrecords = ;
    const respo = await Patient.findOneAndUpdate(
      { email: email },
      {
        prev_record: [
          ...prevrecords,
          {
            image_url: image_url,
            date: { day: dd, month: mm, year: yy },
            category: category,
          },
        ],
      }
    );

    console.log({ respo });
    return res.status(200).json({ message: "done" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.newuserinfo = async (req, res) => {
  try {
    const {
      name_of_doctor,
      medicine,
      day,
      month,
      diagnosis,
      year,
      userid,
      category,
      code,
    } = req.body;
    if ((await Patient.findById(userid)).code !== code)
      return res.status(200).json({ message: "Patient has destroyed otp" });
    if (!(await Patient.findById(userid))) {
      return res.status(400).json({ message: "User is not recognized" });
    }
    const date = { day, month, year };
    const old_new_records = (await Patient.findById(userid))?.new_records;
    new_records = [
      ...old_new_records,
      {
        name_of_doctor,
        diagnosis: diagnosis,
        medicine: medicine,
        date: { day, month, year },
        download_url: "",
        category: category,
      },
    ];
    await Patient.findByIdAndUpdate(userid, { new_records });
    return res
      .status(200)
      .json({ message: "Patient data updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
//https://res.cloudinary.com/dq95ueewn/image/upload/v1680713712/ordurqsbfa3i67h5bs8c.png
exports.generateOTP = async (req, res) => {
  try {
    console.log("hi");
    const { userid } = req.body;
    // console.log({userid});
    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    // console.log(await Patient.findById(userid));
    console.log(await Patient.findByIdAndUpdate(userid, { code }));
    return res
      .status(200)
      .json({ message: "OTP generated successfully", otp: code });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (otp === "######")
      return res.status(400).json({ message: "You dont get to see that" });
    const dbotp = (await Patient.findOne({ email })).code;
    if (dbotp === otp) {
      return res.status(200).json({
        message: "OTP matched",
        data: await Patient.findOne({ email }),
      });
    } else {
      return res.status(400).json({ message: "Incorrect otp" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.destroyotp = async (req, res) => {
  try {
    const { userid } = req.body;
    await Patient.findByIdAndUpdate(userid, { code: "######" });
    return res.status(200).json({ message: "OTP destroyed successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getpatientinfo = async (req, res) => {
  try {
    const { userid } = req.body;
    const patient = await Patient.findById(userid);
    return res.status(200).json({
      message: "OK",
      prev_records: patient.prev_record,
      new_records: patient.new_records,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
