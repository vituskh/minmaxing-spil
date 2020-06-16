
/*-------------------------------------------
	TODO

	Nogle gange "crasher" det, den går til setup skærmen, selvom at det er første gang. 
		Kan ikke reproducere det.
	
--------------------------------------------*/



/*-------------------------------------------
	SETUP
--------------------------------------------*/

const vh = window.innerHeight
const vw = window.innerWidth
document.getElementById("canvas").width = vw * 0.95
document.getElementById("canvas").height = vh * 0.90
var won = false
var meannumber = 0
var listOfAllNumbers = []

var tree = { //placeholder hvis noget går galt
	left: {
		left: {
			left: { number: 1, chosen: 0 },
			right: { number: 2, chosen: 0 },
			chosen: 0
		},
		right: {
			left: { number: 3, chosen: 0 },
			right: { number: 4, chosen: 0 },
			chosen: 0
		},
		chosen: 0
	},
	right: {
		left: {
			left: { number: 5, chosen: 0 },
			right: { number: 6, chosen: 0 },
			chosen: 0
		},
		right: {
			left: { number: 7, chosen: 0 },
			right: { number: 8, chosen: 1 },
			chosen: 1
		},
		chosen: 1
	}
}


/*-------------------------------------------
	FUNKTIONER ANDRE TING KRÆVER
--------------------------------------------*/

function updateCanvas(px, py, i, localTree, RorL) {
	var c = document.getElementById("canvas")
	var ctx = c.getContext("2d")
	if (i == 1) {
		ctx.clearRect(0, 0, c.width, c.height)
		document.getElementById("setup").style.display = "none"
		document.getElementById("ingame").style.display = "block"
		document.getElementById("canvas").style.display = "block"
		updateCanvas(c.width / 2, 0, i + 1, tree.left, "l")
		updateCanvas(c.width / 2, 0, i + 1, tree.right, "r")
	} else {
		ctx.beginPath()
		if (localTree.chosen == 1) {
			ctx.strokeStyle = 'green';
		} else {
			ctx.strokeStyle = 'blue';
		}
		if (RorL == "r") {
			if (typeof localTree.number == "undefined") {
				if (localTree.left.chosen != 1 && localTree.right.chosen != 1 && localTree.chosen == 1) {
					var temp = ctx.strokeStyle
					ctx.strokeStyle = "black"
					ctx.moveTo(0, (i - 1) * 50)
					ctx.lineTo(c.width, (i - 1) * 50)
					ctx.stroke()
					ctx.beginPath()
					ctx.strokeStyle = temp
				}
				ctx.moveTo(px, py)
				ctx.lineTo(px + (c.width / (Math.pow(2, i))), py + 50)
				ctx.stroke()
				updateCanvas(px + (c.width / (Math.pow(2, i))), py + 50, i + 1, localTree.left, "l")
				updateCanvas(px + (c.width / (Math.pow(2, i))), py + 50, i + 1, localTree.right, "r")
			} else {
				ctx.moveTo(px, py)
				ctx.lineTo(px + (c.width / (Math.pow(2, i))), py + 50)
				ctx.stroke()
				ctx.font = "20px Arial";
				ctx.fillText(String(localTree.number), px + (c.width / (Math.pow(2, i))) - 4, py + 70);
			}
		} else {
			if (typeof localTree.number == "undefined") {
				if (localTree.left.chosen != 1 && localTree.right.chosen != 1 && localTree.chosen == 1) {
					ctx.moveTo(0, (i - 1) * 50)
					ctx.lineTo(c.width, (i - 1) * 50)
					ctx.stroke()
					ctx.beginPath()
				}
				ctx.moveTo(px, py)
				ctx.lineTo(px - (c.width / (Math.pow(2, i))), py + 50)
				ctx.stroke()
				updateCanvas(px - (c.width / (Math.pow(2, i))), py + 50, i + 1, localTree.left, "l")
				updateCanvas(px - (c.width / (Math.pow(2, i))), py + 50, i + 1, localTree.right, "r")
			} else {
				ctx.moveTo(px, py)
				ctx.lineTo(px - (c.width / (Math.pow(2, i))), py + 50)
				ctx.stroke()
				ctx.font = "20px Arial";
				ctx.fillText(String(localTree.number), px - (c.width / (Math.pow(2, i))) - 8, py + 70);
			}
		}
	}
}

function randomInt(x, y) { //x y both inclusive
	return Math.floor(Math.random() * ((y - x) + 1) + x);
}

function gennemsnit(arr) {
	var total = 0
	for (let i = 0; i < arr.length; i++) {
		const element = arr[i];
		total += element
	}
	return total / arr.length
}

