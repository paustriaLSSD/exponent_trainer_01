const TRAINER_NUMBER = 0
const TRAINER_CONFIG = [
  {
    idString: "#1",
    conceptFunctions: [
      createConcept01,
      createConcept01,
      createConcept01,
      createConcept01,
      createConcept01,
      createConcept02,
      createConcept02,
      createConcept02,
      createConcept03,
      createConcept03,
      createConcept03,
      createConcept03,
      createConcept04,
      createConcept04,
      createConcept04,
      createConcept04,
      createConcept05,
      createConcept05
    ]
  }
]

const KEYCODE_0 = 48
const KEYCODE_1 = 49
const KEYCODE_2 = 50
const KEYCODE_3 = 51
const KEYCODE_4 = 52
const KEYCODE_5 = 53
const KEYCODE_6 = 54
const KEYCODE_7 = 55
const KEYCODE_8 = 56
const KEYCODE_9 = 57
const KEYCODE_PAD_0 = 96
const KEYCODE_PAD_1 = 97
const KEYCODE_PAD_2 = 98
const KEYCODE_PAD_3 = 99
const KEYCODE_PAD_4 = 100
const KEYCODE_PAD_5 = 101
const KEYCODE_PAD_6 = 102
const KEYCODE_PAD_7 = 103
const KEYCODE_PAD_8 = 104
const KEYCODE_PAD_9 = 105
const KEYCODE_ENTER = 13

const GameState = {
  TITLE: "GameState.TITLE",
  TRAINING: "GameState.TRAINING"
}

const TrainerState = {
  WAITING: "TrainerState.WAITING",
  INCORRECT: "TrainerState.INCORRECT",
  CORRECT: "TrainerState.CORRECT"
}

const ASSET_MANIFEST = [
   { src:"assets/good.wav", id:"good"},
   { src:"assets/bad.wav", id:"bad"}
]


class ExponentTrainer {
  constructor(width, height, stage) {
    this.width = width
    this.height = height
    this.stage = stage
  }

  init() {
    this.gameState = GameState.TITLE

    this.loadingLabel = createLabel(this.stage, "Loading...", 40, "#ffffff", this.width / 2, this.height / 2, "center")
    this.stage.addChild(this.loadingLabel)

    this.loader = new createjs.LoadQueue(true);
    this.loader.installPlugin(createjs.Sound);
    var loader = this.loader

    loader.addEventListener("complete", function() {

      this.stage.removeChild(this.loadingLabel)

      const event = new Event('assetsLoaded');
      dispatchEvent(event);
    }.bind(this));

    const loadNow = true;
    loader.loadManifest(ASSET_MANIFEST, loadNow);
  }

  showGame() {
    var stage = this.stage

    var background = new createjs.Shape();
    background.setBounds(0, 0, this.width, this.height)
    background.graphics.beginFill("#ffffff").drawRect(0, 0, this.width, this.height)
    background.x = this.width * 0.5
    background.y = this.height * 0.5
    setAnchorPointCenter(background)
    stage.addChild(background)
    this.background = background

    background.addEventListener("click", function(event) {
      this.initTrainer()
      this.showTrainer()
    }.bind(this))

    var titleString = "Exponent Trainer\n\n" + TRAINER_CONFIG[TRAINER_NUMBER].idString

    var title = createLabel(stage, titleString, 30, "#000000", this.width * 0.5, this.height * 0.4, "center")
    this.title = title

    var instructions = createLabel(stage, "- click to start -", 15, "#000000", this.width * 0.5, this.height * 0.7, "center")
    this.instructions = instructions
  }

  initTrainer() {
    this.startTime = new Date();
    this.keysPressed = {}
    this.correctAnswers = 0;
    this.totalResponses = 0;
    this.madeMistake = false;

    document.onkeydown = this.keyDown.bind(this)
    document.onkeyup = this.keyUp.bind(this)

    this.gameState = GameState.TRAINING
    this.trainerState = TrainerState.WAITING
  }

