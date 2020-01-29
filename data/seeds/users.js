const bcryptjs = require("bcryptjs");
// The user schema should include: `username`, `password` and `department`. 
// The `department` should be a string used to group the users. 
// No need for a `departments` table or setting up relationships.


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username:"hello", password:bcryptjs.hashSync("password1"), department:"Zone1"},
        {username:"hello1", password:bcryptjs.hashSync("password2"), department:"Zone2"},
        {username:"hello3", password:bcryptjs.hashSync("password3"), department:"Zone3"},
      ]);
    });
};
