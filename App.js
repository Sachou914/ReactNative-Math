import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('menu'); 
  const [difficulty, setDifficulty] = useState(null);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [bestScoreEasy, setBestScoreEasy] = useState(0);
  const [bestScoreHard, setBestScoreHard] = useState(0);

  const startGame = (level) => {
    setDifficulty(level);
    setScore(0);
    setUserAnswer('');
    generateNewQuestion(level);
    setTimeLeft(level === 'easy' ? 30 : 15);
    setScreen('game');
  };

  useEffect(() => {
    if (screen === 'game' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && screen === 'game') {
      setMessage(`Temps écoulé ! La bonne réponse était ${correctAnswer}`);
      updateBestScore();
      setScreen('result');
    }
  }, [timeLeft, screen]);

  const generateNewQuestion = (level) => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setCorrectAnswer(level === 'easy' ? n1 + n2 : n1 * n2);
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === correctAnswer) {
      setScore(prev => prev + 1);
      generateNewQuestion(difficulty);
      setUserAnswer('');
      setTimeLeft(difficulty === 'easy' ? 30 : 15);
    } else {
      setMessage(`Mauvaise réponse. La bonne réponse était ${correctAnswer}`);
      updateBestScore();
      setScreen('result');
    }
  };

  const updateBestScore = () => {
    if (difficulty === 'easy' && score > bestScoreEasy) {
      setBestScoreEasy(score);
    } else if (difficulty === 'hard' && score > bestScoreHard) {
      setBestScoreHard(score);
    }
  };

  const resetGame = () => {
    setScreen('menu');
    setUserAnswer('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.gameTitle}>Calculator3000</Text>
      {screen === 'menu' && (
        <View style={styles.menuContainer}>
          <Text style={styles.title}>Choisissez la difficulté</Text>
          <View style={styles.buttonContainer}>
            <Button title="Facile" onPress={() => startGame('easy')} />
            <Button title="Difficile" onPress={() => startGame('hard')} />
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Meilleur score (Facile) : {bestScoreEasy}</Text>
            <Text style={styles.scoreText}>Meilleur score (Difficile) : {bestScoreHard}</Text>
          </View>
        </View>
      )}
      {screen === 'game' && (
        <View>
          <Text style={styles.calculation}>Combien fait {num1} {difficulty === 'easy' ? '+' : 'x'} {num2} ?</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre réponse"
            keyboardType="numeric"
            value={userAnswer}
            onChangeText={setUserAnswer}
          />
          <Button title="Valider" onPress={checkAnswer} />
          <Text style={styles.centerText}>Score: {score}</Text>
          <Text style={styles.centerText}>Temps restant : {timeLeft} secondes</Text>
        </View>
      )}
      {screen === 'result' && (
        <View>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.centerText}>Votre score : {score}</Text>
          <Button title="Revenir au menu" onPress={resetGame} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: 50,
  },
  menuContainer: {
    alignItems: 'center',
    marginTop: 100, 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculation: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '80%',
    textAlign: 'center', 
    alignSelf: 'center', 
  },
  message: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  centerText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
});
