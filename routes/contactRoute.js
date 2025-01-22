const express = require('express');
const userAuth = require('../middleware/auth.middleware');
const ContactModel = require('../models/contactModel');

const contactRouter = express.Router();

// create contact
contactRouter.post('/createContact',userAuth, async(req,res)=>{
    const {name,email,phone,company} = req.body;
    try {
        const contacts = await ContactModel.find()
        if(contacts.email == email){
            res.status(400).json({error :"Email already exist"})
        }

        const newContact = new ContactModel({
            name:name,
            email:email,
            phone:phone,
            company:company
        })
         await newContact.save();
         res.status(201).json({message:'contact has been created.',newContact})
           
    } catch (error) {
        console.log("error ", error)
        res.status(500).send({error: error})
    }
})

// fetch contact according to filters -
contactRouter.get('/fetchContacts', userAuth, async (req, res) => {
    const { name, email, phone, company } = req.query; 

    try {
       
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }; 
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }
        if (phone) {
            query.phone = { $regex: phone, $options: 'i' };
        }
        if (company) {
            query.company = { $regex: company, $options: 'i' };
        }

        const contacts = await ContactModel.find(query);
        res.status(200).json({ contacts });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


// Delete contact
contactRouter.delete('/deleteContact/:id', userAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await ContactModel.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact has been deleted.', contact });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Edit contact 
contactRouter.patch('/editContact/:id', userAuth, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        
        const contact = await ContactModel.findById(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

     
        Object.keys(updates).forEach((key) => {
            contact[key] = updates[key];
        });

        await contact.save();
        res.status(200).json({ message: 'Contact has been updated.', contact });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


module.exports = contactRouter;