const users = require("../models/usersShema");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");
const BASE_URL = process.env.BASE_URL

//register user

exports.userpost = async (req, res) => {
    const file = req.file.filename;
    const { fname, lname, date, department, qual1, qual2, status, status2, designation, experience, cctc, ectc,
        period, industry, email, mobile, almobile, gender, location, resume } = req.body;

    if (!fname || !lname || !date || !department || !qual1 || !qual2 || !status
        || !status2 || !designation || !experience || !cctc || !ectc
        || !period || !industry || !email || !mobile || !almobile || !gender || !location || !resume  || !file) {
        res.status(401).json("All inputs are required")
    }

    try {
        const peruser = await users.findOne({ email: email });
        if (peruser) {
            res.status(401).json("This user already exist in our database")
        } else {
            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
            const userData = new users({
                fname, lname, date, department, qual1, qual2, status, status2, designation, experience, cctc, ectc,
                period, industry, email, mobile, almobile, gender, location, resume, profile: file, datecreated
            });
            await userData.save();
            res.status(200).json(userData);

        }


    } catch (error) {
        res.status(401).json(error);
        console.log("catch block error")

    }

};

//user get
exports.userget = async (req, res) => {

    const search = req.query.search || ""

    const gender = req.query.gender || ""

    const status = req.query.status || ""

    const sort = req.query.sort || ""

    const page = req.query.page || 1

    const ITEM_PER_PAGE = 4;

    const query = {
        fname: { $regex: search, $options: "i" }
    }

    if (gender !== "All") {
        query.gender = gender
    }

    if (status !== "All") {
        query.status = status
    }

    try {

        const skip = (page - 1) * ITEM_PER_PAGE

        const count = await users.countDocuments(query);

        const usersdata = await users.find(query)
            .sort({ datecreated: sort == "New" ? -1 : 1 })
            .limit(ITEM_PER_PAGE)
            .skip(skip);
        
        const pageCount = Math.ceil(count/ITEM_PER_PAGE);

        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            usersdata})
    } catch (error) {
        res.status(401).json(error)
    }
}
// singleuserget
exports.singleuserget = async (req, res) => {

    const { id } = req.params;
    try {
        const userdata = await users.findOne({ _id: id })
        res.status(200).json(userdata)
    } catch (error) {
        res.status(401).json(error)
    }
}

//useredit
exports.useredit = async (req, res) => {
    const { id } = req.params;
    const { fname, lname, date, department, qual1, qual2, status,
        status2, designation, experience, cctc, ectc,
        period, industry, email, mobile, almobile, gender, location, resume, user_profile } = req.body;

    const file = req.file ? req.file.filename : user_profile;

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateuser = await users.findByIdAndUpdate({ _id: id }, {
            fname, lname, date, department, qual1, qual2, status,
            status2, designation, experience, cctc, ectc,
            period, industry, email, mobile, almobile, gender, location, resume, profile: file, dateUpdated
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
                fs.mkdirSync("./public/files/export/")
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
                    Date: user.date ? user.date : "-",
                    Department: user.department ? user.department : "-",
                    Qualification1: user.status ? user.status : "-",
                    Qualification2: user.status2 ? user.status2 : "-",
                    OtherQualification1: user.qual1 ? user.qual1 : "-",
                    OtherQualification2: user.qual2 ? user.qual2 : "-",
                    Designation: user.designation ? user.designation : "-",
                    ExperienceInYrs: user.experience ? user.experience : "-",
                    CurrentctcInLPA: user.cctc ? user.cctc : "-",
                    ExpectedctcInLPA: user.ectc ? user.ectc : "-",
                    NoticePeriodInDays: user.period ? user.period : "-",
                    Industry: user.industry ? user.industry : "-",
                    Email: user.email ? user.email : "-",
                    Mobile: user.mobile ? user.mobile : "-",
                    AlternateMobile: user.almobile ? user.almobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    //Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    ResumeLink: user.resume ? user.resume : "-",
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