// Selecionăm tabla de joc (div-ul unde vom pune cartonașele)
const gameBoard = document.getElementById('game-board');

// Listează imaginile pentru fețele cartonașelor (perechi de la img2.jpg la img7.jpg)
const faces = ['img/img2.jpg', 'img/img3.jpg', 'img/img4.jpg', 
               'img/img5.jpg', 'img/img6.jpg', 'img/img7.jpg'];

// Creăm array-ul complet de cartonașe, care conține fiecare imagine de două ori (pentru perechi)
let cardImages = faces.concat(faces);  // acum cardImages are 12 elemente (6 imagini * 2)

// Amestecăm array-ul de cartonașe, astfel încât perechile să fie în poziții aleatoare
cardImages.sort(() => Math.random() - 0.5);
// (Functia de mai sus compară elementele la întâmplare, efectiv randomizând ordinea în listă)

// Variabile pentru logica jocului
let firstCard = null;        // prima carte întoarsă într-o tură
let secondCard = null;       // a doua carte întoarsă într-o tură
let hasFlippedCard = false;  // indică dacă o carte a fost deja întoarsă și așteaptă pereche
let lockBoard = false;       // blochează jocul temporar dacă două cărți sunt deja întoarse (pentru a aștepta să se întoarcă înapoi)
let matchesFound = 0;        // numără câte perechi au fost găsite

// Funcție pentru a reseta starea după ce am verificat două cartonașe
function resetTurn() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

// Funcție care este apelată când un cartonaș este clicat (întors)
function flipCard() {
  // 'this' se referă la elementul de imagine care a fost clicat
  const clickedCard = this;

  // Dacă tabla este blocată (adică așteptăm să se întoarcă două cărți), nu facem nimic la clic
  if (lockBoard) return;
  // Dacă jucătorul face clic pe același cartonaș ca și primul ales, nu facem nimic (ignorăm clicul)
  if (clickedCard === firstCard) return;

  // Întoarcem cartea: schimbăm imaginea de pe verso cu cea de pe față
  clickedCard.src = clickedCard.dataset.face;

  if (!hasFlippedCard) {
    // Dacă e prima carte întoarsă din tură
    hasFlippedCard = true;
    firstCard = clickedCard;
  } else {
    // Dacă e a doua carte întoarsă
    secondCard = clickedCard;
    // Acum avem două cărți întoarse, putem verifica dacă sunt pereche

    // Comparăm imaginea de pe fața primei și a celei de-a doua cărți
    if (firstCard.dataset.face === secondCard.dataset.face) {
      // Dacă imaginile coincid, am găsit o pereche!
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchesFound += 1;  // creștem numărul de perechi găsite

      // Verificăm dacă jocul s-a terminat (toate cele 6 perechi găsite)
      if (matchesFound === 6) {
        // Afișăm un mesaj de felicitare (toate perechile au fost găsite)
        alert("Felicitări! Ai găsit toate perechile!");
      }
      // Resetează pentru următorul tur (permite jucătorului să continue cu următoarele cărți)
      resetTurn();
    } else {
      // Dacă imaginile nu coincid, nu e pereche - întoarcem înapoi ambele cartonașe după o scurtă pauză
      lockBoard = true;  // blocăm temporar tabla, astfel încât al treilea clic să nu facă nimic

      // Așteptăm 1 secundă (1000 ms) înainte să întoarcem cărțile înapoi cu fața în jos
      setTimeout(() => {
        // Punem la loc imaginea de verso (spatele cărții) pentru ambele cartonașe
        firstCard.src = 'img/img1.jpg';
        secondCard.src = 'img/img1.jpg';

        // Resetează starea pentru a putea continua jocul cu următoarele încercări
        resetTurn();
      }, 1000);
    }
  }
}

// Parcurgem lista de imagini (amestecate) și creăm elementele de img pentru fiecare cartonaș
cardImages.forEach(faceImage => {
  // Creăm o etichetă <img> pentru cartonaș
  const card = document.createElement('img');
  // Setăm sursa inițială a imaginii la verso (spatele cărții, img1.jpg)
  card.src = 'img/img1.jpg';
  // Adăugăm o clasă CSS 'card' pentru stilizare
  card.classList.add('card');
  // Salvăm în element și informația despre fața cardului, folosind un atribut data-*.
  // Atributul data-face va conține calea către imaginea de pe fața cartonașului.
  card.dataset.face = faceImage;

  // Adăugăm un event listener (ascultător de eveniment) pentru clic.
  // Când cartonașul e clicat, se va apela funcția flipCard de mai sus.
  card.addEventListener('click', flipCard);

  // Adăugăm cartonașul la tabla de joc (în div-ul #game-board din HTML)
  gameBoard.appendChild(card);
});
