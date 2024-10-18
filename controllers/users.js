import User from "../models/User.js";

export function getAll(req, res) {
  User.find({})
    .then((docs) => {
      let Users = [];
      for (let i = 0; i < docs.length; i++) {
        Users.push({
          userID: docs[i].userID,
          firstname: docs[i].firstname,
          lastname: docs[i].lastname,
          username: docs[i].username,
          email: docs[i].email,
          password: docs[i].password,
          phone: docs[i].phone,
          avatar: docs[i].avatar,
          isBanned: docs[i].isBanned,
          role: docs[i].role
        });
      }
      res.status(200).json({ Users });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function getUserById(req, res) {
    const userId = req.params.userId; // Extract user ID from request parameters

    User.findOne({ userID: userId }) // Find the user by userID
        .then((user) => {
            if (!user) {
                // If user not found, send 404 Not Found response
                return res.status(404).json({ error: "User not found" });
            }
            // If user found, send the user details in the response
            res.status(200).json({ user });
        })
        .catch((err) => {
            // If an error occurs, send 500 Internal Server Error response
            res.status(500).json({ error: err.message });
        });
}

export function updateUserById(req, res) {
    const userId = req.params.userId; // Extract user ID from request parameters
    const updatedUserData = req.body; // Extract updated user data from request body

    User.findOneAndUpdate({ userID: userId }, updatedUserData, { new: true }) // Find and update user by userID
        .then((user) => {
            if (!user) {
                // If user not found, send 404 Not Found response
                return res.status(404).json({ error: "User not found" });
            }
            // If user found and updated successfully, send the updated user details in the response
            res.status(200).json({ user });
        })
        .catch((err) => {
            // If an error occurs, send 500 Internal Server Error response
            res.status(500).json({ error: err.message });
        });
}
