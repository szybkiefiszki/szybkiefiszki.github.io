var app = angular.module('cardsApp', []);

app.service('storage', function() {
    this.saveCards = function(cards) {
        var result = [];
        cards.forEach(function(item){
            result.push(JSON.stringify(item));
        });
        localStorage.setItem('fastCards', result.join('|'));
        return true;
    };
    
    this.getCards = function() {
        var result = "", cards = []; 
        result = localStorage.getItem('fastCards');
        
        if(result == "" || result == null) {
            result = '{"question":"Gdzie urodził się Fryderyk Chopin?","answer":"Żelazowa Wola","active":true}|{"question":"W który roku zmarł Ludwig van Beethoven?","answer":"1827r."}|{"question":"W którym roku urodził się Wolfgang Amadeus Mozart?","answer":"1756r."}|{"question":"Gdzie umarł Johannes Brahms?","answer":"W Wiedniu"}|{"question":"W jakich latach żył Georg Friedrich Händel?","answer":"1685 - 1759"}';
        }
            
        result = result.split('|');
        result.forEach(function(item){
            cards.push(JSON.parse(item));
        });
        
        return cards;
    };
}); 

app.controller('cardsCtrl', function($scope, storage) {
    $scope.loader = true;
    $scope.question = "";
    $scope.answer = "";
    $scope.cards = storage.getCards();

    $scope.cards.forEach(function(item, index){
        item.hover = false;
        if(item.active == true) {
            $scope.currentCard = index;        
        } 
    });
    
    $scope.toggleHover = function(index) {
        if($scope.cards[index].hover) {
            $scope.cards[index].hover = false;
        } else {
            $scope.cards[index].hover = true;
        }
    }
    
    $scope.toggleConfig = function(index) {
        if($scope.config) {
            $scope.config = false;
        } else {
            $scope.config = true;
        }
    }
    
    $scope.removeCard = function(index) {
        if($scope.cards[index].active) {
            $scope.changeCard(index+1);
            $scope.changeCard(index-1);
        }
        if(index <= $scope.currentCard) $scope.currentCard--;
        $scope.cards.splice(index, 1); 
        
    };
    
    $scope.addCard = function(index) {
        if($scope.question != "" && $scope.answer != "") {
            $scope.cards.push({
                question: $scope.question,
                answer: $scope.answer
            });
            if($scope.cards.length==1){
                $scope.cards[0].active=true;
                $scope.currentCard = 0
            }
            $scope.question = "";
            $scope.answer = "";
        } else {
            alert("Wprowadź pytanie i odpowiedź.");
        }
    };
    
    $scope.changeCard = function(index) {
        if(index >= 0 && index < $scope.cards.length) {
            $scope.cards[$scope.currentCard].active=false;
            $scope.currentCard = index;
            $scope.cards[$scope.currentCard].active=true;
            $scope.cards.forEach(function(item){
               item.hover = false; 
            });
        }
    }
    
    $scope.syncCards = function() {
        if(storage.saveCards($scope.cards)) {
            alert("zapisano aktualny stan fiszek");
        }
    }
    
});