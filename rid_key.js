/*
#######SIMPLE AE########
*/

const fetch = require('node-fetch');
const daftar = async (no) => {
	let datno = await fetch(`https://key.notifku.my.id/daftar?no=${no}`);
	let dat = await datno.json();
	return dat;
}

const isilimit = async (no, key) => {
	let datno = await fetch(`https://key.notifku.my.id/isilimit.php?no=${no}&key=${key}`);
	let dat = await datno.json();
	return dat;
}

const minlimit = async (no) => {
	let datno = await fetch(`https://key.notifku.my.id/minlimit.php?no=${no}`);
	let dat = await datno.json();
	return dat;
}

module.exports = {
	daftar,
	isilimit,
	minlimit
}