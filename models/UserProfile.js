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
      trim: true,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    role: { type: String, enum: ["admin", "basic"], default: "basic" },
    password: {
      type: String,
      trim: true,
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

function getAvatar(name) {
  return "https://ui-avatars.com/api/?background=random&size=128&name=" + name;
}

schema.pre("save", async function (next) {
  // Hash Password
  if (this.password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate Image Avatar
  if (!this.img_url) {
    this.img_url = getAvatar(this.name);
  }

  next();
});

schema.post("save", async function (user, next) {
  console.log("Saving user profile: ", user);
  next();
});

schema.statics.login = async function (email, password) {
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

module.exports = model("UserProfile", schema);

module.exports.getAvatar = getAvatar;
