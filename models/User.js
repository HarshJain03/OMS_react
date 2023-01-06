const sql = require("../config/db.js");
const Joi = require("joi");
// const { ReactReduxContext } = require("react-redux");
// constructor
const User = function(customer) { 
  this.email = customer.email;
  this.firstName= customer.firstName;
  this.mobile_no= customer.mobile_no;
  this.password= customer.password;
  this.userType= customer.userType;
  this.role= customer.role;
  this.loan= customer.loan;
  this.marginCall= customer.marginCall;
  this.intrestRate= customer.intrestRate;
  this.liquidations= customer.liquidations;
  this.cryptoCurrency= customer.cryptoCurrency;
  this.pairManagement= customer.pairManagement;
  this.buyOrder= customer.buyOrder;
  this.sellOrder= customer.sellOrder;
  this.manageUsers= customer.manageUsers;
  this.fundRequest= customer.fundRequest;
  this.roleManager= customer.roleManager;
  this.suportManagement= customer.suportManagement;
  this.verifyComplete= customer.verifyComplete;
  this.verifyPending= customer.verifyPending;
  // this.OldPassword = customer.OldPassword
  // this.NewPassword = customer.NewPassword
  this.depositFee = customer.depositFee

};
User.findByEmaill = (email, result) => {
  sql.query(`SELECT * FROM users WHERE email = '${email}' AND userType="ADMIN" AND userType="STAFF"`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res[0]);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};
User.findByEmailUser = (email, result) => {
  sql.query(`SELECT * FROM users WHERE email = '${email}' AND userType="USER"`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res[0]);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};
User.findByName = (email, result) => {
  sql.query(`SELECT * FROM users WHERE email = '${email}'`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res[0]);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};

User.findUserQry = (walletAddr,result) => {
  sql.query(`SELECT id FROM user_wallet_addressess WHERE wallet_address = '${walletAddr}'`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res[0]);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};
// User.findUserById = (userId, result) => {
//   sql.query(`SELECT * FROM users WHERE id = '${userId}'`, (err, res) => {
//     if (err) {
//       result(err, null);
//       return;
//     }
//     if (res.length) {
//       result(null, res[0]);
//       return;
//     }
//   result({ kind: "not_found" }, null);
//   });
// };

User.updateUserEnable2faStatus = (id, users, result) => {
  console.log("updateUserKycStatus",id, users )
  sql.query(
    "UPDATE users SET enable_2fa = ? WHERE id = ?",
    [users.enable_2fa, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
   
    result(null, { id: res.insertId, ...users });
  });
};
User.updateUserKycStatus = (id, users, result) => {
  console.log("updateUserKycStatus",id, users )
  sql.query(
    "UPDATE users SET enable_2fa = ? WHERE id = ?",
    [users.enable_2fa, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
   
    result(null, { id: res.insertId, ...users });
  });
};

