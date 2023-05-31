require('dotenv').config();
var fs = require('fs');
const multer = require('multer');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express(); 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));
app.use("/uploads",express.static('uploads'));
mongoose.connect(process.env.URL,{useNewUrlParser:true});

const adminSchema ={
    username : String,
    password : String
}

const audioSchema = {
    name: String,
    title: String,
    artiste: String,
    yearReleased: String,
    thumbnail: {
        type: String,
        default: process.env.defaultImageAudio
    }
}

const pdfSchema = {
    name:String,
    title: String,
    snippet: String,
    author: String,
    yearWritten: String,
    pages: String,
    thumbnail: {
        type: String,
        default: process.env.defaultImagePDF
    }
}

const Audio = mongoose.model("Audio",audioSchema);
const PDF = mongoose.model("PDF",pdfSchema);
const Admin = mongoose.model("Admin",adminSchema);


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/")
    },
    filename: function(req, file, cb){
        cb(null, new Date().toDateString()+file.originalname);
    }
});

const fileFilter = (req, file, cb)=>{
    console.log("file->",file);
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype ==="audio/mpeg" ||file.mimetype ==="application/pdf"){
        //recieve file
        cb(null,true);
    }else{
        //reject file
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    fileFilter: fileFilter
});

//END POINTS
app.get('/',(req,res)=>{
    Audio.find({},(err,foundAudio)=>{
        // console.log(foundAudio);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    console.log(foundPdf);
                    if(!error){
                        if(foundPdf){
                            res.render("index",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse()});
                        }
                    }
                })
            }
        }
    })
});

app.get('/books',(req,res)=>{
    Audio.find({},(err,foundAudio)=>{
        // console.log(foundAudio);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    console.log(foundPdf);
                    if(!error){
                        if(foundPdf){
                            res.render("books",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse()});
                        }
                    }
                })
            }
        }
    })
});

app.get('/selected',(req,res)=>{
    console.log(req.query['id']); 
    const id = req.query['id'];
    Audio.find({},(err,foundAudio)=>{
        console.log(id);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    
                    if(!error){
                        if(foundPdf){
                            Audio.findById(id,(err,SfoundAudio)=>{
                                console.log("=>",SfoundAudio);
                                if(!err){
                                    if(SfoundAudio){
                                        console.log("Found!");
                                        res.render("selected",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse(),singleAudio:SfoundAudio});
                                    }
                                }
                            })
                            
                        }
                    }
                })
            }
        }
    })
    
    // console.log(id);
        // res.render("selected");
});

app.get('/add',(req,res)=>{
        res.render("add");
});

app.get('/admin',(req,res)=>{
    const id = req.query['id'];
    if(id == "1don"){
    Audio.find({},(err,foundAudio)=>{
        // console.log(foundAudio);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    console.log(foundPdf);
                    if(!error){
                        if(foundPdf){
                            res.render("admin_index",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse()});
                        }
                    }
                })
            }
        }
    })
    }else{
        res.redirect("/");
    }
});

app.get('/admin_selected_book',(req,res)=>{
    console.log(req.query['id']); 
    const id = req.query['id'];
    console.log("id=>",id);
    Audio.find({},(err,foundAudio)=>{
        console.log(id);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    if(!error){
                        if(foundPdf){
                            PDF.findById(id,(err,SfoundPdf)=>{
                                console.log("=>",SfoundPdf);
                                if(!err){
                                    if(SfoundPdf){
                                        console.log("Found!");
                                        res.render("admin_selected_book",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse(),singlePdf:SfoundPdf});
                                    }
                                }else{
                                    res.send(err.message);
                                }
                            })
                            
                        }
                    }
                })
            }
        }
    })
});

