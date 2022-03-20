import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import axios from "axios";

function App() {

  const [positions, setPositions] = useState([]);
  const [chosen, setChosen] = useState(0);

  const [fen, setFen] = useState('');
  const [link, setLink] = useState('');
  const [username, setUsername] = useState('');

  const [error, setError] = useState('');

  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get("/positions/all")
    .then(response => {
      // console.log(response.data.positions);
      setPositions(response.data.positions);
    })
    .catch(err => {
      console.log("Error getting positions...");
    });
  }, []);

  const onClickPosition = (e) => {
    setChosen(+e.target.getAttribute("value"));
  }

  const addPosition = (e) => {
    if(!/[prnbqkPRNBQK12345678]{0,8}\/[prnbqkPRNBQK12345678]{0,8}\/[prnbqkPRNBQK12345678]{0,8}\/[prnbqkPRNBQK12345678]{0,8}\/[prnbqkPRNBQK12345678]{0,8}\/[prnbqkPRNBQK12345678]{0,8}\/[prnbqkPRNBQK12345678]{0,8}\/[prnbqkPRNBQK12345678]{0,8}/.test(fen)) {
      setError("Partial FEN not valid");
    } else if(link.trim().length === 0) {
      setError("Must add link");
    } else if(username.trim().length === 0) {
      setError("Add your github username")
    } else {
      setError("");
      axios.post("/positions/add", {
        fen,
        link,
        username
      })
      .then(response => {
        //if it already existed
        var index = -1;
        if(positions.filter(open => open.fen === response.data.fen)) {
          setPositions(positions.map((open, idx) => {
            if(open.fen !== response.data.fen)
              return open;
            index = idx;
            return response.data;
          }))
        } else {
          setPositions([...positions, response.data]);
          index = positions.length;
        }
        setChosen(index);
      })
      .catch(err => {
        console.log("Error getting positions...");
      });
    }
  }

  return (
    <Container className="h-100">
      <Container style={{ display: "flex", flexDirection: "column" }}>
          <InputGroup style={{ marginTop: "2vh" }}>
            <FormControl
              placeholder="Partial FEN (e.g.: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR)"
              aria-label="Partial FEN"
              aria-describedby="basic-addon1"
              onChange={e => {
                setError("");
                setFen(e.target.value);
              }}
              value={fen}
            />
          </InputGroup>
          <InputGroup style={{ marginTop: "2vh" }}>
            <FormControl
              placeholder="Link with timestamp to video (e.g.: https://youtu.be/6IegDENuxU4?t=36)"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={e => setLink(e.target.value)}
              value={link}
            />
          </InputGroup>
          <InputGroup style={{ marginTop: "2vh" }}>
            <FormControl
              placeholder="Github Username"
              aria-label="Github Username"
              aria-describedby="basic-addon1"
              onChange={e => setUsername(e.target.value)}
              value={username}
            />
          </InputGroup>
          <div style={{ color: "red", textAlign: "center" }}>{error.length > 0 ? error: <br />}</div>
          <Button onClick={addPosition} variant="outline-success" style={{ margin: "2vh auto", width: "20vw" }}>Add</Button>
      </Container>
      <Container style={{ display: "flex", height: "70vh" }}>
          <Container style={{ display: "flex", flexDirection: "column", height: "70vh" }} fluid={true}>
            <InputGroup className="pb-3" style={{ marginTop: "2vh" }}>
              <FormControl
                placeholder="Search for position"
                aria-label="FENSearch"
                aria-describedby="basic-addon1"
                onChange={e => setSearch(e.target.value)}
                value={search}
              />
            </InputGroup>
            <Container fluid={true} className="shadow-lg p-3 mb-3 bg-body rounded" style={{ overflowY: "auto", height: "100%", marginRight: "1vw", borderStyle: "solid", borderWidth: "0.5px", borderColor: "gray" }}>
              {
                positions.length > 0 && positions.filter(position => position.fen.includes(search)).map((position, idx) => {
                  return <div key={idx} value={idx} 
                  onClick={onClickPosition}>{chosen === idx ? "> ": ""}<span value={idx}  style={{ cursor: "pointer", textDecoration: "underline" }}>{position.fen}</span></div>
                })
              }
            </Container>
        </Container>
            <Container style={{ display: "flex", flexDirection: "column", alignContent: "center" }}>
            {positions.length > 0 && <img style={{ height: "35vh", margin: "2vh auto" }} src={`https://www.chess.com/dynboard?fen=${positions[chosen].fen}&board=green&piece=neo&size=3`}/> }
              <Container className="shadow-lg bg-body rounded overflow-auto" style={{ overflowY: "auto", height: "100%", minWidth: "400px", maxWidth: "30vw", margin: "1vw auto", borderStyle: "solid", borderWidth: "0.5px", borderColor: "gray" }}>
                <hr/>
                {positions.length > 0 && positions[chosen].file.map((link,idx) => {
                  return <div key={idx}>
                    <div>Link: {link.link}</div>
                    <div>Added By: {link.addedBy}</div>
                    <div>Date Added: {link.dateAdded}</div>
                    <hr/>
                  </div>
                }) }
              </Container>
            </Container>
            
      </Container>
    </Container>
  );
}

export default App;
