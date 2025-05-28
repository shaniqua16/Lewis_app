require("dotenv").config();
// const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "1234";
const jwt = require("jsonwebtoken");
const {prisma,jwt,bcrypt} = require("../../common");

const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,
             parseInt(process.env.BCRYPT_SALT)
    );

    const response = await prisma.user.create({
        data: {
            firstname: req.body.firstname,    
            lastname: req.body.lastname,       
            email: req.body.email,      
            street: req.body.street,    
            city: req.body.city,       
            state: req.body.state,      
            postalCode: req.body.postalCode,     
            password: hashedPassword,
        },
        });

        if (response){
            const token = jwt.sign({id: response.id }, JWT_SECRET,{expiresIn: "8h"});
            const obj = {
        message: "Registration successful!",
        token: token,
      };
      res.send(obj);
        }
    } catch (error) {
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res
        .status(409)
        .send({ message: "User with this email already exists." }); // 409 Conflict
    }
    next(error);
    }

};

const userLogIn = async (req, res, next) => {
    const response = await prisma.user.findFirst({
        where: {
            AND:[
                {email: req.body.email},
                {OR:[
                    { activated: null},
                    { activated: true}
                ]}
            ]
            
        }
    })
 if (!response) {
   return res.status(401).send({ message: "Invalid username or password." }); 
 } 
   const match = await bcrypt.compare(req.body.password, response.password);
   if (match) {
     const token = jwt.sign({ id: response.id }, JWT_SECRET, {
       expiresIn: "8h",
     });
     const obj = {
       message: "Login successful!",
       token: token,
       user:{
        id: response.id,
        firstname: response.firstname,
        lastname: response.lastname,
        email: response.email,
       }
     };
     res.send(obj);
}  else {
    res.send("incorrect username or password");
  }
};

const userInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (response) {
            const obj = {
                message: "User successfully found",
        user: {
          id: loggedInUser.id,
          email: loggedInUser.email,
          firstname: loggedInUser.firstname,
          lastname: loggedInUser.lastname,
          street: loggedInUser.street,
          city: loggedInUser.city,
          state: loggedInUser.state,
          postal: loggedInUser.postalCode,
        },
            };
            res.send(obj);
        } else {
            res.send("User not found");
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
  createUser,
  userLogIn,
  userInfo,
};