app.get('/admin_selected',(req,res)=>{
    console.log(req.query['id']); 
    const id = req.query['id'];
    Audio.find({},(err,foundAudio)=>{
        console.log(id);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    
                    if(!error){
                        if(foundPdf){
                            Audio.findById(id,(err,SfoundAudio)=>{
                                console.log("=>",SfoundAudio);
                                if(!err){
                                    if(SfoundAudio){
                                        console.log("Found!");
                                        res.render("admin_selected",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse(),singleAudio:SfoundAudio});
                                    }
                                }
                            })
                            
                        }
                    }
                })
            }
        }
    })
});

app.get('/login',(req,res)=>{
        res.render("login");
});

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const token = "1don";
    var id ="62fa6f079e5b296a4ea12f15";
    Admin.find({},(err,find)=>{
        if(find){
            id=find._id;
        }
    })
    Admin.findById(id,(err,found)=>{
        if(!err){
            if(found){
                if(found.username == username && found.password == password){
                    res.redirect("/admin?id="+token);
                }else{
                    res.send("wrong crendentials");
                }
                
            }
        }
    })
        
});

app.post('/addaudio',upload.single('audio'),(req,res)=>{
    const title = req.body.songTitle;
    const artiste = req.body.artiste;
    const yearReleased = req.body.year_released;
    const Name = req.file.filename;

    console.log("->",req.file);
    
    const fileType = req.file.mimetype;

    if(fileType ==="audio/mpeg"){
        const item = new Audio({
           name: Name,
            title: title,
            artiste: artiste,
            yearReleased: yearReleased,
        });
        item.save();
    }
    console.log("sent");
    res.send("sent");
        
});

app.post('/addpdf',upload.single('pdf'),(req,res)=>{
    const title = req.body.pdfTitle;
    const snippet = req.body.book_snippet;
    const author = req.body.author;
    const yearWritten = req.body.yearWritten;
    const pages = req.body.pages;
    const Name = req.file.filename;
    const fileType = req.file.mimetype;
    console.log(req.file);

    console.log("title->",title);
    
    if(fileType ==="application/pdf"){
        const item = new PDF({
            name: Name,
            title: title,
            snippet: snippet,
            author: author,
            yearWritten: yearWritten,
            pages: pages,
        });
        item.save();
    }
    console.log("sent");
    res.send("sent");
});

app.get('/selected_book',(req,res)=>{
        console.log(req.query['id']); 
    const id = req.query['id'];
    Audio.find({},(err,foundAudio)=>{
        console.log(id);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    
                    if(!error){
                        if(foundPdf){
                            PDF.findById(id,(err,SfoundPdf)=>{
                                console.log("=>",SfoundPdf);
                                if(!err){
                                    if(SfoundPdf){
                                        console.log("Found!");
                                        res.render("selected_book",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse(),singlePdf:SfoundPdf});
                                    }
                                }
                            })
                            
                        }
                    }
                })
            }
        }
    })
});


// app.post("/upload/pdf",upload.single("shopImage"),(req,res)=>{
//     console.log(req.file);
//     let title = req.body.title;
//     let snippet = req.body.snippet;
//     let Name = req.file.filename;
//     let author = req.body.author;
//     let yearWritten = req.body.yearWritten;
//     let pages = req.body.pages;

//     console.log("title->",title);
//     let fileType = req.file.mimetype;
//     if(fileType ==="application/pdf"){

//         const item = new PDF({
//             name: Name,
//             title: title,
//             snippet: snippet,
//             author: author,
//             yearWritten: yearWritten,
//             pages: pages,
//         });
//         item.save();
//     }
//     console.log("sent");
//     res.send("sent");
// });


// app.post("/upload/audio",upload.single("shopImage"),(req,res)=>{
//     console.log("->",req.file);
//     let title = req.body.title;
//     let Name = req.file.filename;
//     let artiste = req.body.artiste;
//     let yearReleased = req.body.yearReleased;
//     let fileType = req.file.mimetype;

//     if(fileType ==="audio/mpeg"){

//         const item = new Audio({
//            name: Name,
//             title: title,
//             artiste: artiste,
//             yearReleased: yearReleased,
//         });
//         item.save();
//     }
//     console.log("sent");
//     res.send("sent");
// });


