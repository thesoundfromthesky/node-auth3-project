// The user schema should include: `username`, `password` and `department`. 
// The `department` should be a string used to group the users. 
// No need for a `departments` table or setting up relationships.


exports.up = function(knex) {
  return knex.schema.createTable("users", tbl => {
    tbl.increments();
    tbl
      .text("username", 16)
      .unique()
      .notNullable();
    tbl.text("password", 200).notNullable();
    tbl.text("department", 20)
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
