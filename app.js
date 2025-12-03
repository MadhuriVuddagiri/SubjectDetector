const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Flashcard = require('./models/Flashcard');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.ATLAS_URI;
console.log("MONO_URI:",MONGO_URI)
mongoose.connect(MONGO_URI).then(()=>console.log("Connection established")).catch((err)=>{console.log("Error in connecting database:",err)});




app.post('/flashcard', async (req, res) => {
  try {
    const { student_id, question, answer } = req.body;
    if (!student_id || !question || !answer) return res.status(400).json({ error: 'Missing fields' });

    const subject =detectSubjectRuleBased(question);

    const card = new Flashcard({ student_id,question, answer, subject });
    await card.save();
      res.json({ message: "Flashcard added successfully", subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});


app.get('/get-subject/:student_id/:limit', async (req, res) => { 
        const {student_id,limit}= req.params; 
        if (!student_id)
             return res.status(400).json({ message: "Missing student_id" });

        const cards = await Flashcard.aggregate([
        { $match: { student_id } },
        { $sample: { size: parseInt(limit) } } 
        ]);
        res.json(cards);
});

function detectSubjectRuleBased(text) {
  text = text.toLowerCase();

  const rules = {
    Biology: ['photosynthesis','cell','mitosis','enzyme','biology','ecosystem','organism','dna','rna','protein','genetics','photosynthesis'],
    Chemistry: ['molecule','compound','chemical','reaction','acid','base','ph', 'stoichiometry','periodic','element','bond','covalent','ionic'],
    Physics: ['force','velocity','acceleration','quantum','relativity','energy','momentum','thermodynamics','coulomb','physics','gravity','oscillation'],
    Mathematics: ['integral','derivative','algebra','geometry','matrix','probability','statistics','calculus','equation','theorem','math','trigonometry'],
    History: ['war','empire','revolution','historic','king','queen','battle','reign','ancient','medieval','history'],
    Geography: ['river','mountain','climate','latitude','longitude','glacier','plate','ocean','country','geography','continent'],
    ComputerScience: ['algorithm','data structure','binary','heap','stack','queue','recursion','programming','node','react','database','api','computer','algorithm'],
    English: ['poem','novel','grammar','metaphor','prose','literature','character','essay','sentence','vocabulary']
  };

  for (const [subject, keywords] of Object.entries(rules)) {
    if (keywords.some(k => text.includes(k))) {
      return subject;
    }
  }
  return "General";
}




app.listen(PORT,console.log(
  `Server started on port ${PORT}`));