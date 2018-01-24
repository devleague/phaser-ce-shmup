(Phaser => {
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 400;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;

  let player;
  let cursors;

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  // Core game methods
  function preload() {
    game.load.spritesheet(GFX, '../assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  }

  function create() {
    cursors = game.input.keyboard.createCursorKeys();
    player = game.add.sprite(186, 186, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
  }

  function update() {
    handlePlayerMovement();
  }

  // Utility functions
  function handlePlayerMovement() {
    switch (true) {
      case cursors.left.isDown:
        player.x -= player.moveSpeed;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed;
        break;
    }
    switch (true) {
      case cursors.up.isDown:
        player.y -= player.moveSpeed;
        break;
      case cursors.down.isDown:
        player.y += player.moveSpeed;
        break;
    }
  }

})(window.Phaser);