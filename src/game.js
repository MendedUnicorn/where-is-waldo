const game = (function game() {
  let characterPositions = [
    { name: 'waldo', x: '398', y: '436', hitboxSizeX: '25', hitboxSizeY: '50' },
    { name: 'wizard', x: '', y: '', hitboxSizeX: '', hitboxSizeY: '' },
    { name: 'odlaw', x: '610', y: '612', hitboxSizeX: '20', hitboxSizeY: '20' },
  ];

  function isHit(x, y, imageWidth, imageHeight) {
    characterPositions.forEach((char) => {
      let X = char.x * (imageWidth / 927.2);
      let Y = char.y * (imageHeight / 572.675);
      console.log('X', X, 'Y', Y);
      console.log('imagewidth', imageWidth, 'imageHeight', imageHeight);
      if (
        x > X &&
        x < X + char.hitboxSizeX &&
        y > Y &&
        y < Y + char.hitboxSizeY
      ) {
        console.log('HITTTTTTT', char);

        let hitbox = document.createElement('div');
        let styles = {
          border: '5px solid green',
          position: 'absolute',
          left: char.x + 'px',
          top: char.y + 'px',
          height: char.hitboxSizeY + 'px',
          width: char.hitboxSizeX + 'px',
        };
        Object.assign(hitbox.style, styles);

        document.querySelector('.game-container').append(hitbox);
        setTimeout(() => hitbox.remove(), 1000);
      } else {
        console.log({ x, y });
      }
    });
  }

  function clickImage(e, imageWidth, imageHeight) {
    console.log(e.offsetX, e.offsetY);
    isHit(e.offsetX, e.offsetY, imageWidth, imageHeight);
  }

  return {
    clickImage,
  };
})();

export default game;
