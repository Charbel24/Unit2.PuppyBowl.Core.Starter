// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2404-FTB-MT-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;
/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    if (!response.ok) throw new Error("Failed to fetch data from the server");
    const data = await response.json();
    return data.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    if (!response.ok) throw new Error("Failed to fetch data from the server");
    const data = await response.json();
    renderSinglePlayer(data.data.player);
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    if (!response.ok) throw new Error("Failed to Add data to the server");
    const data = await response.json();
    init();
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to fetch data from the server");
    const data = await response.json();
    if (data.success) {
      init();
    }
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const mainEl = document.querySelector("main");
  if (!playerList || playerList.length === 0) {
    mainEl.innerHTML = "No Player Found !";
    return;
  }

  mainEl.innerHTML = "";
  playerList.forEach((player) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>NAME: ${player.name} </h4>
      <P>ID: ${player.id}</P>
      <img src=${player.imageUrl} alt="${player.name}">
     `;
    const detailBtn = document.createElement("button");
    const div = document.createElement("div");
    detailBtn.innerText = "Show details";
    detailBtn.addEventListener("click", (e) => {
      fetchSinglePlayer(player.id);
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", (e) => {
      removePlayer(player.id);
    });

    div.appendChild(detailBtn);
    div.appendChild(deleteBtn);
    card.appendChild(div);
    mainEl.appendChild(card);
  });
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const mainEl = document.querySelector("main");

  mainEl.innerHTML = `
  <div class="card">
     <h4>NAME: ${player.name} </h4>
     <P>ID: ${player.id}</P>
     <P>breed: ${player.breed}</P>
     <P>Team name: ${player?.team?.name}</P>
     <img src=${player.imageUrl} alt="${player.name}">
    </div>
    `;
  const backBtn = document.createElement("button");
  backBtn.innerText = "Return to List";
  backBtn.addEventListener("click", (e) => {
    init();
  });
  mainEl.appendChild(backBtn);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    // TODO
    const form = document.querySelector("#new-player-form");
    form.innerHTML = `
      <input type="text" name="name" placeholder="Name" id="name">
      <input type="text" name="breed" placeholder="Breed" id="breed">
      <select name="status" id="status">
          <option value="">Select status</option>
          <option value="field">bench</option>
          <option value="field">field</option>
      </select>
      <input type="url" name="imageUrl" placeholder="image Url" id="imageUrl">
      <input type="number" name="teamId" placeholder="Team Id" id="teamId">
      <button type="submit">Submit</button>
`;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log();
      const name = e.currentTarget.name.value;
      const breed = e.currentTarget.breed.value;
      const status = e.currentTarget.status.value;
      const imageUrl = e.currentTarget.imageUrl.value;
      const teamId  = +e.currentTarget.teamId.value;
      addNewPlayer({name, breed, status,imageUrl,teamId });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  // console.log(players)
  renderNewPlayerForm();
};

function setTitle() {
  const body = document.querySelector("body");
  const title = "<h1>PuppyBowl</h1>";
  body.insertAdjacentHTML("afterbegin", title);
}
// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  setTitle();
  init();
}
