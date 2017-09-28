// This is a hack!

(function() {
  let sounds = [new Audio("../../public/webqian/shake.mp3")];
  let shakeAmount = 0;
  let shakeWindow = [];
  let divined = false;
  let rotationX = 0;
  let rotationY = 0;
  const url = "https://lunchqian.gds-gov.tech/locations/random";
  let outcome = "unknown";

  fetch(url)
    .then(response => response.json())
    .then(json => {
      outcome = json.name;
    })
    .catch(error => {
      console.log(error);
    });

  const handleOrientation = event => {
    var x = event.beta; // In degree in the range [-180,180]
    var y = event.gamma; // In degree in the range [-90,90]

    const output = document.querySelector("#output");
    output.innerHTML = "alpha: " + event.alpha + "\n";
    output.innerHTML += "beta : " + x + "\n";
    output.innerHTML += "gamma: " + y + "\n";

    if (x > 90) {
      x = 90;
    }
    if (x < -90) {
      x = -90;
    }

    // Primitive filter for gyro input
    const windowSize = 100;
    shakeWindow = shakeWindow
      .concat([x])
      .slice(shakeWindow.length - windowSize);

    const midpoint = shakeWindow.reduce(
      (acc, val) => acc + val / shakeWindow.length,
      0
    );

    rotationX = x;
    rotationY = y;
    shakeAmount += midpoint - x;
  };

  const updateShake = () => {
    // decay
    shakeAmount *= 0.5;

    const output = document.querySelector("#output2");
    output.innerHTML = "shake: " + shakeAmount + "\n";
    const qians = document.querySelectorAll(".qian");

    // If large enough change
    if (!divined && shakeAmount > 20) {
      document.body.style = "background-color: gold";
      qians.forEach(q => {
        const offset = parseFloat(q.dataset.offset);
        const shakeThis = offset / window.innerHeight + 0.1 < Math.random();

        setTimeout(() => {
          sounds[Math.floor(Math.random() * sounds.length)].play();
        }, 80 * Math.random());

        if (shakeThis) {
          const shake = Math.random() * (1 + offset);
          q.dataset.offset = offset + shake / 2;

          if (q.dataset.offset > window.innerHeight * 0.7) {
            divined = true;
            q.textContent = outcome;
            alert(outcome);
          }
        }
      });
    } else {
      document.body.style = "background-color: lightgray";
    }

    qians.forEach(q => {
      q.style.transform = `translateY(-${q.dataset.offset}px) rotateX(${-(
        rotationX - 90
      ) / 2}deg) rotateY(${rotationY / 2}deg)`;
    });

    requestAnimationFrame(updateShake);
  };

  window.onload = () => {
    requestAnimationFrame(updateShake);

    document.querySelector(".gong-shell").addEventListener("click", () => {
      sounds[Math.floor(Math.random() * sounds.length)].play();
      shakeAmount += 500;
    });
  };

  window.addEventListener("deviceorientation", handleOrientation);
})();
