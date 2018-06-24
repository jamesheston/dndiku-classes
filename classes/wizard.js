const wizardlib = require('../lib/wizardlib')

module.exports = srcPath => {
  return {
    name: 'wizard',
    description: 'Wizards are the weakest of all classes in physical combat. They must seek arcane knowledge to survive.',
    abilityTable: {
      1: { spells: ['burninghands', 'curelightwounds'] },
      // 0: { skills: ['armor', 'charm', ] },
    },
    classXpTable: wizardlib.classXpTable,
    
    // setupPlayer: player => {
    //   this runs every time a character enters the game, *not* during character creation
    // },
  }
}