  waitForNextPrompt() {
    this.stage.removeChild(this.prompt)
    this.stage.addChild(this.expected)

    this.instructions.text = "Press Enter to continue."
    this.trainerState = TrainerState.CORRECT
  }

  showNextPrompt() {
    this.madeMistake = false

    var stage = this.stage

    this.background.removeAllEventListeners("click");

    stage.removeChild(this.expression)
    stage.removeChild(this.prompt)
    stage.removeChild(this.expected)

    this.instructions.y = this.height * 0.95
    this.instructions.text = "Press the correct number key."

    var concept = getRandomElement(TRAINER_CONFIG[TRAINER_NUMBER].conceptFunctions)()

    var expression = new ExponentialExpression(concept.numerator, concept.denominator, concept.exponent, 30)
    setAnchorPointCenter(expression)
    expression.x = this.width * 0.5
    expression.y = this.height * 0.4
    this.expression = expression
    stage.addChild(expression)

    var equalsLabel = createLabel(stage, "is the same as", 15, "#000000", this.width * 0.5, this.height * 0.55, "center")
    this.equalsLabel = equalsLabel

    var prompt = new ExponentialExpression(concept.promptNumerator, concept.promptDenominator, concept.promptExponent, 30)
    setAnchorPointCenter(prompt)
    prompt.x = this.width * 0.5
    prompt.y = this.height * 0.7
    this.prompt = prompt
    stage.addChild(prompt)

    var expected = new ExponentialExpression(concept.answerNumerator, concept.answerDenominator, concept.answerExponent, 30)
    setAnchorPointCenter(expected)
    expected.x = this.width * 0.5
    expected.y = this.height * 0.7
    this.expected = expected

    this.answer = concept.answer
  }

  showTrainer() {
    var stage = this.stage
    stage.removeChild(this.title)

    var correctLabel = createLabel(stage, "Correct count: " + this.correctAnswers, 15, "#000000", this.width * 0.95, this.height * 0.05, "right")
    this.correctLabel = correctLabel

    var accuracyLabel = createLabel(stage, "Accuracy: " + "-", 15, "#000000", this.width * 0.95, this.height * 0.1, "right")
    this.accuracyLabel = accuracyLabel

    var gradeLabel = createLabel(stage, "Trainer " + TRAINER_CONFIG[TRAINER_NUMBER].idString + " Grade: " + "-", 15, "#000000", this.width * 0.95, this.height * 0.15, "right")
    this.gradeLabel = gradeLabel

    this.showNextPrompt()
  }

  keyDown(event) {
    if (this.keysPressed) {
      this.keysPressed[event.keyCode] = true;
    }
  }

  keyUp(event) {
    if (this.keysPressed && this.keysPressed[event.keyCode]) {
      delete this.keysPressed[event.keyCode];
    }
  }

  shakePrompt() {
    createjs.Tween.get(this.prompt).to({x:this.width * 0.55}, 100, createjs.Ease.cubicOut)
                                   .to({x:this.width * 0.45}, 100, createjs.Ease.cubicInOut)
                                   .to({x:this.width * 0.53}, 100, createjs.Ease.cubicInOut)
                                   .to({x:this.width * 0.49}, 100, createjs.Ease.cubicInOut)
                                   .to({x:this.width * 0.5}, 100, createjs.Ease.cubicInOut)
                                   .wait(800)
                                   .call(function() {
                                     this.trainerState = TrainerState.WAITING
                                   }, null, this)
  }

  handleSubmission(value) {
    var isCorrect = (value == this.answer)

    if (isCorrect) {
      this.addFlyaway(this.prompt.x, this.prompt.y - 30, "Correct!", "#00ff00")
      createjs.Sound.play("good");

      this.totalResponses += 1
      this.correctAnswers += 1

      this.waitForNextPrompt()
    }
    else {
      this.madeMistake = true
      this.totalResponses += 1
      this.trainerState = TrainerState.INCORRECT
      this.addFlyaway(this.prompt.x, this.prompt.y - 30, "Try again...", "#ff0000")
      createjs.Sound.play("bad");
      this.shakePrompt()
    }

    this.updateStats()
  }

