To execute this, just open the lab4.html page.  
On the Chrome Browser, the first guess will reset everything, but after that first reset it will work.  
It works the first time on Firefox.

I set it up so that once a player has entered their name, they continue as the active player through as many games as they want to play.
I didn't see any instructions/requirements on whether it should be a new player each time.  To get a new player the browser must be closed or reset.  
I used session storage for the move History since it was to be rest at each game.  Since requirement 9 said the record for scores should not reset when the browser closes, I used local storage.  Unfortunately, everything I could find said there is nothing that differentiates between the browser closing-opening and the browser being refreshed, so I was not fully able to meet requirment 10.  In lieu I added a button to clear local storage history.
