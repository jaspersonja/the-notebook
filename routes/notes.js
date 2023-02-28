const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// GET route for retrieving all notes
notes.get('/', (req, res) => {

    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        error ? console.error(error) : res.json(JSON.parse(data))
    });

});

// POST route for new notes
notes.post('/', (req, res) => {

    const { text, title } = req.body;

    if (text && title) {

        const newNote = {
            text,
            title,
            id: uuidv4(),
        }
//read and write file 
        fs.readFile('./db/db.json', 'utf8', (error, data) => {
            if (error) {
                console.error(error);
            } else {

                const parsedData = JSON.parse(data);

                parsedData.push(newNote);
                //todo
                fs.writeFile('./db/db.json', JSON.stringify(parsedData, null), (error) => error ? console.log(error) : console.log('New note added'));

            }
        });

        const response = {
            status: 'Success',
            body: newNote,
        };

        res.json(response);
    } else {

        res.json('Error: note could not be posted')
    }
});

// DELETE route
notes.delete('/:id', (req, res) => {

    const noteID = req.params.id;
    
    // retrieves data from json file
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        if (error) {
            console.error(error);
        } else {

           const parseData = JSON.parse(data);

           const result = parseData.filter((note) => note.id !== noteID);
  
           fs.writeFile('./db/db.json', JSON.stringify(result, null), (error) => error ? console.log(error) : console.log(`Note deleted!`));
            
           res.json(`Note has been deleted!`)
        }
  
    });
  
  });
  
module.exports = notes;