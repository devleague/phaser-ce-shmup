(Phaser => {
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 400;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;
  const SQRT_TWO = Math.sqrt(2);

  let player;
  let cursors;
  let playerBullets;

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  // Core game methods
  function preload() {
    game.load.spritesheet(GFX, '../assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  }

  function create() {
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add( handlePlayerFire );

    player = game.add.sprite(186, 186, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();

  }

  function update() {
    handlePlayerMovement();
  }

  // Utility functions
  function handlePlayerMovement() {
    let movingH = SQRT_TWO;
    let movingV = SQRT_TWO;

    if (cursors.up.isDown || cursors.down.isDown) {
      movingH = 1;
    }
    if (cursors.left.isDown || cursors.right.isDown) {
      movingV = 1;
    }
    switch (true) {
      case cursors.left.isDown:
        player.x -= player.moveSpeed * movingH;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed * movingH;
        break;
    }
    switch (true) {
      case cursors.up.isDown:
        player.y -= player.moveSpeed * movingV;
        break;
      case cursors.down.isDown:
        player.y += player.moveSpeed * movingV;
        break;
    }
  }

  function handlePlayerFire() {
    console.log('fire');
  }

})(window.Phaser);