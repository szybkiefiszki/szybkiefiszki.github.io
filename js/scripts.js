var app = angular.module('cardsApp', ['ui.router', 'ngAnimate']);

app.config(function($stateProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
  $stateProvider.state({
    name: 'default',
    url: '/',
    templateUrl: 'panel.htm'
  }).state({
    name: 'list',
    url: '/list',
    templateUrl: 'list.htm'
  }).state({
    name: 'config',
    url: '/config',
    templateUrl: 'config.htm'
  });
});

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

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

app.controller('cardsCtrl', function($scope, $timeout, storage) {
    var vm = this;
    vm.loader = true;
    vm.image = null;
    vm.question = "";
    vm.answer = "";
    vm.notiSuccess = false;
    vm.notiWarning = false;
    vm.cards = storage.getCards();

    vm.cards.forEach(function(item, index){
        item.hover = false;
        if(item.active == true) {
            vm.currentCard = index;        
        } 
    });
    
    vm.toggleHover = function(index) {
        if(vm.cards[index].hover) {
            vm.cards[index].hover = false;
        } else {
            vm.cards[index].hover = true;
        }
    }
    
    vm.setPage = function(page) {
        if(page =='home') {
            vm.config = false;
        } else {
            vm.config = true;
        }
    }
    
    vm.removeCard = function(index) {
        if(vm.cards[index].active) {
            vm.changeCard(index+1);
            vm.changeCard(index-1);
        }
        if(index <= vm.currentCard) vm.currentCard--;
        vm.cards.splice(index, 1); 
        
    };
    
    vm.addCard = function() {
        if(vm.question != "" && vm.answer != "") {
            vm.cards.push({
                image: vm.image,
                question: vm.question,
                answer: vm.answer
            });
            if(vm.cards.length==1){
                vm.cards[0].active=true;
                vm.currentCard = 0
            }
            vm.image = null;
            vm.question = "";
            vm.answer = "";
        } else {
            if(!vm.notiWarning) {
                vm.notiWarning = true;
                $timeout(function(){
                    vm.notiWarning = false;
                }, 3000);
            }
        }
    };
    
    vm.changeCard = function(index) {
        if(index >= 0 && index < vm.cards.length) {
            vm.cards[vm.currentCard].active=false;
            vm.currentCard = index;
            vm.cards[vm.currentCard].active=true;
            vm.cards.forEach(function(item){
               item.hover = false; 
            });
        }
    }
    
    vm.syncCards = function() {
        if(storage.saveCards(vm.cards) && !vm.notiSuccess) {
            vm.notiSuccess = true;
            $timeout(function(){
                vm.notiSuccess = false;
            }, 3000);
        }
    }
    
});