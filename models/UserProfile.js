const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    role: { type: String, enum: ["admin", "basic"], default: "basic" },
    password: {
      type: String,
      minlength: [6, "Minimum password length is 6 characters"],
    },
    img_url: String,
    provider: {
      name: String,
      id: String,
    },
    bio: String,
    dob: {
      day: Number,
      month: Number,
      year: Number,
    },
    address: {
      city: String,
      state: String,
      zip: String,
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    qualifications: {
      grade10: {
        subject: String,
        institution: String,
      },
      grade12: {
        subject: String,
        institution: String,
      },
      bachelors: {
        subject: String,
        institution: String,
      },
      masters: {
        subject: String,
        institution: String,
      },
      other: {
        subject: String,
        institution: String,
      },
    },
  },
  { timestamps: true }
);

schema.pre("save", async (next) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  this.password = await bcrypt.hash(password, salt);

  if (!this.img_url) {
    this.img_url = this.getAvatar(this.name);
  }

  next();
});

schema.post("save", (user, next) => {
  console.log("Created new user: ", user);
  next();
});

schema.statics.login = async (email, password) => {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};

schema.statics.getAvatar = async (name) => {
  return "https://ui-avatars.com/api/?background=random&size=128&name=" + name;
};

module.exports = model("UserProfile", schema);
