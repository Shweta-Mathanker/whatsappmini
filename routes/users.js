const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost:27017/whatsappfinal');
const plm = require('passport-local-mongoose')


const userSchema = mongoose.Schema({
  username:String,
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  profilePicture: {
    type: String,
    default: 'https://imgs.search.brave.com/USq6MEDfGp1sK39BUX9NknxQuqz9kVVfkyzx2MPsjMs/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5naXRlbS5jb20v/cGltZ3MvbS8xNTAt/MTUwMzk0NV90cmFu/c3BhcmVudC11c2Vy/LXBuZy1kZWZhdWx0/LXVzZXItaW1hZ2Ut/cG5nLXBuZy5wbmc' // Provide the path to your default image
  }, // URL to the profile picture
  status: String,
  lastSeen: Date,
  socketId: String,
  friends: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  } ]  
})

userSchema.plugin(plm)

module.exports = mongoose.model('user', userSchema)