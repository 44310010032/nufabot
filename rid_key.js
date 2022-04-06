/*
#######SIMPLE AE########
*/

const fetch = require('node-fetch');
const daftar = async (no,user_name) => {
    let datno = await fetch(`https://key.nufa.co.id/daftar?no=${no}&user_name=${user_name}`);
    let dat = await datno.json();
    return dat;
}

const isilimit = async (no, key) => {
    let datno = await fetch(`https://key.nufa.co.id/isilimit.php?no=${no}&key=${key}`);
    let dat = await datno.json();
    return dat;
}

const minlimit = async (no) => {
    let datno = await fetch(`https://key.nufa.co.id/minlimit.php?no=${no}`);
    return 'oke!';
}

const habiskan  = async (no) => {
    let datno = await fetch(`https://key.nufa.co.id/habiskan.php?no=${no}`);
    return 'oke!';
}



module.exports = {
    daftar,
    isilimit,
    minlimit,
    habiskan
}