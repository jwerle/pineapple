var user = {};

user.User = function User(){
    
  var Model =  new pineapple.model.Model('User', {
    uuid                        : String,
    username                    : String,
    email                       : String,
    encrypted_password          : String,
    reset_password_token        : String,
    reset_password_sent_at      : Date,
    remember_created_at         : Date,
    sign_in_count               : Number,
    current_sign_in_at          : Date,
    last_sign_in_at             : Date,
    current_sign_in_ip          : String,
    last_sign_in_ip             : String,
    created_at                  : Date,
    updated_at                  : Date
  }, {
    _id : false
  });

  Model.expose(['uuid', 'username', 'email']);

  return Model;
};

module.exports = user.User;