// app.get('/delete',(req,res)=>{

//     const id = req.query['name'];
//     const linkUrl = './public/'+id;
//     console.log(linkUrl);
//     PDF.findOneAndDelete({name:id},(err)=>{
//         if(!err){
//             try{
//                 fs.unlinkSync(linkUrl);
//                 console.log("Deleted successfuly");
//             }catch(error){
//                 console.log("Error in deleting file");
//                 console.log(error.message);
//             }
//         }
//     })    
    

// });

app.post('/changeaudio',(req,res)=>{
   const title = req.body.title;
   const id = req.body.id;
   const artiste = req.body.artiste;
   console.log("id=>",id);
   console.log("title=>",title);
   console.log("artiste=>",artiste);
   Audio.findByIdAndUpdate(id, {artiste:artiste,title:title}, (err)=>{
    if(!err){
        res.redirect("/admin_selected?id="+id);
    }
   })
// res.redirect("")
})
app.post('/changepdf',(req,res)=>{
   const title = req.body.title;
   const id = req.body.id;
   const author = req.body.author;
   const snippet = req.body.snippet;


   PDF.findByIdAndUpdate(id, {title:title,author:author,snippet:snippet}, (err)=>{
    if(!err){
        console.log("done!");
        res.redirect("/admin_selected_book?id="+id);
    }
   })
// res.redirect("")
})

app.post('/changeaudiocover',upload.single("shopImage"),(req,res)=>{
   const id = req.body.id;
   const thumbnail= req.file.filename;
  
   
   
   Audio.findById(id,(err,found)=>{
    const linkUrl = './public/'+found.thumbnail;
    console.log("linkUrl=>",linkUrl);
    if(!err){
        if(found){
            try{
                fs.unlinkSync(linkUrl);
                console.log("Deleted successfuly");
            }catch(error){
                console.log("Error in deleting file");
                console.log(error.message);
            }
            Audio.findByIdAndUpdate(id, {thumbnail:thumbnail}, (err)=>{
                if(!err){
                    res.redirect("/admin_selected?id="+id);
                }
               })
        }
    }
   });

   
});
app.post('/changepdfcover',upload.single("pdfimage"),(req,res)=>{
   const id = req.body.id;
   const thumbnail= req.file.filename;
  console.log("thumbnail=>",thumbnail);
   PDF.findById(id,(err,found)=>{
    const linkUrl = './public/'+found.thumbnail;
    console.log("linkUrl=>",linkUrl);
    if(!err){
        if(found){
            try{
                fs.unlinkSync(linkUrl);
                console.log("Deleted successfuly");
                
            }catch(error){
                console.log("Error in deleting file");
                console.log(error.message);
            }
            PDF.findByIdAndUpdate(id, {thumbnail:thumbnail}, (err)=>{
                if(!err){
                    res.redirect("/admin_selected_book?id="+id);
                }
               })
        }
    }
   });

   
});

app.post('/deleteaudio',(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const linkUrl = './public/'+name;
    console.log(linkUrl);
// console.log(id);

try{
    fs.unlinkSync(linkUrl);
    console.log("Deleted successfuly");
   
}catch(error){
    console.log("Error in deleting file");
    console.log(error.message);
} Audio.findByIdAndDelete(id,(err)=>{
    if(!err){
        res.redirect("/admin");
    }
})
    
});
app.post('/deletepdf',(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const linkUrl = './public/'+name;
    console.log(linkUrl);
// console.log(id);

try{
    fs.unlinkSync(linkUrl);
    console.log("Deleted successfuly");
    PDF.findByIdAndDelete(id,(err)=>{
        if(!err){
            res.redirect("/admin");
        }
    })
}catch(error){
    console.log("Error in deleting file");
    console.log(error.message);
}
    
});




app.listen(process.env.PORT ||3000,()=>{
    console.log("Barber Shop Backend Is Running On Port 3000");
});

