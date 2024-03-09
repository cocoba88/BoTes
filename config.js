global.owner = ['6289628608383']  
global.mods = ['6289628608383'] 
global.prems = ['6289628608383']
global.nameowner = 'MaganG'
global.numberowner = '6289628608383' 
global.mail = 'support@tioprm.eu.org' 
global.gc = '-'
global.instagram = '-'
global.wm = '© MaganG'
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.packname = 'Duuaar'
global.author = 'Nmaxx'
global.autobio = false // Set true untuk mengaktifkan autobio
global.maxwarn = '2' // Peringatan maksimum

//INI WAJIB DI ISI!//
global.btc = '' 
//Daftar terlebih dahulu https://api.botcahx.eu.org

//INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
global.lann = ''
//Daftar https://api.betabotz.eu.org 

global.APIs = {   
  btc: 'https://api.botcahx.eu.org'
}
global.APIKeys = { 
  'https://api.botcahx.eu.org': '' 
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
