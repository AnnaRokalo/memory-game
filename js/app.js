$(document).ready(function() {
    // //fallback for safari as it doesn't support vh
    // if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
    //     $(".game").height( $(window).height() * 0.9 );
    // }

    var cards = ['antler', 'arrows', 'brains', 'codding', 'motorbike', 'rubik', 'selfie', 'style'];
    var pairs = cards.concat(cards);//create pairs of cards

    var chosenCards = [],
        cardsToFlip = [];

    var gameStarted,
        running,
        outOfTime,
        countdownStarted,
        win,
        pairCount,
        time;

    function reset() {
        chosenCards = [];
        cardsToFlip = [];
        gameStarted = false;
        running = false;
        outOfTime = false;
        countdownStarted = false;
        win = false;
        pairCount = 0;
        time = 30;

        shuffleArray(pairs);//shuffle cards
    }

    reset();

    $('.back').each(function(i, element) {
        $(this).attr('id', pairs[i]);//sets id in DOM for cards, access styles via css
    });

    $('.play').click(function(){
        $('.flip-container').each(function() {
            $(this).removeClass('flip');
        });

        reset();

        if (!gameStarted && !running){//before the game starts, show all cards to the user and flip back
            running = true;
            $('.flip-container').each(function() {
                $(this).toggleClass('flip');
            });
            setTimeout(function() {

                $('.flip-container').each(function() {
                    $(this).toggleClass('flip');
                });

                gameStarted = true;
                running = false;

            }, 2000);
        }
        $('.timer').text( time );

    });

    $('.flip-container').click(function(){
        if (!outOfTime) {
            if (!gameStarted && !running){//before the game starts, show all cards to the user and flip back
                running = true;
                $('.flip-container').each(function() {
                    $(this).toggleClass('flip');
                });
                setTimeout(function() {

                    $('.flip-container').each(function() {
                        $(this).toggleClass('flip');
                    });

                    gameStarted = true;
                    running = false;

                }, 2000);
            }
            else if ($(this).find('.back').attr('id') == chosenCards[0] && chosenCards[1] == null && $(this).hasClass('flip') && !running) {
                running = true;
                chosenCards[0] = null;//if one card has been chosen and then clicked again, flip back over
                $(this).toggleClass('flip');
                running = false;
            }
            else if ($(this).hasClass('flip')) {
                return;//if the card clicked is already flipped, return
            }

            else if (chosenCards[0] == null && chosenCards[1] == null && !$(this).hasClass('flip') && !running) {
                if (!countdownStarted) {
                    countdown();
                }
                running = true;
                chosenCards[0] = $(this).find('.back').attr('id');//if no cards have been chosen, store the chosen card's in chosenCards[0]
                $(this).toggleClass('flip');
                running = false;
            }
            else if (chosenCards[0] != null && chosenCards[1] == null && !$(this).hasClass('flip') && !running) {
                running = true;
                chosenCards[1] = $(this).find('.back').attr('id');//if no second card has been flipped, store the chosen card's brand in chosenCards[1] and flip it
                $(this).toggleClass('flip');
                if (chosenCards[0] == chosenCards[1]) {
                    chosenCards[0] = null;
                    chosenCards[1] = null;
                    pairCount++;
                    if (pairCount == cards.length) {
                        win = true;
                        alert("you win :D");
                    }
                    running = false;
                }

                else {//if the cards did not match - empty the chosenCards & flip the cards back over
                    cardsToFlip[0] = chosenCards[0];
                    cardsToFlip[1] = chosenCards[1];
                    chosenCards[0] = null;
                    chosenCards[1] = null;
                    setTimeout(function(){//flip back the chosen cards that did not match

                        $('*[id*=' + cardsToFlip[0] + ']').each(function() {
                            $(this).closest('.flip').toggleClass('flip');
                        });
                        $('*[id*=' + cardsToFlip[1] + ']').each(function() {
                            $(this).closest('.flip').toggleClass('flip');
                        });

                        running = false;

                    }, 800);
                }
            }
        }
    });//Flip Container Click End

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function countdown () {
        countdownStarted = true;
        var timeStart = +new Date;
        var timer = setInterval( function() {
            var timeNow = +new Date;
            var difference = ( timeNow - timeStart ) / 1000; //calculates time difference if game isn't in focus
            if (time > 0 && !win) {// if there is still time left and game isn't won, deduct time
                time = 30;
                time = Math.floor( time - difference );
                $('.timer').text( time );
            } else if (win) {//stop timer when game is won
                clearInterval(timer);

            } else {//stop timer when time is run out
                outOfTime = true;
                alert("you have run out of time :(");

                clearInterval(timer);

                $('.flip-container').each(function() {
                    $(this).removeClass('flip');
                });

                reset();
            }
        }, 250);
    }
});//Document Ready End