User.getAllEthAddressLIst = (result) => {

  sql.query(`SELECT user_wallet_addressess.wallet_address as singleAddr FROM user_wallet_addressess LEFT JOIN cryptocoin ON cryptocoin.id=user_wallet_addressess.currency_id WHERE cryptocoin.short_name="ETH" AND user_wallet_addressess.wallet_address !=''`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};
User.getAllPendingVerifyUserLIst = (result) => {
  var status= 1;
  var rstatus= 3;
  sql.query(`SELECT * FROM users WHERE userType = 'USER' AND (identity_status = '${status}'  OR identity_status2 = '${status}' OR image3_status = '${status}' OR (selfie_status = '${status}' OR identity_status = '${rstatus}'  OR identity_status2 = '${rstatus}' OR image3_status = '${rstatus}' OR selfie_status = '${rstatus}'))  ORDER BY users.createdAt DESC`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};
User.getAllCompleteVerifyUserLIst = (result) => {
  var status= 2;
  sql.query(`SELECT * FROM users WHERE userType = "USER" AND identity_status = '${status}' AND identity_status2 = '${status}' AND image3_status = '${status}' AND selfie_status = '${status}'  ORDER BY users.createdAt DESC`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};


User.getAllRoleByIdList = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = '${id}'`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};
User.getAllrejectReasonByIdList = (id, result) => {
  sql.query(`SELECT d1_rejectResion,d2_rejectResion,d3_rejectResion,d4_rejectResion FROM users WHERE id = '${id}'`, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};
User.create = (newUser, result) => {
  ////console.log('newUser');
  ////console.log(newUser);
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
     
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, newUser });
  });
};

User.createRole = (newUser, result) => {
  ////console.log('newUserRole');
  ////console.log(newUser);
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, newUser });
  });
};
User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      ////console.log("error: ", err);
      result(null, err);
      return;
    }

    ////console.log("users: ", res);
    result(null, res);
  });
};
User.getAllUserList = result => {
  sql.query("SELECT * FROM users WHERE userType='USER' ORDER BY createdAt DESC", (err, res) => {
    if (err) {
      ////console.log("error: ", err);
      result(null, err);
      return;
    }

    ////console.log("users: ", res);
    result(null, res);
  });
};
User.getAllRoleList = result => {
  sql.query("SELECT * FROM users WHERE userType='ADMIN' OR userType='STAFF' ", (err, res) => {
    if (err) {
      ////console.log("error: ", err);
      result(null, err);
      return;
    }

    ////console.log("users: ", res);
    result(null, res);
  });
};
User.getData = () => {
  sql.query(`SELECT * FROM users WHERE userType="ADMIN" OR userType="STAFF"`)
}
User.findById = (email, result) => {
  sql.query(`SELECT * FROM users WHERE (userType="ADMIN" OR userType="STAFF") AND email = '${email}'`, (err, res) => {
    if (err) {
      ////console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.deleteOne = (id, result) => {
  sql.query(`UPDATE users SET is_deleted=1 WHERE id = '${id}'`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, true);
    return;
   
  });
};

User.unBlock = (id, result) => {
  sql.query(`UPDATE users SET is_deleted=0 WHERE id = '${id}'`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, true);
    return;
   
  });
};

User.update = (id, users, result) => {
  sql.query(
    "UPDATE users SET firstName = ?, lastName = ?, email = ?, dob = ? , line1 = ?, line2 = ?, zipcode = ?, city = ?, r_country = ?, mobile_no = ?, BankName = ?, AccNum = ?, Ifsc = ?, BranchName = ?, AccHolder = ? WHERE id = ?",
    [users.firstName, users.lastName,users.email,users.dob,users.line1,users.line2,users.zipcode,users.city,users.r_country,users.mobile_no,users.BankName,users.AccNum,users.Ifsc,users.BranchName,users.AccHolder, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};

User.updatePass = (id, users, result) => {
  sql.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [users.password, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateUserPass = (id, users, result) => {
  sql.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [users.password, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.getPasswordDetails = (email, result) => {
  sql.query(`SELECT password as p1 FROM users WHERE (userType="ADMIN" OR userType="STAFF") AND  email='${email}'`,(err, res) => {
    if (err) {
      ////console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  })
}
User.UpdatePassword = (id, users,result) => {
  console.log(users)
  // sql.query("UPDATE users SET password = ? WHERE email= ?",
  // [userData.NewPassword,userData.email]
  // )
}
User.updateRole = (id, users, result) => {
  sql.query(
    "UPDATE users SET firstName = ?, email = ?,mobile_no = ?,role = ?,loan = ?,intrestRate = ?,marginCall = ?,liquidations = ?,cryptoCurrency = ?,buyOrder = ?,sellOrder = ?,manageUsers = ?,fundRequest = ?,pairManagement = ?,suportManagement = ?,verifyComplete = ?,verifyPending = ?, inr_withdrawal = ?, transtion_history = ?, add_deduct = ?, roleManager = ?,password = ?,depositFee = ? WHERE id = ?",
    [users.firstName,
      users.email,
      users.mobile_no,
      users.role,
      users.loan,
      users.intrestRate,
      users.marginCall,
      users.liquidations,
      users.cryptoCurrency,
      users.buyOrder,
      users.sellOrder,
      users.manageUsers,
      users.fundRequest,
      users.pairManagement,
      users.suportManagement,
      users.verifyComplete,
      users.verifyPending,
      users.inrWithdrawal,
      users.transtion_history,
      users.add_deduct,
      users.roleManager,
      users.password, 
      users.depositFee,
      id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateVerifiactionD1 = (id, users, result) => {
  sql.query(
    "UPDATE users SET identity_status = ? ,identity_status2 = ? WHERE id = ?",
    [users.identity_status,users.identity_status, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateRole_password_byuser = (id, hashedPassword, users, result) => {
  sql.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, id ],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateVerifiactionD2 = (id, users, result) => {
  // console.log('111');
  sql.query(
    "UPDATE users SET identity_status2 = ? WHERE id = ?",
    [users.identity_status2, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateVerifiactionD3 = (id, users, result) => {
  sql.query(
    "UPDATE users SET image3_status = ? WHERE id = ?",
    [users.image3_status, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateVerifiactionComplete = (id, users, result) => {
  sql.query(
    "UPDATE users SET kycVerification_status = ? WHERE id = ?",
    [users.kycVerification_status, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateVerifiactionD4 = (id, users, result) => {
  sql.query(
    "UPDATE users SET selfie_status = ? WHERE id = ?",
    [users.selfie_status, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateRejectD1 = (id, users, result) => {
  console.log('users',users);
  sql.query(
    "UPDATE users SET identity_status = ?,identity_status2 =?, d1_rejectResion= ? WHERE id = ?",
    // "UPDATE users SET identity_status = ? ,identity_status2 = ? WHERE id = ?",
    [users.identity_status,users.identity_status,users.d1_rejectResion, id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateRejectD2 = (id, users, result) => {
  console.log('users2',users);
  var NULL = NULL;
  // var docTypeStatus = 3;
  // console.log('docTypeStatus',docTypeStatus);
  sql.query(
    // "UPDATE users SET identity_status2 = ?,d2_rejectResion = ? WHERE id = ?",
    "UPDATE users SET identity_status = ?,identity_status2 = ?, d1_rejectResion= ?, doc_type_status= ? ,i_image=?,i_image2=?,document_number=?  WHERE id = ?",
    [users.identity_status2,users.identity_status2,users.d2_rejectResion,users.docTypeStatus,NULL,NULL,NULL, id.id],
    (err, res) => {
      console.log('err',err);
      console.log('res',res);
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateRejectD3 = (id, users, result) => {
  var NULL = NULL;
  sql.query(
    "UPDATE users SET image3_status = ?,d3_rejectResion= ?,panNumber=?,i_image3=? WHERE id = ?",
    [users.image3_status,users.d3_rejectResion,NULL,NULL,id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};
User.updateRejectD4 = (id, users, result) => {
  var NULL = NULL;
  sql.query(
    "UPDATE users SET selfie_status = ?,d4_rejectResion= ?,selfie_image=? WHERE id = ?",
    [users.selfie_status,users.d4_rejectResion,NULL,id.id],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...users });
  });
};

User.getUserTotal = result => {
  sql.query("SELECT COUNT(id) as total FROM users WHERE userType='USER'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

 
    result(null, res[0]);
  });
};
User.getPenddingTotal = result => {
    var status= 1;
  var rstatus= 3;
  sql.query(`SELECT COUNT(id) as total FROM users WHERE userType = 'USER' AND (identity_status = '${status}'  OR identity_status2 = '${status}' OR image3_status = '${status}' OR (selfie_status = '${status}' OR identity_status = '${rstatus}'  OR identity_status2 = '${rstatus}' OR image3_status = '${rstatus}' OR selfie_status = '${rstatus}'))`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

 
    result(null, res[0]);
  });
};
User.getCompleteTotal = result => {
  var status= 2;
  sql.query(`SELECT COUNT(id) as total FROM users WHERE userType = "USER" AND identity_status = '${status}' AND identity_status2 = '${status}' AND image3_status = '${status}' AND selfie_status = '${status}'`, (err, res) => {
    if (err) {
    
      result(null, err);
      return;
    }

   
    result(null, res[0]);
  });
};
User.getSupportTotal = result => {
  sql.query("SELECT COUNT(id) as total FROM help", (err, res) => {
    if (err) {
    
      result(null, err);
      return;
    }

 
    result(null, res[0]);
  });
};
User.getDepositTotal = result => {
  sql.query("SELECT sum(coin_amount) as total FROM wallet where tx_type='zaak pay' and cryptocoin_id=36", (err, res) => {
    if (err) {
    
      result(null, err);
      return;
    }

 
    result(null, res[0]);
  });
};
User.getRecentTranstions = (result) => {
  sql.query("SELECT wallet.*,cryptocoin.short_name as coinName FROM `wallet` LEFT JOIN cryptocoin ON cryptocoin.id = wallet.cryptocoin_id WHERE tx_type='purchase' OR tx_type='zaak pay'  ORDER BY wallet.created  DESC LIMIT 10", (err, res) => {
    if (err) {
      result(err, null);
      
      return;
    }
    if (res.length) {
      result(null, res);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};
User.getWithdrawalTotal = result => {
  sql.query("SELECT sum(coin_amount) as total FROM wallet where tx_type='Widthdrawl' and cryptocoin_id=36", (err, res) => {
    if (err) {
    
      result(null, err);
      return;
    }

 
    result(null, res[0]);
  });
};
// getTransactionTotal
User.getTransactionTotal = result => {
  sql.query(`SELECT sum(id) as sum FROM wallet where tx_type="zaak pay" and cryptocoin_id=36`, (err, res) => {
    if (err) {
    
      result(null, err);
      return;
    }

 
    result(null, res[0]);
  });
};
const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};
User.getStaffEmail = (id, result) => {
  console.log("iddd", id)
  var val="SELECT * FROM users WHERE id = "+id
  console.log("getstaffmail", val)

  sql.query("SELECT * FROM users WHERE id ="+id, (err, res) => {
    if (err) {
   
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res[0]);
      return;
    }
  result({ kind: "not_found" }, null);
  });
};
User.updateRole_password = (id, hashedPassword, users, result) => {
  
  sql.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, id ],
    (err, res) => {
    if (err) {
    result(err, null);
      return;
    }
   
    result(null, { id: res.insertId, ...users });
  });
};


module.exports = { User, validate };
