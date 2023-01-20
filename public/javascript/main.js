class Card {
  boundingClientRect;
  cardCenterX;
  cardCenterY;
  constructor(cardEl) {
    this.boundingClientRect = cardEl.getBoundingClientRect();
    this.cardCenterX = this.boundingClientRect.left + (this.boundingClientRect.width / 2);
    this.cardCenterY = this.boundingClientRect.top + this.boundingClientRect.height / 2;
    cardEl.addEventListener("mousemove", this.handleMouseMove.bind(this));
    cardEl.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }

  handleMouseLeave(event) {
    //zoom back out
    event.target.style.width = `150px`;
    event.target.style.height = `200px`;

    //restore perspective
    event.target.style.transform = `perspective(500px)`;
    event.target.style.boxShadow = `0 0 0 0 rgba(0, 0, 0, 0.5)`;

    //restore lighting
    event.target.style.filter = `brightness(1)`;
  }

  handleMouseMove(event) {
    const rotateX = this.rotate(event.x,this.cardCenterX);
    const rotateY = -this.rotate(event.y,this.cardCenterY);
    const brightnessVal = this.brightness(event.y,this.cardCenterY);

    //zoom in
    event.target.style.width = `300px`;
    event.target.style.height = `400px`;
    
    //rotate
    event.target.style.transform = `perspective(1000px) rotateY(${rotateX}deg) rotateX(${rotateY}deg)`;
    event.target.style.boxShadow = `${-rotateX}px ${rotateY}px 40px 0px rgba(0, 0, 0, 0.5)`;
    
    //create lighting
    event.target.style.filter = `brightness(${brightnessVal})`;
  }

  rotate(cursorPos, centerPos, rotateLimit = 20) {
    const centerDistance = cursorPos - centerPos;
    if (centerDistance >= 0) {
      return Math.min(centerDistance, rotateLimit);
    } else {
      return Math.max(centerDistance, -rotateLimit);
    }
  }

  //Intensity goes up as value goes down
  brightness(cursorPosY, centerPosY, intensity = 200) {
    return 1 - this.rotate(cursorPosY, centerPosY) / intensity;
  }
}

const cardEls = document.getElementsByClassName("card");
const cards = [];
[...cardEls].forEach((card) => {
  cards.push(new Card(card));
});
