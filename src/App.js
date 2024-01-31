import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import "./styles.css";

const c_sz = [500, 500];
const s_st = [
  [8, 7],
  [8, 8]
];
const a_st = [8, 3];
const sc = 40;
const SPEED = 150;
const di = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};


const App = () => {
  const cre = useRef();
  const [sn, setsn] = useState(s_st);
  const [ap, setap] = useState(a_st);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gmo, setgmo] = useState(false);

  useInterval(() => gameLoop(), speed);

  const egm = () => {
    setSpeed(null);
    setgmo(true);
  };

  const movesn = ({ keyCode }) =>
  keyCode >= 37 && keyCode <= 40 && setDir(di[keyCode]);

  const createap = () =>
    ap.map((_a, i) => Math.floor(Math.random() * (c_sz[i] / sc)));

  const ccol = (pp, snk = sn) => {
    if (
      pp[0] * sc >= c_sz[0] ||
      pp[0] < 0 ||
      pp[1] * sc >= c_sz[1] ||
      pp[1] < 0
    )
      return true;

    for (const seg of snk) {
      if (pp[0] === seg[0] && pp[1] === seg[1]) return true;
    }
    return false;
  };

  const cacol = newsn => {
    if (newsn[0][0] === ap[0] && newsn[0][1] === ap[1]) {
      let newap = createap();
      while (ccol(newap, newsn)) {
        newap = createap();
      }
      setap(newap);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const scc = JSON.parse(JSON.stringify(sn));
    const nsnh = [scc[0][0] + dir[0], scc[0][1] + dir[1]];
    scc.unshift(nsnh);
    if (ccol(nsnh)) egm();
    if (!cacol(scc)) scc.pop();
    setsn(scc);
  };

  const stg = () => {
    setsn(s_st);
    setap(a_st);
    setDir([0, -1]);
    setSpeed(SPEED);
    setgmo(false);
  };

  useEffect(() => {
    const ctx = cre.current.getContext("2d");
    ctx.setTransform(sc, 0, 0, sc, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    // ctx.fillStyle = "yellow";
    // ctx.shadowColor = "blue";
    // ctx.shadowBlur = 10;
    ctx.fillStyle = "pink";
    sn.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
    ctx.fillStyle = "lightblue";
    ctx.fillRect(ap[0], ap[1], 1, 1);
  }, [sn, ap, gmo]);

  return (
    <div role="button" tabIndex="0" onKeyDown={e => movesn(e)} style={{margin:"0px 0px 0px 30vw "}}>
      <canvas
        style={{ border: "10px solid orange",borderRadius:"10px" }}
        ref={cre}
        width={`${c_sz[0]}px`}
        height={`${c_sz[1]}px`}
       
      />
      <br/>
      <br/>
      {gmo && <div style={{margin:"0px 0px 0px 200px "}}>GAME OVER!</div>}
      <button className="button1" onClick={stg} style={{margin:"0px 0px 0px 200px "}}>Start Game</button>
    </div>
  );
};

export default App;
