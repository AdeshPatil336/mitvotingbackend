    const { users, Nominee, dean, vote } = require("../models/usersShema");
    const moment = require("moment");
    const csv = require("fast-csv");
    const fs = require("fs");
    const bcrypt = require("bcrypt");
    const BASE_URL = process.env.BASE_URL



    let loggedInUserId = null;
    let renderUserId = null
    let dean_id  = null;
    //register user
    exports.userpost = async (req, res) => {
        const file = req.file.filename;
        const { fname, lname, bdate, dept, email, mobile, prn, password } = req.body;

        if (!fname || !lname || !bdate || !dept || !email || !mobile || !password || !prn || !file) {
            res.status(401).json("All inputs are required")
        }

        try {
            const peruser = await users.findOne({ email: email });
              
            if (!peruser) {
                const userData = new users({
                    fname, lname, bdate, dept, email, mobile, prn, password, profile: file
                });
                await userData.save();
                res.status(200).json(userData);
                
               
                
            } 
            else {
                
                res.status(401).json("This user already exist in our database");
            }

        } 
        catch (error) {
            res.status(401).json(error);
            console.log("catch block error")

        }

    };

    //user login
    exports.userlogin = async (req, res) => {

        const { email, password } = req.body;


        if (!email || !password) {
            res.status(401).json("All inputs are required")
        }
        try {
            const peruser = await users.findOne({ email: email });
        
            if (peruser) {
                const isMatch = await bcrypt.compare(password, peruser.password)
                

                if (!isMatch) {
                    res.status(401).json("Invalid Details")
                }
                else {
                    loggedInUserId = peruser._id;
                    res.status(200).json(peruser);
                }
            }
        } catch (error) {
            res.status(401).json(error);
            console.log("catch block error")
        }
    }

    // singleuserget
    exports.userprofile = async (req, res) => {

    
    //  console.log(loggedInUserId);
        try {
            const userdata = await users.findById(loggedInUserId);
            res.status(200).json(userdata)


        } catch (error) {
            res.status(401).json(error)
        }
    }

    //register Nominee
    exports.nomineepost = async (req, res) => {
        const file = req.file.filename;
        const { fname, lname, bdate, dept, email, mobile, prn, post } = req.body;

        if (!fname || !lname || !bdate || !dept || !email || !mobile || !post || !prn || !file) {
            res.status(401).json("All inputs are required")
        }

        try {
            const pernominee = await Nominee.findOne({ email: email });
            if (pernominee) {
                res.status(401).json("This nominee already exist in our database")
            } else {
                const nomineeData = new Nominee({
                    fname, lname, bdate, dept, email, mobile, prn, post, profile: file
                });
                await nomineeData.save();
                // Nominee_Data = nomineeData._id
                res.status(200).json(nomineeData);
                //console.log(nomineeData)
            }
        } catch (error) {
            res.status(401).json(error);
            console.log("catch block error")
        }
    };


    //nominee profile
    exports.nomineeprofile = async (req, res) => {

        const { id } = req.params;
    //  console.log(id)
        try {
            const dataNominee = await Nominee.findOne({_id: id})
            res.status(200).json(dataNominee)
        // console.log(dataNominee.fname)
        } catch (error) {
            res.status(401).json(error)
        }

    }




    //nominee edit
    exports.nomineeedit = async (req, res) => {
        const { id } = req.params;
        const { fname, lname, bdate, dept, email, mobile, prn, post, user_profile } = req.body;

        const file = req.file ? req.file.filename : user_profile;

        try {
            const updateNominee = await Nominee.findByIdAndUpdate({ _id: id }, {
                fname, lname, bdate, dept, email, mobile, prn, post, profile: file
            }, {
                new: true
            });
            await updateNominee.save();
            res.status(200).json(updateNominee);
        //console.log(updateNominee)
        } catch (error) {
            res.status(401).json(error)
        }
    }


    //nominee delete
    exports.nomineedelete = async (req, res) => {
        const { id } = req.params;
        try {
            const deleteNominee = await Nominee.findByIdAndDelete({ _id: id });
            res.status(200).json(deleteNominee);
        

        } catch (error) {
            res.status(401).json(error)
        }
    }


    //all Nominee get
    exports.nomineeget = async (req, res) => {

        try {
            
            const nomineesdata = await Nominee.find()
                res.status(200).json(nomineesdata)
            // console.log(nomineesdata.length)
        } catch (error) {
            res.status(401).json(error)
        }
    }


    //dean login
    exports.deanlogin = async (req, res) => {

        const { deanemail, deanpassword, deandept } = req.body;

        
        if (!deanemail || !deanpassword || !deandept) {
            res.status(401).json("All inputs are required")
        }
        try {
            const deanlogin = await dean.findOne({ deandept: deandept });
            // console.log(deanpassword)
        //   console.log(deanlogin.deandept)
            if (deanlogin.deandept === deandept && 
                deanlogin.deanpassword === deanpassword && 
                deanlogin.deanemail === deanemail) {
            
                res.status(200).json(deanlogin);
                dean_id = deanlogin._id;
            }
            else {     

                res.status(401).json("Invalid Details")  
            }
        } catch (error) {
            res.status(401).json(error);
        // console.log("catch block error")
        }
    }

    //dean profile
    exports.deanprofile = async (req, res) => {

    // console.log(dean_id)
        try {
            const datadean = await dean.findById(dean_id)
            res.status(200).json(datadean)
        // console.log(dataNominee.fname)
        } catch (error) {
            res.status(401).json(error)
        }

    }

    //useredit
    exports.useredit = async (req, res) => {
        const { id } = req.params;
        const { fname, lname, bdate, dept, email, mobile, prn, password, user_profile } = req.body;

        const file = req.file ? req.file.filename : user_profile;

        const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        try {
            const updateuser = await users.findByIdAndUpdate({ _id: id }, {
                fname, lname, bdate, dept, email, mobile, prn, password, profile: file, dateUpdated
            }, {
                new: true
            });
            await updateuser.save();
            res.status(200).json(updateuser);
        } catch (error) {
            res.status(401).json(error)
        }
    }

    //delete user
    exports.userdelete = async (req, res) => {
        const { id } = req.params;
        try {
            const deleteuser = await users.findByIdAndDelete({ _id: id });
            res.status(200).json(deleteuser);

        } catch (error) {
            res.status(401).json(error)
        }
    }

    //change status
    exports.userstatus = async (req, res) => {
        const { id } = req.params;
        const { data } = req.body;

        try {
            const userstatusupdate = await users.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
            res.status(200).json(userstatusupdate);

        } catch (error) {
            res.status(401).json(error)
        }

    }

    //export user
    exports.userExport = async (req, res) => {
        try {
            const usersdata = await users.find();

            const csvStream = csv.format({ headers: true });

            if (!fs.existsSync("public/files/export")) {
                if (!fs.existsSync("public/files")) {
                    fs.mkdirSync("public/files/")
                }
                if (!fs.existsSync("public/files/export")) {
                    fs.mkdirSync("./public/files/export")
                }

            }
            const writablestream = fs.createWriteStream(
                "public/files/export/users.csv"
            )
            csvStream.pipe(writablestream);

            writablestream.on("finish", function () {
                res.json({
                    downloadUrl: `${BASE_URL}/files/export/users.csv`
                })
            });

            if (usersdata.length > 0) {
                usersdata.map((user) => {
                    csvStream.write({
                        FirstName: user.fname ? user.fname : "-",
                        LastName: user.lname ? user.lname : "-",
                        Date: user.bdate ? user.bdate : "-",
                        Department: user.dept ? user.dept : "-",
                        Email: user.email ? user.email : "-",
                        Mobile: user.mobile ? user.mobile : "-",
                        AlternateMobile: user.prn ? user.prn : "-",
                        DateCreated: user.datecreated ? user.datecreated : "-",
                        DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
                    })
                })
            }

            csvStream.end();
            writablestream.end();

        } catch (error) {
            res.status(401).json(error)
        }

    }

    exports.voteExport = async (req, res) => {
        const { nomineeId, userId, post } = req.body; // Add 'post' to the destructuring


        try {
            const existingVote = await vote.findOne({ userId, nomineeId, post });
            if (existingVote) {
                return res.status(400).json({ message: "You have already voted for this nominee." });
            }

            // Fetch the nominee's post from the database
            const nominee = await Nominee.findById(nomineeId);

            if (!nominee) {
                return res.status(404).json({ message: "Nominee not found." });
            }

            // Check if the user has already voted for a nominee in the same post
            const user = await users.findById(userId);
            if (user.votedNominees.some((votedNominee) => votedNominee.post === post)) {
                return res.status(405).json({ message: "You have already voted for a nominee in this post." });
            }

            const newVote = new vote({ userId, nomineeId, post }); // Include 'post' when creating a new vote
            await newVote.save();

        const update = await vote.findByIdAndUpdate(nomineeId, {$inc: {voteCount: 1}});
        

            // Update the vote count for the nominee
        const upnominee = await Nominee.findByIdAndUpdate(nomineeId, { $inc: { voteCount: 1 } });

            // Add the voted nominee to the user's votedNominees array
            await users.findByIdAndUpdate(userId, {
                $push: { votedNominees: { nomineeId, post } }, // Include 'post' in the votedNominees array
            });

            res.status(200).json({ message: "Vote recorded successfully." });

        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: error.message });
        }
    };




    //fetch winner nominees for respective posts
    exports.fetchWinners = async (req, res) => {
        try {
        
        const postVoteCounts = await vote.aggregate([
            {
            $group: {
                _id: "$nomineeId",
                post: { $first: "$post" },
                count: { $sum: 1 },
            },
            },
        ]);

        console.log(postVoteCounts)
    
        // Find the maximum vote count for each post
        const maxVoteCounts = await vote.aggregate([
            {
            $group: {
                _id: "$post",
                maxCount: { $max: "$count" },
            },
            },
        ]);
    
        // Find the winner nominee for each post
        const winners = [];
        for (const maxVoteCount of maxVoteCounts) {
            const winner = await vote.findOne({ post: maxVoteCount._id, count: maxVoteCount.maxCount });
            if (winner) {
            const nominee = await Nominee.findById(winner.nomineeId);
            if (nominee) {
                winners.push({
                post: maxVoteCount._id,
                winner: nominee,
                });
            }
            }
        }
        res.status(200).json(winners);
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    };


exports.editPassword = async (req, res) => {
        const { newprn, newpassword } = req.body;
        

        if (!newprn || !newpassword) {
            res.status(401).json("All inputs are required")
        }
        try {
            const peruser = await users.findOne({ prn: newprn });
            // console.log(peruser);

            if (!peruser) {
                return res.status(404).json("User not found");
            }
         
            const saltRounds = 12; // You can adjust the number of salt rounds as needed
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);


           const newpass =  await users.findByIdAndUpdate(peruser._id, { password: hashedPassword });
          
        
          

           res.status(200).json("Password updated successfully");
           
        } catch (error) {
            res.status(401).json(error);
            console.log("catch block error")
        }
};

    








    

