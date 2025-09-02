const Joi=require("joi");
module.exports.ListingSchema=Joi.object({
    Listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.string().required().min(0),
        location: Joi.string().required(),
        country: Joi.number().required(),
        image: Joi.string().allow("", null)
    }).required()
})