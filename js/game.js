(Phaser => {
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 400;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;
  const PLAYER_BULLET_SPEED = 6;
  const ENEMY_SPAWN_FREQ = 100;
  const ENEMY_SPEED = 4.5;
  const ENEMY_FIRE_FREQ = 30;
  const ENEMY_BULLET_ACCEL = 100;
  const SQRT_TWO = Math.sqrt(2);
  const randomGenerator = new Phaser.RandomDataGenerator();

  let player;
  let cursors;
  let playerBullets;
  let enemies;
  let enemyBullets;

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  // Core game methods
  function preload() {
    game.load.spritesheet(GFX, '../assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add( handlePlayerFire );

    player = game.add.sprite(186, 186, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();
    enemies = game.add.group();
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
  }

  function update() {
    handlePlayerMovement();
    handleBulletAnimations();
    randomlySpawnEnemy();
    handleEnemyActions();
    handleCollisions();

    cleanup();
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
    playerBullets.add( game.add.sprite(player.x, player.y, GFX, 7));
  }

  function handleBulletAnimations() {
    playerBullets.children.forEach( bullet => bullet.y -= PLAYER_BULLET_SPEED );
    enemyBullets.children.forEach( bullet => {
      game.physics.arcade.accelerateToObject(bullet, player, ENEMY_BULLET_ACCEL);
    });
  }

  function randomlySpawnEnemy() {
    if (randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add( game.add.sprite(randomX, -24, GFX, 0));
    }
  }

  function handleEnemyActions() {
    enemies.children.forEach( enemy => enemy.y += ENEMY_SPEED );
    enemies.children.forEach( enemy => randomEnemyFire(enemy));
  }

  function handlePlayerHit() {
    gameOver();
  }

  function handleCollisions() {
    //check if any bullets touch any enemies
    let enemiesHit = enemies.children
      .filter( enemy => enemy.alive )
      .filter( enemy => {
        return playerBullets.children.some( bullet => enemy.overlap(bullet));
      });

    if (enemiesHit.length) {
      // cleanup bullets that land
      playerBullets.children
        .filter( bullet => bullet.overlap(enemies))
        .forEach( removeBullet );

      enemiesHit.forEach( destroyEnemy );
    }

    // check if enemies hit the player
    enemiesHit = enemies.children
      .filter( enemy => enemy.overlap(player));

    if (enemiesHit.length) {
      handlePlayerHit();

      enemiesHit.forEach( destroyEnemy );
    }

    // check if enemy bullets hit the player
    let enemyBulletsLanded = enemyBullets.children
      .filter( bullet => bullet.overlap(player));

    if (enemyBulletsLanded.length) {
      handlePlayerHit();
      enemyBulletsLanded.forEach( removeBullet );
    }
  }

  function randomEnemyFire(enemy) {
    if (randomGenerator.between(0, ENEMY_FIRE_FREQ) === 0) {
      let enemyBullet = game.add.sprite(enemy.x, enemy.y, GFX, 9);
      enemyBullet.checkWorldBounds = true;
      enemyBullet.outOfBoundsKill = true;
      enemyBullets.add( enemyBullet );
    }
  }

  function cleanup() {
    playerBullets.children
      .filter( bullet => bullet.y < -14 )
      .forEach( bullet => bullet.destroy());
    enemies.children
      .filter( enemy => enemy.y > GAME_HEIGHT || !enemy.alive)
      .forEach( enemy => enemy.destroy());
    enemyBullets.children
      .filter( bullet => !bullet.alive )
      .forEach( bullet => bullet.destroy());
  }

  function removeBullet(bullet) {
    bullet.destroy();
  }

  function destroyEnemy(enemy) {
    enemy.kill();
  }

  function gameOver() {
    game.state.destroy();
    game.add.text(50, 186, `YOUR HEAD ASPLODE`, { fill: `#FFFFFF` });
    let playAgain = game.add.text(120, 300, `Play Again`, { fill: `#FFFFFF` });
    playAgain.inputEnabled = true;
    playAgain.events.onInputUp.add(() => window.location.reload());
  }

})(window.Phaser);