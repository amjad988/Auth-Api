const joi=require("@hapi/joi")


//validation
class DataValidation
{
    static regValidation(request)
{
    const validationSchema=joi.object({
        name:joi.string().min(2).required(),
        email:joi.string().min(6).required().email(),
        password:joi.string().min(8).required(),
    })
    return validationSchema.validate(request)
}

static loginValidation=request=>
{
    const validationSchema=joi.object({
        email:joi.string().min(6).required().email(),
        password:joi.string().min(8).required(),
    })
    return validationSchema.validate(request)
}
}

module.exports={DataValidation}


