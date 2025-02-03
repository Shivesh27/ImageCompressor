const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


const app = express()
const prot = 3000
const upload = multer({dest: "uploads/"})

app.get('/', (req, res) => {
    res.send(`
        <h2>Upload an Image</h2>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="image" required>
            <button type="submit">Upload</button>
        </form>
        
        `)
})


app.post("/upload", upload.single("image"), async (req, res) => {
    if(!req.file){
        return res.status(400).send("No File uploaded")
    }

    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, "uploads", `compressed_${Date.now()}.jpg`);

    try {
        await sharp(inputPath)
            .resize({width: 800})
            .jpeg({quality: 70})
            .toFile(outputPath);

        fs.unlinkSync(inputPath)
        res.download(outputPath, (err) => {
            if(err) console.error(err);
            fs.unlinkSync(outputPath)
        })
    } catch(error) {
        console.error("Error processing image", error);
        res.status(500).send("Image processing failed.")
    }
});

app.listen(prot, () => {
    console.log("listening on port 3000")
})