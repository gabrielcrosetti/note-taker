const db = require('./db/db.json')
const express = require('express');
const fs = require('fs');
const path = require('path');
const short = require('short-uuid');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// app.use((req, res) => {
//     res.status(404).end();
// });





function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    return filteredResults;
};

function findNoteById(id, notesArray) {
    const result = notesArray.filter(note => note.id !== id);
    console.log(result)
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(result)
    );
    return result;
};

function createNote(body, notesArray) {
    console.log(body)
    const note = {
        id: short.generate(),
        title: body.title,
        text: body.text,
    };
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(notesArray)
    );
    return note;
};

// GET to send to notes html 



app.get('/api/notes', (req, res) => {
    console.log(db)
    // let results = notes;
    // if (req.query) {
    //     results = filterByQuery(req.query, results);
    // }
    res.json(db);
});

// GET to find notes by id

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id)
    let results = findNoteById(req.params.id, db);
    // res.status(200);
    res.json(db)
});

// Creates new note

app.post('/api/notes', (req, res) => {
    console.log(req.body)
    // req.body.id = notes.length.toString();
    const note = createNote(req.body, db);
    res.json(note);
});




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// To return the index.html file

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// Update a note

// To elete a note

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});