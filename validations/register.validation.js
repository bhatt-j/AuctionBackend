const joi = require("joi");

// const email_regex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = (user) => {
  const createUserSchema = joi
    .object({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      address: joi.string().required(),
      password: joi.string().required(),
      aadharNumber: joi.number().required(),
      gender:joi.string().required(),
      dob:joi.date().required(),
    //   email: joi.string().custom((val, helper) => {
    //     if (email_regex.test(val)) {
    //       return true;
    //     }
    //     return helper.message("Enter Valid Email ID");
    //   }),
      email:joi.string().email().required(),
<<<<<<< HEAD
      mobileNumber:joi.string().required(),
      dob:joi.string().required(),
=======
      mobileNumber:joi.string().required()
>>>>>>> 5f22324f729c63ada5f6c63010d4e79717d273d7
    })
    .options({ abortEarly: true });
  return createUserSchema.validate(user);
};