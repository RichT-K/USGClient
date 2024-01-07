<svelte:options customElement="usg-card-game" />
<script>
    import { onMount, onDestroy } from 'svelte';
    onMount(()=>{
        // Local initialization
        console.log("CustomElement: usg-card-game");
    })
    onDestroy(()=>{
        // Local clean up        
    });
</script>
<div class="Verbiage">
<h1>USGolfers : Golf Card Game</h1>
<ul>
<li>
    <b>The Deck (regular playing card deck):</b>
    <ul>
        <li>2 players 1 deck</li>
        <li>4-6 players 2 decks</li>
        <li>6-12 players 3-4 decks</li>
    </ul>
    <b>Remove half of the 2s and the jokers, they are out of play.</b>
</li>
<li>
    <b>The Board:</b>
    <ul>
    <li>Par Stack: Place the 3s,4s,5s into one stack and shuffle</li> 
    <li>Shot Stack: Place 6s through 9s in one stack and shuffle</li>
    <li>Adjustment Stack: Place As,2s and picture cards in one stack and shuffle</li>
    </ul>
</li>
<li>
    <b>Objective:</b>
    <ul>
        <li>The object, as in golf, is to finish the round with the lowest score.</li>
        <li>When played like Blackjack each player competes against the dealer.</li>
        <li>When played like Hold-Em players compete against each other.</li>
        <li>When played like Rummy points are accumulated through the rounds played.</li>
    </ul>
</li>

<li>
    <h2>Blackjack style :</h2>
    <b>The Deal:</b>
    <ul>
        <li>Players: place a bet</li>
        <li>Deal: Turn over the top card from the Par Stack being a 3,4 or 5
        <li><b>Variation: Deal each player a Par card</b></li>
        <li>Deal: From the Shot Stack deal one card face down around the table
            clockwise starting on the dealers left.</li>
        <li>Deal: From the Adjustment Stack deal one card face up around the table
            clockwise starting on the dealers left.</li>
        <li><b>An Ace or Blackjack is the sum of the initial 2 cards totaling 1 or less</b></li>
        <li><b>Variation: Deal the Dealer's Adjustment card face down</b></li>
        <li>Players: add to their bet or fold</li>
        <li><b>Working around the table from the Dealer's left</b>
        <ul>
            <li>Player: Turn over their Shot card</li>
            <li>Score: The difference between the Shot plus Adjustment minus the Par</li>
            <li>Deal: Repeat from the Adjustment Stack until:
                <ul>
                    <li>Player: Stays</li>
                    <li>Player: Hits up to the maximum number of cards for the Par</li>
                    <li><b>Par 3,4,5: maximum of 1, 2 or 3 more cards respectively to each player.</b></li>
                </ul>
            </li>
        </ul>
        </li>
    </ul>

    <h2>Hold-Em style :</h2>
    <b>The Deal:</b>
    <ul>
        <li>From the Shot Stack deal one card face down around the table
            clockwise starting on the dealers left.</li>
        <li>From the Adjustment Stack deal two cards face down around the table
            clockwise starting on the dealers left.</li>
    </ul>

    <ul>
        <li>Player's anti blinds</li>
        <li>From the Par Stack turn over the top card being a 3,4 or 5</li>
        <li>First Round of Betting</li>
        <li><b>The Flop: </b>
            From the Shot Stack Deal 3 cards in the middle of the table face up
        </li>
        <li>Second Round of betting</li>
        <li><b>The Turn</b>
            From the Adjustment StackDeal 1 card to the right of the Flop
        </li>
        <li>Third Round of betting</li>
        <li><b>The River</b>
            From the Adjustment Stack Deal 1 card to the right of the Flop
        </li>
        <li>Final Round of betting</li>
    </ul>
</li>
<li>
    Points and Scoring:
    <ul>
        <li>The Shot Card: The face value is the Player's starting point value</li>
        <li>
            <b>Adjustment Cards</b>
            <ul>
                <li>The 10 card is neutral with 0 value</li>
                <li>A's cards subtract one point from the Player's total</li>
                <li>2's cards subtract two points from the Player's total</li>
                <li>Joker card subtract three points from the Player's total</li>
                <li></li>
                <li>Jacks are one point Hazard</li>
                <li>Kings and Queens are two point Hazards</li>
            </ul>
        </li>
    </ul>
</li>
</ul>
</div>
<style>
    ul{
        list-style: none;
    }
    p{
        margin:2em;
    }
</style>
    