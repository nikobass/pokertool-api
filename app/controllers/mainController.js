module.exports = {
    error404: (_, response) => {
        response.status(404).json({message: `Je suis passé dans le router mais je n'ai pas trouvé ma route !`});
    }
}