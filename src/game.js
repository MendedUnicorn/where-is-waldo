import UI from './UI';

function gameFactory(charData) {
  const characterPositions = charData;

  function isHit(x, y, imageWidth, imageHeight) {
    let result;
    characterPositions.forEach((char) => {
      let X = char.x * imageWidth;
      let Y = char.y * imageHeight;
      let hitboxX = char.hitboxSizeX * imageHeight;
      let hitboxY = char.hitboxSizeY * imageWidth;
      console.log('X', X, 'Y', Y);
      console.log('imagewidth', imageWidth, 'imageHeight', imageHeight);

      if (x > X && x < X + hitboxX && y > Y && y < Y + hitboxY) {
        console.log('HITTTTTTT', char.name);
        result = char.name;

        console.log('char name inside is hit', char.name);
      } else {
        console.log({ x, y });
      }
    });
    return result;
  }

  function markToCheckPositions(x, y, imageWidth, imageHeight) {
    characterPositions.forEach((char) => {
      let X = char.x * imageWidth;
      let Y = char.y * imageHeight;
      let hitboxX = char.hitboxSizeX * imageHeight;
      let hitboxY = char.hitboxSizeY * imageWidth;
      console.log('X', X, 'Y', Y);
      console.log('imagewidth', imageWidth, 'imageHeight', imageHeight);

      if (x > X && x < X + hitboxX && y > Y && y < Y + hitboxY) {
        console.log('HITTTTTTT', char);

        let hitbox = document.createElement('div');
        let styles = {
          border: '5px solid green',
          position: 'absolute',
          left: X + 'px',
          top: Y + 'px',
          height: hitboxY + 'px',
          width: hitboxX + 'px',
        };
        Object.assign(hitbox.style, styles);

        document.querySelector('.game-container').append(hitbox);
        console.log('char name inside is hit', char.name);

        setTimeout(() => hitbox.remove(), 1000);
      } else {
        console.log({ x, y });
      }
    });
  }

  function clickImage(e, imageWidth, imageHeight) {
    isHit(e.offsetX, e.offsetY, imageWidth, imageHeight);
  }
  function markFound(name) {
    characterPositions.forEach((c) => {
      if (c.name === name) {
        c.found = true;
        console.log(characterPositions);
      }
    });
  }
  function checkIfAllFound() {
    if (
      characterPositions.every((c) => {
        console.log(c);
        return c.found == true;
      })
    ) {
      console.log('Level Finished! Good job!');
      return true;
    }
  }

  return {
    isHit,
    clickImage,
    markFound,
    markToCheckPositions,
    checkIfAllFound,
  };
}

export default gameFactory;
