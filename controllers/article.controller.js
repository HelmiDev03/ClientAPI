
const Articles = require('../models/article')
const uploadImageformobile = require('../mediaUpload/mobile/uploadmediaconfigformobile')


const GetArticles = async (req, res) => {
    try {
        const articles = await Articles.find({ company: req.user.company });
        return res.status(200).json({ articles });
    }

    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




const CreateArticle = async (req, res) => {
    console.log(req.body);
    try {
        let article = {}

        const {
            title,
            description,
            image
            
        } = req.body;
       



        if (image) {
            const url = await uploadImageformobile(image);




            user = new Articles({
                title,
                description,
                image: url,
                author : req.user._id,
                company  : req.user.company,
                
            });
            await article.save();
        }
        else {
            article = new Articles({
                title,
                description,
                author : req.user._id,
                company  : req.user.company,
            });
            await article.save();
        }

        
        

        return res.status(201).json({ message: 'Article added successfully'   });

    }





    catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }


}


const GetArticle = async (req, res) => {
    try {
        const article = await Articles.findOne({ _id: req.params.id }).populate('author' ,'firstname lastname profilepicture')
        return res.status(200).json({ article });

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



















const DeleteArticle = async (req, res) => {
    try {
        const article = await Articles.findOne({ _id: req.params.id });
        if (article) {
             await Articles.deleteOne({ _id: req.params.id });

            
            return res.status(200).json({ message: 'article deleted successfully'  });
        }
        return res.status(404).json({ message: 'article not found' });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }
}


const UpdateArticle = async (req, res) => {
    try {
        const article = await Articles.findOne({ _id: req.params.id });
        if (article) {
            const { title, description, image } = req.body;
            if (image) {
                url = await uploadImageformobile(image);
                await Articles.updateOne({ _id: req.params.id }, { title, description, image: url });
            }
            else{
                await Articles.updateOne({ _id: req.params.id }, { title, description });
            }
            
            return res.status(200).json({ message: 'Article updated successfully' });
        }
        return res.status(404).json({ message: 'Article not found' });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


































module.exports = {
    GetArticles,
    CreateArticle,
    GetArticle,
    DeleteArticle,
    UpdateArticle

}