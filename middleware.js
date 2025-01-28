const Listing=require("./models/listing");
const expressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to creat listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit!")
        return res.redirect(`/listings/${id}`);   
    }
    next();
};

module.exports.validateListings=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,review_id}=req.params;
    let review=await Review.findById(review_id);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!")
        return res.redirect(`/listings/${id}`);   
    }
    next();
};

