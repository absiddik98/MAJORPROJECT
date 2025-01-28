const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(e)=>{
            if(e){
                return next(e);
            }
            req.flash("success","welcome to wanderlust!")
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you're logged out!")
        res.redirect("/listings");
    })
};