  updateStats() {
    this.correctLabel.text = "Correct count: " + this.correctAnswers
    this.accuracyLabel.text = "Accuracy: " + Number(this.correctAnswers / this.totalResponses).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1});

    if (this.correctAnswers >= 15) {
      var grade
      var percentage = this.correctAnswers / this.totalResponses

      if (percentage >= 0.9) {
        grade = "A"
      }
      else if(percentage >= 0.8) {
        grade = "B"
      }
      else if(percentage >= 0.7) {
        grade = "C"
      }
      else if(percentage >= 0.6) {
        grade = "D"
      }
      else {
        grade = "F"
      }

      this.gradeLabel.text = "Trainer " + TRAINER_CONFIG[TRAINER_NUMBER].idString + " Grade: " + grade
    }
  }

  handleInput() {
    if (this.trainerState == TrainerState.WAITING) {
      if (this.keysPressed[KEYCODE_0] || this.keysPressed[KEYCODE_PAD_0]) {
        this.handleSubmission(0);
      }
      else if (this.keysPressed[KEYCODE_1] || this.keysPressed[KEYCODE_PAD_1]) {
        this.handleSubmission(1);
      }
      else if (this.keysPressed[KEYCODE_2] || this.keysPressed[KEYCODE_PAD_2]) {
        this.handleSubmission(2);
      }
      else if (this.keysPressed[KEYCODE_3] || this.keysPressed[KEYCODE_PAD_3]) {
        this.handleSubmission(3);
      }
      else if (this.keysPressed[KEYCODE_4] || this.keysPressed[KEYCODE_PAD_4]) {
        this.handleSubmission(4);
      }
      else if (this.keysPressed[KEYCODE_5] || this.keysPressed[KEYCODE_PAD_5]) {
        this.handleSubmission(5);
      }
      else if (this.keysPressed[KEYCODE_6] || this.keysPressed[KEYCODE_PAD_6]) {
        this.handleSubmission(6);
      }
      else if (this.keysPressed[KEYCODE_7] || this.keysPressed[KEYCODE_PAD_7]) {
        this.handleSubmission(7);
      }
      else if (this.keysPressed[KEYCODE_8] || this.keysPressed[KEYCODE_PAD_8]) {
        this.handleSubmission(8);
      }
      else if (this.keysPressed[KEYCODE_9] || this.keysPressed[KEYCODE_PAD_9]) {
        this.handleSubmission(9);
      }
    }

    if (this.trainerState == TrainerState.CORRECT) {
      if (this.keysPressed[KEYCODE_ENTER]) {
        this.showNextPrompt()
        this.trainerState = TrainerState.WAITING
      }
    }
  }

  update() {
    var stage = this.stage

    if(stage) {
      if (this.gameState == GameState.TRAINING) {
        this.handleInput()
      }
    }
  }

  addFlyaway(x, y, message, color, onComplete=null) {
    var flyaway = new createjs.Text(message, "18px Courier New", color);
    flyaway.textAlign = "center";
    flyaway.x = x
    flyaway.y = y

    var originalColor = color
    var flashColor = "#000000"

    this.stage.addChild(flyaway);
    createjs.Tween.get(flyaway).to({color:flashColor}, 50, null)
                               .wait(50)
                               .to({color:originalColor}, 50, null)
                               .wait(50)
                               .to({color:flashColor}, 50, null)
                               .wait(50)
                               .to({color:originalColor}, 50, null)
                               .wait(50);

    createjs.Tween.get(flyaway).to({y:flyaway.y - 10}, 1000, createjs.Ease.quadOut).call(function() {
        this.stage.removeChild(flyaway);

        if (onComplete) {
          onComplete();
        }
    }, null, this);
  }
};

function createLabel(stage, text, fontSize, color, x, y, alignment) {
  var label = new createjs.Text(text, fontSize + "px Courier New", color, alignment)
  label.x = x
  label.y = y
  label.textAlign = alignment
  stage.addChild(label)

  return label
}
