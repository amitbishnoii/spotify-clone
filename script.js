let currentSong = new Audio();

function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    const mm = String(minutes).padStart(2, "0");
    const ss = String(second).padStart(2, "0");
    return `${mm}:${ss}`;
}

async function fetchSongs() {
    let response = await fetch("http://127.0.0.1:5500/songs/");
    let htmlText = await response.text();
    let div = document.createElement("div");
    div.innerHTML = htmlText;
    let lis = div.getElementsByTagName("li");
    let names = [];
    for (let li of lis) {
        let anchor = li.querySelector("a");
        if (anchor) {
            let href = anchor.getAttribute("href");
            if (href) {
                names.push(href.split("/songs/")[1]);
            }
        }
    }
    return names;
}

const playSong = (track, pause=false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".song-name").innerHTML = decodeURI(track);
    document.querySelector(".song-duration").innerHTML = "00:00/00:00";
}

async function main() {
    let songs = await fetchSongs();
    playSong(songs[1], true);
    let songUL = document.querySelector(".song-box").getElementsByTagName("ul")[0];
    let counter = 0;
    for (let song of songs) {
        if (counter == 0) {
            counter++;
            continue;
        }
        else {
            song = song.replaceAll("%20", " ");
            songUL.innerHTML = songUL.innerHTML + `
            <li>
                <div class="music-pic">
                    <img src="music.svg">
                </div>
                <div class="info">
                    <div>${song}</div>
                </div>
                <div class="play-now">
                    <img src="play.svg" alt="">
                </div>
            </li>
            `;
        }
    }

    Array.from(document.querySelector(".song-box").getElementsByTagName("li")).forEach(e => {
        console.log(e.querySelector(".info>div").innerHTML);
        e.addEventListener("click", element => {
            playSong(e.querySelector(".info>div").innerHTML);
        });
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".song-duration").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        console.log(e.offsetX);
    })

}

main();