const {plot} = require('nodeplotlib')
function apprentissage(m, ce, cc, cs, a , longueur) {
    const x = new Array(longueur); 
    const e = new Array(longueur).fill(0); 
    const entree = []
    const h = new Array(ce).fill(0);
    const vk = new Array(ce).fill(0);
    const delta = new Array(ce).fill(0)
  
    const LEARNING_RATE = 0.00001
    const EPOQUE = 10
    let erreur = new Array(entree.length)
   
    const fs = require("fs") 
    x[0] = 0.1;

//Initialisation X
    for (let i = 1; i < longueur; i++) {
        x[i] = a * x[i - 1] * (1 - x[i - 1]);
    }

   for (let i = 0; i < longueur - ce; i++) {
      entree[i] = x.slice(i, i + ce);
      h[i] = e.slice(i,i+ce)
      vk[i] = e.slice(i,i+ce)
      delta[i] = e.slice(i,i+ce)
    }
    
// x attendu
  const attendu = x.slice(ce, longueur)
  

//poids  w à t=1 : [ [ 0.2, 0.1, 0.1 ], [ 0.3, 0.2, 0.3 ], [ 0.2, 0.3 ] ] /[[0.1967957868699919,0.09679335179739489,0.09679219980755419],[0.29345597998411593,0.19343892143976907,0.2934241274583995],[0.06810954082738956,0.13898224192506858]]
    const w = JSON.parse(fs.readFileSync("./poids.json","utf-8"))
   // console.log("w à t=1 :", w)

  for (let i = 0; i < EPOQUE; i++) {
    for (let j = 0; j < entree.length; j++) {

      console.log("w à t=1 :", w)// W ho ampesaina
      console.log("entree", entree[j])// entree[j] ho amesaina

      for (let k = 0; k < m-1; k++) {
        for (let l = 0; l < ce; l++) {
          h[j][k]= h[j][k] + w[k][l] * entree[j][l]  
        }
        vk[j][k] = 1 / (1 + Math.exp(-h[j][k]))
      }
      for (let q = 0; q < m-1; q++) {
        h[j][cc] = h[j][cc] + w[cc][q] * vk[j][q]  
      }
      vk[j][cc] = 1 / (1 + Math.exp(-h[j][cc]))
      console.log("vk: ", vk[j])
      
      //erreur
      erreur[j] = attendu[j] - vk[j][cc] 
      console.log("attendu", attendu[j])// ATTENDU
      console.log("erreur", erreur[j])//ERREUR

      //mitady delta m=3
      let expo = Math.exp(-h[j][cc])
      let prime = Math.pow(1+expo, 2)
      let g = expo/prime
      delta[j][cc] = g * erreur[j] 

      //mitady delta m=2
      for (let m = 0; m < cc; m++) {
        let ex = Math.exp(-h[j][m])//expo
        let pow = Math.pow(1 + ex, 2)// au carrée
        let f = ex/pow
        delta[j][m] = f * (w[cc][m] * delta[j][cc])
      }
      console.log("delta: ", delta[j])// delta

      //mise à jour poids
      for (let n = 0; n < cc; n++) {
        for (let o = 0; o <ce; o++) {
          let d = LEARNING_RATE * delta[j][n] * entree[j][o]
          w[n][o] = w[n][o] + d
        }
        let de = LEARNING_RATE * delta[j][cc] * vk[j][n]
        w[cc][n] = w[cc][n] + de
      }
      fs.writeFileSync("./poids.json", JSON.stringify(w))
      console.log("nouveau poids", w)
      console.log('-------------------------------------------------------------------------------------------------------------------')
    }
  }    
}
//apprentissage(3,3,2,1,2,500)
      function predictionUnPas(m, ce, cc, cs, a , longueur) {
        const x = new Array(longueur); 
        const e = new Array(longueur).fill(0); 
        const entree = []
        const erreur = []
        const h = [];
        const vk = [];
        let vk2 = new Array(entree.length)
        const fs = require("fs") 
        const w = JSON.parse(fs.readFileSync("./poids.json","utf-8"))
        x[0] = 0.1;

        for (let i = 1; i < longueur; i++) {
          x[i] = a * x[i - 1] * (1 - x[i - 1]);
      }

      for (let i = 0; i < longueur - ce; i++) {
        entree[i] = x.slice(i, i + ce);
        h[i] = e.slice(i,i+ce)
        vk[i] = e.slice(i,i+ce)
      }
      //console.log("h", h)
      // x attendu
      const attendu = x.slice(ce, longueur)
      console.log("w: ", w)

      for (let i = 0; i < entree.length; i++) {  
        console.log("entree et attendu", entree[i], attendu[i])
        for (let j = 0; j < m-1; j++) {
          for (let k = 0; k < ce; k++) {
            h[i][j] = h[i][j] + w[j][k]*entree[i][k]  
          }
          vk[i][j] = 1 / (1 + Math.exp(-h[i][j]))
        }
        for (let l = 0; l < m-1; l++) {
          h[i][cc] = h[i][cc] + w[cc][l] * vk[i][l]  
        }
        vk[i][cc] = 1 / (1 + Math.exp(-h[i][cc]))
        vk2[i] = vk[i][cc]
        console.log("h: ", h[i])
        console.log("vk: ", vk[i])
        
        //erreur
        erreur[i] = Math.abs(attendu[i] - vk[i][cc]) 
        console.log("erreur", erreur[i])
        //console.log("vk2", [i])//ERREUR
      }
      console.log("erreur", vk2)

      const plotData  = [
        {
          y: vk2,
          type: 'scatter'
        },
        {
          y: attendu,
          type: 'scatter'
        }
      ]
      plot(plotData)

      }
predictionUnPas(3,3,2,1,2,13)

function nPas(m, ce, cc, cs, a, longueur, n){
    const x = new Array(longueur); 
    const entree = []
    let sortie = new Array(entree.length)
    const fs = require("fs") 
    const w = JSON.parse(fs.readFileSync("./poids.json","utf-8"))
    x[0] = 0.1;

    for (let i = 1; i < longueur; i++) {
      x[i] = a * x[i - 1] * (1 - x[i - 1]);
    }
    for (let i = 0; i < longueur - ce; i++) {
      entree[i] = x.slice(i, i + ce);
    }

    // x attendu
    const attendu = x.slice(ce, longueur)
    console.log("Attendu: ", attendu)
    console.log("w: ", w)

    for (let i = 0; i < entree.length; i++) {
      let t = entree[i]
      for (let j = 0; j < n; j++) {
        let V = []
        for (let k = 0; k < m-1; k++) {
          let h = 0
          for (let l = 0; l < ce; l++) {
            h = h + w[k][l] * t[l]
          }
          //console.log("eto h", h)
          V[k] = 1 / (1 + Math.exp(-h))
          //console.log("eto V", V[k])
        }
        let h = 0
        for (let m = 0; m < cc; m++) {
          h = h + w[cc][m] * V[m]
        }
        V[cc] = 1 / (1 + Math.exp(-h))
        console.log("eto V", V)
        let t1 = t.shift()
        console.log("eto t shift", t)
        t.push(V[cc])
        console.log("eto t push", t)
      }
      console.log("t sortant de j", t)
      sortie[i] = t[cc]
      console.log("sortie", sortie[i])
      console.log("--------------------------------------------------------------------------------------------")
    }
    console.log("sortie", sortie)

    const plotData  = [
      {
        y: attendu,
        type: 'scatter'
      },
      {
        y: sortie,
        type: 'scatter'
      }
    ]
    plot(plotData)
}
nPas(3,3,2,1,2,13,20)//m, ce, cc, cs, a, longueur, n