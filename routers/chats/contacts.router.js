const router = require("express").Router();
const { Contact, UserProfile } = require("../../models");

async function hasContact(user_id, contact_id) {
  const contact = await Contact.findOne({ user_id, contact_id });
  if (contact) {
    return true;
  } else {
    return false;
  }
}

async function sendRequest(user_id, contact_id) {
  const isContact = await hasContact(user_id, contact_id);
  if (!isContact) {
    const contactProfile = await UserProfile.findById(contact_id);

    const contact = new Contact({
      user_id,
      contact_id,
      contact_name: contactProfile.name,
      contact_img_url: contactProfile.img_url,
      contact_email: contactProfile.email,
      status: "Pending",
    });

    await contact.save((err) => {
      if (!err) {
        return contact;
      } else {
        return err;
      }
    });
  }

  return null;
}

//TODO...
async function acceptRequest(user_id, contact_id) {}
async function declineRequest(user_id, contact_id) {}
async function removeContact(user_id, contact_id) {}
async function editContact(user_id, contact_id) {}
async function blockContact(user_id, contact_id) {}

// Get all contacts for user
router.get("/", async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user._id });
  const users = await UserProfile.find({});
  res.render("user/contacts", {
    loggedIn: res.locals.loggedIn,
    user: req.user,
    contacts,
    users,
  });
});

// Send Request

// Accept Request

// Edit contact

// Delete contact

// Block contact

module.exports = router;
