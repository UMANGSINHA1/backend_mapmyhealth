const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  console.log(req.body);
  res.send("yes");
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});
// app.post("/newuserinfo", async (req, res) => {
//   try {
//     const {
//       name_of_doctor,
//       medicine,
//       day,
//       month,
//       diagnosis,
//       year,
//       userid,
//       category,
//     } = req.body;
//     if (!(await Patient.findById(userid))) {
//       return res.status(400).json({ message: "User is not recognized" });
//     }
//     const date = { day, month, year };
//     const old_new_records = (await Patient.findById(userid))?.new_records;
//     new_records = [
//       ...old_new_records,
//       {
//         name_of_doctor,
//         diagnosis: diagnosis,
//         medicine:medicine,
//         date: { day, month, year },
//         download_url: "",
//         category:category,
//       },
//     ];
//     await Patient.findByIdAndUpdate(userid, { new_records });
//     return res
//       .status(200)
//       .json({ message: "Patient data updated successfully" });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });
/* 
name_of_doctor
medicine
dosage
category
day
month
year
diagnosis,

*/
/*
name_of_doctor: {
        type: String,
      },
      diagnosis: {
        directions: String,
        medicine: [
          {
            name: String,
            dosage: String,
          },
        ],
        medical_condition: String,
      },
      date: {
        day: {
          type: Number,
        },
        month: {
          type: Number,
        },
        year: {
          type: Number,
        },
      },
      download_url: {
        type: String,
        default: "",
      },
*/
