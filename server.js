const { notes } = require('/db/db.json')
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('/public'));

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

app.use((req, res) => {
    res.status(404).end();
});



function findNoteById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};

function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    return filteredResults;
};

function createNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify({ notesArray }, null, 2)
    );
    return note;
};

// GET to send to notes html 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});


app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// GET to find notes by id

app.get('api/notes/:id', (req, res) => {
    let results = findNoteById(req.params.id, notes);
    res.json(results);
});

// Creates new note

app.post('api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = createNote(req.body, notes);
    res.json(note);
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