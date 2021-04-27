'use strict';

var app = angular.module('mySimpleApp', []);

app.controller('GameController', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
    $scope.inncorrectLetterChosen = [];
    $scope.correctLetterChosen = [];
    $scope.displayWord = '';
    $scope.input = {
        letter: ''
    };
    $scope.word = '';

    var getRandomIndex = function () {
        var index = Math.floor(Math.random() * 100) + 1;
        return index;
    };

    var newGame = function () {
        $scope.inncorrectLetterChosen = [];
        $scope.correctLetterChosen = [];
        $scope.displayWord = '';
        var tempDisplay = '';
        for (var i = 0; i < $scope.word.length; i++) {
            tempDisplay += '*';
        }
        $scope.displayWord = tempDisplay;
    };


    function getRandomWord () {
        $http.get('http://random-word-api.herokuapp.com/word?number=' + getRandomIndex())
            .then(function (response) {
                var arrayMaxSize = response.data.length;
                var randomIndexInArray = Math.round(Math.random() * (arrayMaxSize - 1));
                $scope.word = response.data[randomIndexInArray];
                $scope.guesses = response
                    .data[randomIndexInArray]
                    .split('')
                    .filter(function (item, i, ar) {
                        return ar.indexOf(item) === i;
                    }).join('').length;

                newGame();
            });
    }

    $scope.letterChosen = function () {
        for (var i = 0; i < $scope.correctLetterChosen.length; i++) {
            if ($scope.correctLetterChosen[i].toLowerCase() === $scope.input.letter.toLowerCase()) {
                $scope.input.letter = '';
                return;
            }
        }
        for (var i = 0; i < $scope.inncorrectLetterChosen.length; i++) {
            if ($scope.inncorrectLetterChosen[i].toLowerCase() === $scope.input.letter.toLowerCase()) {
                $scope.input.letter = '';
                return;
            }
        }
        var correct = false;

        for (var i = 0; i < $scope.word.length; i++) {
            if ($scope.word[i].toLowerCase() === $scope.input.letter.toLowerCase()) {
                $scope.displayWord = $scope.displayWord.slice(0, i) + $scope.input.letter.toLowerCase() + $scope.displayWord.slice(i + 1);
                correct = true;
            }
        }
        if (correct) {
            $scope.correctLetterChosen.push($scope.input.letter.toLowerCase());
        } else {
            $scope.guesses--;
            $scope.inncorrectLetterChosen.push($scope.input.letter.toLowerCase());
        }
        $scope.input.letter = '';

        if ($scope.displayWord.indexOf('*') === -1) {
            alert('You are won');
            $timeout(function () {
                getRandomWord();
            }, 500);
        }

        if ($scope.guesses === 0) {
            alert('You are lost');
            $timeout(function () {
                getRandomWord();
            }, 500);
        }


    };

    getRandomWord();

}]);

app.directive('autoFocus', function($timeout) {
    return {
        link: function (scope, element, attrs) {
            attrs.$observe("autoFocus", function(newValue){
                if (newValue === "true")
                    $timeout(function(){element.focus()});
            });
        }
    };
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

