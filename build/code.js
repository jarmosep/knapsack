var app = angular.module('KnapsackOptimizer', []);

app.controller('MainCtrl', ['$scope', function($scope){

// alkuperäiset kurssit taulukon sisällä objekteina
$scope.tasks = [
    {
      name: 'Projekti',
      points: 20,
      hours: 200
    },
    {
      name: 'Algoritmit',
      points: 2,
      hours: 40
    },
    {
      name: 'Videot',
      points: 5,
      hours: 20
    },
    {
      name: 'Keikka',
      points: 1,
      hours: 10
    },
    {
      name: 'Ohjelmointi',
      points: 9,
      hours: 90
    },
    {
      name: 'Lopputyö',
      points: 17,
      hours: 100
    }
  ];

// uuden kurssin lisäys. Yllä olevaan tasks-taulukkoon pusketaan uusi objekti
$scope.newTask = function(){
  $scope.tasks.push({name:$scope.taskname, points:$scope.taskcredits, hours:$scope.taskhours});
  $scope.taskname = '';
  $scope.taskcredits = '';
  $scope.taskhours = '';
};

// kurssin poistaminen. Parametrilla löydetään objektin indeksiarvo, jonka avulla poistetaan haluttu kurssi
$scope.delete = function(index){
  console.log(index);
  $scope.tasks.splice(index,1);
}

// Dan Woods - knapsack algoritmi
$scope.knapsack = function(items, capacity) {
  var idxItem   = 0,
      idxWeight = 0,
      oldMax    = 0,
      newMax    = 0,
      numItems  = items.length,
      weightMatrix  = new Array(numItems+1),
      keepMatrix    = new Array(numItems+1),
      solutionSet   = [];

  for(idxItem = 0; idxItem < numItems + 1; idxItem++){
    weightMatrix[idxItem] = new Array(capacity+1);
    keepMatrix[idxItem]   = new Array(capacity+1);
  }

  for (idxItem = 0; idxItem <= numItems; idxItem++){
    for (idxWeight = 0; idxWeight <= capacity; idxWeight++){
      if (idxItem === 0 || idxWeight === 0){
        weightMatrix[idxItem][idxWeight] = 0;
      }else if (items[idxItem-1].hours <= idxWeight){
        newMax = items[idxItem-1].points + weightMatrix[idxItem-1][idxWeight-items[idxItem-1].hours];
        oldMax = weightMatrix[idxItem-1][idxWeight];
        if(newMax > oldMax){
          weightMatrix[idxItem][idxWeight]  = newMax;
          keepMatrix[idxItem][idxWeight]    = 1;
        }else{
          weightMatrix[idxItem][idxWeight]  = oldMax;
          keepMatrix[idxItem][idxWeight]    = 0;
        }
      }else{
        weightMatrix[idxItem][idxWeight] = weightMatrix[idxItem-1][idxWeight];
      }
    }
  }

  idxWeight = capacity;
  idxItem   = numItems;
  for(idxItem; idxItem > 0; idxItem--){
    if(keepMatrix[idxItem][idxWeight] === 1){
      solutionSet.push(items[idxItem - 1]);
      idxWeight = idxWeight - items[idxItem - 1].hours;
    }
  }
  return {
    "maxValue": weightMatrix[numItems][capacity],
    "set": solutionSet
  };
}
// oletusarvo tuntikapasiteetille
$scope.sackCapacity = 200;

// optimointifunktio - syötetään näkymän kurssit ja tuntikapasiteetti knapsack funktiolle, ja laitetaan se result-muuttujaan
// result-muuttujaa käytetään myöhemmin näkymässä näyttämään paras pistearvo annetuilla kursseilla ja kapasiteettimäärällä
$scope.optimizeCourses = function(){
  $scope.result = {};
  var items = $scope.tasks;
  var capacity = $scope.sackCapacity;
  $scope.setCap = capacity;
  $scope.result = $scope.knapsack(items, capacity);
  console.log($scope.result);
}

}]);