function getActualNodeValue(minormax, localTree) {
	console.log(localTree.number, localTree)
	if(typeof localTree.number != "undefined") {
		return localTree.number
	} else if (typeof localTree.right.number != "undefined" || typeof localTree.left.number != "undefined") {
		console.log("hmm it goes to it")
		if (minormax == "min") {
			return Math.min(localTree.right.number, localTree.left.number)
		} else {
			return Math.max(localTree.right.number, localTree.left.number)
		}
	} else if (minormax == "min") {
		return Math.min(getActualNodeValue("max", localTree.left), getActualNodeValue("max", localTree.right))
	} else {
		return Math.max(getActualNodeValue("max", localTree.left), getActualNodeValue("max", localTree.right))
	}
}

function returnTreePoint(localTree) {
	if ((localTree.right.chosen == 0 && localTree.left.chosen == 0) || (typeof localTree.right.number != "undefined" || typeof localTree.left.number != "undefined")) {
		return localTree
	} else if (localTree.right.chosen == 1) {
		return returnTreePoint(localTree.right)
	} else if (localTree.left.chosen == 1) {
		return returnTreePoint(localTree.left)
	}
}

function goToSide(side, localTree) {
	if (typeof localTree.right.number != "undefined" || typeof localTree.left.number != "undefined") /*Hvis vi er på en node hvor der kommer talnodes under, så skal vi huske at logge det*/ {
		//win
		if (side == "r") {
			localTree.right.chosen = 1
			if(localTree.right.number <= meannumber) {
				alert("Du vandt! (det endte med et " + localTree.right.number + ", og det skulle være under " + meannumber + ")")
				won = true
			} else {
				alert("Du tabte! (det endte med et " + localTree.right.number + ", og det skulle være under " + meannumber + ")")
				won = true
			}
		} else {
			localTree.left.chosen = 1
			if(localTree.left.number <= meannumber) {
				alert("Du vandt! (det endte med et " + localTree.left.number + ", og det skulle være under " + meannumber + ")")
				won = true
			} else {
				alert("Du tabte! (det endte med et " + localTree.left.number + ", og det skulle være under " + meannumber + ")")
				won = true
			}
		}
		return localTree
	} else if (localTree.right.chosen == 0 && localTree.left.chosen == 0) {
		if (side == "r") {
			localTree.right.chosen = 1
		} else {
			localTree.left.chosen = 1
		}
		return localTree
	} else if (localTree.right.chosen == 1) {
		return {
			left: localTree.left,
			right: goToSide(side, localTree.right),
			chosen: 1
		}
	} else if (localTree.left.chosen == 1) {
		return {
			left: goToSide(side, localTree.left),
			right: localTree.right,
			chosen: 1
		}
	}
}
function returnNewTree(levels) {
	if (levels == 0) {var thisnumber = randomInt(1, 10); listOfAllNumbers.push(thisnumber); return { number: thisnumber, chosen: 0 };}
	return { left: returnNewTree(levels - 1), right: returnNewTree(levels - 1), chosen: 0 }
}

function fullyGoToSide(side) {
	tree = goToSide(side, tree)
	updateCanvas(0, 0, 1, undefined, undefined)
}

/*-------------------------------------------
	FUNKTIONER FOR AT SPILLE OG AI
--------------------------------------------*/

function startGame() {
	tree = returnNewTree(document.getElementById('dif').value)
	updateCanvas(0,0,1, undefined, undefined)
	meannumber = Math.round(gennemsnit(listOfAllNumbers))

	document.getElementById("meannumber").innerHTML = "For at du vinder skal det være <strong>" + meannumber + "</strong> eller under"
}

function play() {
	if (document.getElementById("in").value != "r" && document.getElementById("in").value != "l") { alert("Fejl!\nSkriv enten \"r\" eller \"l\""); return }
	fullyGoToSide(document.getElementById("in").value)
	document.getElementById("in").value = ""
	if(won) {
		document.getElementById("ingame").style.display = "none"
		document.getElementById("restart").style.display = "block"
	} else {
		ai()
	}
	if(won) { // igen fordi hvis aien er den sidste
		document.getElementById("ingame").style.display = "none"
		document.getElementById("restart").style.display = "block"
	}
}

function restart() {
	document.getElementById("setup").style.display = "block"
	document.getElementById("restart").style.display = "none"
	document.getElementById("canvas").style.display = "none"
}

function ai() {
	//console.log( returnTreePoint(tree).right)
	if (getActualNodeValue("min", returnTreePoint(tree).right) >= getActualNodeValue("min", returnTreePoint(tree).left)) {
		fullyGoToSide("r")
	} else {
		fullyGoToSide("l")
	}
}




