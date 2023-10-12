const mongoose = require("mongoose");
const patientSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  stats: {
    address: String,
    pin_code: String,
    phone: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    blood_group: {
      type: String,
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    allergy: {
      type: String,
    },
    bp_trend: [
      {
        high_bp: Number,
        low_bp: Number,
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
      },
    ],
  },
  prev_record: [
    {
      image_url: {
        type: String,
        default: "",
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
      category: {
        type: String,
      },
    },
  ],
  new_records: [
    {
      name_of_doctor: {
        type: String,
      },
      category: {
        type: String,
      },
      medicine: [
        {
          medicine: String,
          dosage: String,
        },
      ],
      diagnosis: {
        type: String,
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
    },
  ],
  code: {
    type: String,
    default: "######",
  },
});
module.exports = mongoose.model("Patient", patientSchema);
