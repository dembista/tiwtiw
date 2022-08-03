"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var world = document.querySelector('#gameBoard');
var canvas = document.getElementById('canvas');
var score = document.getElementById('score');
var days = document.getElementById('days');
var endScreen = document.getElementById('endScreen');
var c = world.getContext('2d');
world.width = world.clientWidth;
world.height = world.clientHeight;
var frames = 0;
var keys = {
  ArrowLeft: {
    pessed: false
  },
  ArrowRight: {
    pressed: false
  },
  fired: {
    pressed: false
  }
}; // initialize score to 0

var count = 0;
score.innerHTML = count;
var intervalId = null;
var counter = 60;
days.innerHTML = counter;

function finish() {
  clearInterval(intervalId);
  document.getElementById("days").innerHTML = "TERMINE!";
  clearInterval(intervalId);
}

setInterval(function () {
  counter--;
  if (counter == 0) finish();else {
    document.getElementById("days").innerHTML = counter + " secondes restantes";
  }
  counter = counter <= 0 ? 0 : counter - 0;
}, 1000);

function start() {
  intervalId = setInterval(bip, 1000);
}

var Player =
/*#__PURE__*/
function () {
  function Player() {
    var _this = this;

    _classCallCheck(this, Player);

    this.velocity = {
      x: 0,
      // Vitesse de déplacement sur l'axe des X
      y: 0 // Vitesse de déplacement sur l'axe des Y

    };
    var image = new Image();
    image.src = './space.png';

    image.onload = function () {
      _this.image = image;
      _this.width = 48; // Largeur du vaisseau

      _this.height = 48; // Hauteur du vaisseau

      _this.position = {
        x: world.width / 2 - _this.width / 2,
        // Position sur l'axe des x
        y: world.height - _this.height - 10 // Position sur l'axe des Y

      };
    };
  }

  _createClass(Player, [{
    key: "draw",
    value: function draw() {
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  }, {
    key: "shoot",
    value: function shoot() {
      missiles.push(new Missile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y
        }
      }));
    }
  }, {
    key: "update",
    value: function update() {
      if (this.image) {
        if (keys.ArrowLeft.pressed && this.position.x >= 0) {
          this.velocity.x = -5;
        } else if (keys.ArrowRight.pressed && this.position.x <= world.width - this.width) {
          this.velocity.x = 5;
        } else {
          this.velocity.x = 0;
        }

        this.position.x += this.velocity.x;
        this.draw();
      }
    }
  }]);

  return Player;
}();

var Alien =
/*#__PURE__*/
function () {
  function Alien(_ref) {
    var _this2 = this;

    var position = _ref.position;

    _classCallCheck(this, Alien);

    this.velocity = {
      x: 0,
      y: 0
    };
    var image = new Image();
    image.src = './ghost.png';

    image.onload = function () {
      _this2.image = image;
      _this2.width = 32;
      _this2.height = 32;
      _this2.position = {
        x: position.x,
        y: position.y
      };
    };
  }

  _createClass(Alien, [{
    key: "draw",
    value: function draw() {
      if (this.image) {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
      }
    }
  }, {
    key: "update",
    value: function update(_ref2) {
      var velocity = _ref2.velocity;

      if (this.image) {
        this.position.x += velocity.x;
        this.position.y += velocity.y;

        if (this.position.y + this.height >= world.height) {
          console.log('You loose');
        }
      }

      this.draw();
    }
  }, {
    key: "shoot",
    value: function shoot(alienMissiles) {
      if (this.position) {
        alienMissiles.push(new alienMissile({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          velocity: {
            x: 0,
            y: 3
          }
        }));
      }
    }
  }]);

  return Alien;
}();

var Missile =
/*#__PURE__*/
function () {
  function Missile(_ref3) {
    var position = _ref3.position;

    _classCallCheck(this, Missile);

    this.position = position;
    this.velocity = {
      x: 0,
      y: -5
    };
    this.width = 3;
    this.height = 10;
  }

  _createClass(Missile, [{
    key: "draw",
    value: function draw() {
      c.save();
      c.fillStyle = 'red';
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
      c.fill();
      c.restore();
    }
  }, {
    key: "update",
    value: function update() {
      this.position.y += this.velocity.y;
      this.draw();
    }
  }]);

  return Missile;
}();

