// CSS
import './App.css';

// React 
import { useCallback, useEffect, useState } from 'react';

// data 
import { wordList } from './data/words'

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
];

const guessesQtd = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState("");

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQtd);
  const [score, setScore] = useState(50);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    console.log(category, word);

    return { category, word };
  }, [words]);

  // start the game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();

    // choose a word
    const { category, word } = pickWordAndCategory();

    console.log(category, word);

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // console.log(category, word);

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const retry = () => {

    setScore(0);
    setGuesses(guessesQtd)

    setGameStage(stages[0].name);
  };

  // processes the letter input 
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    };

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualguessedLetters) => [
        ...actualguessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualLetters) => actualLetters - 1);
    }

  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //=> check if guesses ended  
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states  
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //=> check win condition
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)];

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame]);

  //console.log(guessedLetters);
  //console.log(wrongLetters);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
