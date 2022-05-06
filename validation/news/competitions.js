const Joi = require('joi')

//User-defined function to validate the user
const competitionValidation = (competitionData) => {
    const CompetitionSchema = {
        title: Joi.string().min(4).max(256).required(),
        content: Joi.string().min(10).max(1024).required(),
        no_of_likes: Joi.number().optional(),
        no_of_comments: Joi.number().optional(),
    }

    const JoiSchema = Joi.object(CompetitionSchema)
    return JoiSchema.validate(competitionData)
}

module.exports = { competitionValidation }