const Advantages = {
  Militia: ["Spearmen", "LightCavalry"],
  Spearmen: ["LightCavalry", "HeavyCavalry"],
  LightCavalry: ["FootArcher", "CavalryArcher"],
  HeavyCavalry: ["Militia", "FootArcher", "LightCavalry"],
  CavalryArcher: ["Spearmen", "HeavyCavalry"],
  FootArcher: ["Militia", "CavalryArcher"]
};

// Convert array like ["Type#Count"] to array of objects
const parsePlatoonArray = array =>
  array.map(str => {
    const [type, count] = str.split('#')
    return { type, count: Number(count) }
  });

// Check if attacker type has advantage over defender type
const hasAdvantage = (type1, type2) =>
  Advantages[type1]?.includes(type2)

// Compute effective power for a single battle
const getEffectivePower = (attacker, defender) =>
  hasAdvantage(attacker.type, defender.type)
    ? attacker.count * 2
    : attacker.count

// Decide battle outcome: WIN / LOSE / DRAW
const getBattleOutcome = (own, enemy) => {
  const ownPower = getEffectivePower(own, enemy);
  const enemyPower = getEffectivePower(enemy, own);

  return ownPower > enemyPower ? 'WIN'
       : ownPower < enemyPower ? 'LOSE'
       : 'DRAW'
};

// Count wins in a full 5-battle match
const countWins = (ownPlatoons, enemyPlatoons) =>
  ownPlatoons.reduce((wins, own, i) =>
    getBattleOutcome(own, enemyPlatoons[i]) === 'WIN' ? wins + 1 : wins, 0)

// Iterative Heap's algorithm to generate permutations
const getPermutations = array => {
  const result = [array.slice()];
  const c = Array(array.length).fill(0)
  const a = array.slice()
  let i = 0

  while (i < array.length) {
    if (c[i] < i) {
      const swapIdx = i % 2 === 0 ? 0 : c[i]
      [a[i], a[swapIdx]] = [a[swapIdx], a[i]]
      result.push(a.slice())
      c[i]++
      i = 0
    } else {
      c[i] = 0
      i++
    }
  }

  return result
};

// logic to determine best arrangement
const findBestArrangement = (ownArr, enemyArr) => {
  const ownPlatoons = parsePlatoonArray(ownArr)
  const enemyPlatoons = parsePlatoonArray(enemyArr)

  const permutations = getPermutations(ownPlatoons)

  for (const perm of permutations) {
    if (countWins(perm, enemyPlatoons) >= 3) {
      return perm.map(({ type, count }) => `${type}#${count}`)
    }
  }

  return "There is no chance of winning";
};

// Input as arrays
const myPlatoons = ["Spearmen#10","Militia#30","FootArcher#20","LightCavalry#1000","HeavyCavalry#120"];
const enemyPlatoons = ["Militia#10","Spearmen#10","FootArcher#1000","LightCavalry#120","CavalryArcher#100"];

const result = findBestArrangement(myPlatoons, enemyPlatoons);
console.log(result);