var Grid =
/*#__PURE__*/
function () {
  function Grid() {
    _classCallCheck(this, Grid);

    this.position = {
      x: 0,
      y: 0
    };
    this.velocity = {
      x: 1,
      y: 0
    };
    this.invaders = [];
    var rows = Math.floor(world.height / 34 * (1 / 5));
    var colums = Math.floor(world.width / 34 * (2 / 5));
    this.height = rows * 34;
    this.width = colums * 34;

    for (var x = 0; x < colums; x++) {
      for (var y = 0; y < rows; y++) {
        this.invaders.push(new Alien({
          position: {
            x: x * 34,
            y: y * 34
          }
        }));
      }
    }
  }

  _createClass(Grid, [{
    key: "update",
    value: function update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.velocity.y = 0;

      if (this.position.x + this.width >= world.width || this.position.x == 0) {
        this.velocity.x = -this.velocity.x;
        this.velocity.y = 34;
      }
    }
  }]);

  return Grid;
}();

var Particule =
/*#__PURE__*/
function () {
  function Particule(_ref4) {
    var position = _ref4.position,
        velocity = _ref4.velocity,
        radius = _ref4.radius,
        color = _ref4.color;

    _classCallCheck(this, Particule);

    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
  }

  _createClass(Particule, [{
    key: "draw",
    value: function draw() {
      c.save();
      c.globalAlpha = this.opacity;
      c.beginPath();
      c.fillStyle = this.color;
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      c.fill();
      c.closePath();
      c.restore();
    }
  }, {
    key: "update",
    value: function update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.opacity > 0) {
        this.opacity -= 0.01;
      }

      this.draw();
    }
  }]);

  return Particule;
}();

var alienMissile =
/*#__PURE__*/
function () {
  function alienMissile(_ref5) {
    var position = _ref5.position,
        velocity = _ref5.velocity;

    _classCallCheck(this, alienMissile);

    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
  }

  _createClass(alienMissile, [{
    key: "draw",
    value: function draw() {
      // c.beginPath();
      c.save();
      c.fillStyle = 'yellow';
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
      c.fill();
      c.restore();
    }
  }, {
    key: "update",
    value: function update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }]);

  return alienMissile;
}();

var missiles;
var alienMissiles;
var grids;
var player;
var particules;
var lifes;

var init = function init() {
  missiles = [];
  alienMissiles = [];
  grids = [new Grid()];
  player = new Player();
  particules = [];
  lifes = 3;
  keys.ArrowLeft.pressed = false;
  keys.ArrowRight.pressed = false;
  keys.fired.pressed = false;
};

init();

var animationLoop = function animationLoop() {
  c.clearRect(0, 0, world.width, world.height);
  player.update();
  requestAnimationFrame(animationLoop);
  missiles.forEach(function (missile, index) {
    if (missile.position.y + missile.height <= 0) {
      setTimeout(function () {
        missiles.splice(index, 1);
      }, 0);
    } else {
      missile.update();
    }
  });
  grids.forEach(function (grid, indexGrid) {
    grid.update();

    if (frames % 50 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(alienMissiles);
    }

    grid.invaders.forEach(function (invader, indexI) {
      invader.update({
        velocity: grid.velocity
      });
      missiles.forEach(function (missile, indexM) {
        if (missile.position.y <= invader.position.y + invader.height && missile.position.y >= invader.position.y && missile.position.x + missile.width >= invader.position.x && missile.position.x - missile.width <= invader.position.x + invader.width) {
          for (var i = 0; i < 12; i++) {
            particules.push(new Particule({
              position: {
                x: invader.position.x + invader.width / 2,
                y: invader.position.y + invader.height / 2
              },
              velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
              },
              radius: Math.random() * 5 + 1,
              color: 'red'
            }));
          }

          setTimeout(function () {
            grid.invaders.splice(indexI, 1);
            missiles.splice(indexM, 1);
            count++;
            score.innerHTML = count; // counter--;
            // days.innerHTML = counter;

            if (grid.invaders.length === 0 && grids.length == 1) {
              grids.splice(indexGrid, 1);
              grids.push(new Grid());
            }
          }, 0);
        }
      });
    });
  });
  alienMissiles.forEach(function (alienMissile, index) {
    if (alienMissile.position.y + alienMissile.height >= world.height) {
      setTimeout(function () {
        alienMissiles.splice(index, 1);
      }, 0);
    } else {
      alienMissile.update();
    }

    if (alienMissile.position.y + alienMissile.height >= player.position.y && alienMissile.position.y <= player.position.y + player.height && alienMissile.position.x >= player.position.x && alienMissile.position.x + alienMissile.width <= player.position.x + player.width) {
      alienMissiles.splice(index, 1);

      for (var i = 0; i < 22; i++) {
        particules.push(new Particule({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2
          },
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
          },
          radius: Math.random() * 5,
          color: 'white'
        }));
      }

      lostLife();
    }
  });
  particules.forEach(function (particule, index) {
    if (particule.opacity <= 0) {
      particules.splice(index, 1);
    } else {
      particule.update();
    }
  });
  frames++;
};

animationLoop();

var lostLife = function lostLife() {
  lifes--;

  if (lifes <= 0) {
    alert('perdu');
    init();
  }
};

addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      break;
  } // if (daysRemaining > 0) {
  //     daysRemaining--;
  //     days.innerHTML = daysRemaining;
  // }

});
addEventListener('keyup', function (event) {
  switch (event.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;

    case ' ':
      player.shoot();
      break;
  } // let targetElement = e.target || e.srcElement;
  // if (targetElement.classList.contains('virus')) {
  //     targetElement.remove();
  //     count++;
  //     score.innerHTML = count;
  // }

}); // daysLeft = 60;
// gameOverNumber = 50;
// loopPlay = false;
// function start() {
//     count = 0;
//     getFaster = 6000;
//     daysRemaining = daysLeft;
//     canvas.innerHTML = '';
//     score.innerHTML = count;
//     days.innerHTML = daysRemaining;
//     // make sure to not play loop several times
//     loopPlay ? '' : game();
//     loopPlay = true;
//     function game() {
//         let randomTime = Math.round(Math.random() * getFaster);
//         getFaster > 700 ? getFaster = (getFaster * 0.90) : '';
//         setTimeout(() => {
//             if (daysRemaining === 0) {
//                 youWin();
//             } else if (canvas.childElementCount < gameOverNumber) {
//                 animationLoop();
//                 game();
//             } else {
//                 gameOver();
//             }
//         }, randomTime);
//     };
//     const gameOver = () => {
//         endScreen.innerHTML = ` < div class = "gameOver" > Game over < br / > score: $ { count } < /div>`;
//         endScreen.style.visibility = 'visible';
//         endScreen.style.opacity = '1';
//         loopPlay = false;
//     };
//     const youWin = () => {
//         let accuracy = Math.round(count / daysLeft * 100);
//         endScreen.innerHTML = `<div class="youWin">Well done ! You overcome this mother fucker ! <br/><span>Accuarcy: ${accuracy} %</span></div>`;
//         endScreen.style.visibility = 'visible';
//         endScreen.style.opacity = '1';
//         loopPlay = false;
//     };
// }
// // remove element clicked
// document.addEventListener("click", function(e) {
//     let targetElement = e.target || e.srcElement;
//     if (targetElement.classList.contains(alien)) {
//         targetElement.remove();
//         count++;
//         score.innerHTML = count;
//     };
// });
// // hide and screen on click
// endScreen.addEventListener('click', () => {
//     start();
//     setTimeout(() => {
//         endScreen.style.visibility = 'hidden';
//     }, 1000);
// });
//# sourceMappingURL=script.dev.js.map
